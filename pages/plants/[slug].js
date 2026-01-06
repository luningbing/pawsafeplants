import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';

// Pet Moments Section Component
function PetMomentsSection({ plant }) {
  const [petImages, setPetImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPawModal, setShowPawModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  // Cute pet messages for random selection
  const petMessages = [
    "{petName} loves this plant because it's safe for her to explore!",
    "{petName} enjoys napping near this beautiful plant!",
    "This plant makes {petName} feel safe and happy!",
    "{petName} thinks this plant is a perfect playground!",
    "{petName} can't resist sniffing around this pet-friendly plant!",
    "This plant is {petName}'s favorite spot to relax!",
    "{petName} feels like a queen with this plant around!",
    "This plant brings out the curious side of {petName}!",
    "{petName} approves of this plant choice!",
    "This plant makes {petName}'s day brighter!"
  ];

  const petNames = ["Tofu", "Mochi", "Luna", "Milo", "Coco", "Bella", "Max", "Lucy", "Oliver", "Daisy"];

  // Handle image click to show paw modal
  const handleImageClick = (imageSrc) => {
    setModalImage(imageSrc);
    setShowPawModal(true);
  };

  // Paw Print Component
  const PawPrint = ({ delay, initialX, initialY }) => (
    <motion.div
      initial={{ 
        scale: 0, 
        rotate: 0,
        x: initialX,
        y: initialY,
        opacity: 0
      }}
      animate={{ 
        scale: [0, 1.2, 1], 
        rotate: [0, -10, 10, -5, 0],
        opacity: [0, 1, 1, 1, 0]
      }}
      transition={{ 
        duration: 1,
        delay: delay,
        ease: "easeInOut"
      }}
      style={{
        position: 'fixed',
        fontSize: '40px',
        color: '#FFB6C1', // Pink color
        zIndex: 1000,
        pointerEvents: 'none',
        textShadow: '0 0 10px rgba(255, 182, 193, 0.5)'
      }}
    >
      🐾
    </motion.div>
  );

  useEffect(() => {
    const loadPetImages = async () => {
      try {
        const res = await fetch('/api/list-pets');
        const data = await res.json();
        setPetImages(data.paths || []);
        
        // If plant has a specific pet moment image, use it
        if (plant.pet_moment) {
          setSelectedImage(plant.pet_moment);
        } else if (data.paths && data.paths.length > 0) {
          // Otherwise select a random one
          const randomIndex = Math.floor(Math.random() * data.paths.length);
          setSelectedImage(data.paths[randomIndex]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load pet images:', error);
        setLoading(false);
      }
    };

    loadPetImages();
  }, [plant.pet_moment]);

  if (loading) {
    return (
      <div style={{
        background: warmCream,
        borderRadius: borderRadius,
        padding: '40px',
        marginBottom: '32px',
        textAlign: 'center',
        color: '#666'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '16px' }}>🐱</div>
        <p>Loading pet moments...</p>
      </div>
    );
  }

  if (!selectedImage || petImages.length === 0) {
    return null; // Don't show section if no images available
  }

  // Generate random message
  const randomPetName = petNames[Math.floor(Math.random() * petNames.length)];
  const randomMessage = petMessages[Math.floor(Math.random() * petMessages.length)]
    .replace('{petName}', randomPetName);

  return (
    <>
      <div style={{
        background: warmCream,
        borderRadius: borderRadius,
        padding: '40px',
        marginBottom: '32px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        border: `2px solid ${warmCreamDark}`
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '40px',
          alignItems: 'center'
        }}>
          {/* Left: Content */}
          <div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 700,
              color: sageGreenDark,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              🐱 Pet Moments
            </h2>
            <p style={{
              fontSize: '18px',
              lineHeight: 1.6,
              color: '#2D2D2D',
              marginBottom: '20px',
              fontStyle: 'italic'
            }}>
              {randomMessage}
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              color: '#666',
              fontSize: '14px'
            }}>
              <span style={{
                background: '#fff',
                padding: '6px 12px',
                borderRadius: '20px',
                border: `1px solid ${sageGreen}30`
              }}>
                🌿 Pet-Friendly Plant
              </span>
              <span>
                {plant.toxicity_level?.includes('Safe') ? '✅ Safe for Cats' : '⚠️ Use with Caution'}
              </span>
            </div>
          </div>

          {/* Right: Image */}
          <div style={{
            position: 'relative',
            borderRadius: borderRadiusSmall,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
          }}>
            <div 
              onClick={() => handleImageClick(selectedImage)}
              style={{ cursor: 'pointer' }}
            >
              <SafeImage
                src={selectedImage}
                alt={`${randomPetName} with ${plant.title}`}
                fallback={<span style={{ fontSize: '48px' }}>🐱</span>}
                style={{
                  width: '100%',
                  height: '250px',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
            </div>
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
              color: 'white',
              padding: '16px',
              fontSize: '14px',
              fontWeight: 500
            }}>
              📸 {randomPetName}'s moment with {plant.title}
            </div>
          </div>
        </div>
      </div>

      {/* Paw Modal */}
      <AnimatePresence>
        {showPawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              zIndex: 2000,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onClick={() => setShowPawModal(false)}
          >
            {/* Paw Prints */}
            <PawPrint delay={0} initialX={-150} initialY={-100} />
            <PawPrint delay={0.2} initialX={0} initialY={-150} />
            <PawPrint delay={0.4} initialX={150} initialY={-100} />

            {/* Main Image */}
            <motion.img
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.5,
                delay: 1 // Start after paw prints
              }}
              src={modalImage}
              alt="Pet moment full screen"
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: borderRadiusSmall,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// SafeImage component with Unsplash fallback
function SafeImage({ src, alt, fallback, style, containerStyle, unsplashFallback }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError && unsplashFallback) {
      setImgSrc(unsplashFallback);
      setHasError(false);
    } else {
      setHasError(true);
      setImgSrc(null);
    }
  };

  if (hasError || !imgSrc) {
    return (
      <div style={{
        ...style,
        ...containerStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #87A96B20, #87A96B10)',
        color: '#87A96B'
      }}>
        {fallback || <span style={{ fontSize: '32px' }}>🌿</span>}
      </div>
    );
  }

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      style={style}
      onError={handleError}
    />
  );
}

// Color palette
const sageGreen = '#87A96B';
const sageGreenDark = '#6B8553';
const warmCream = '#FAF7F2';
const warmCreamDark = '#F5F1E8';
const borderRadius = '24px';
const borderRadiusSmall = '16px';

export default function PlantPage({ plant }) {
  const [comments, setComments] = useState([]);
  const [userName, setUserName] = useState('');
  const [userContent, setUserContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const body = { page_path: window.location.pathname, referrer: document.referrer }
      fetch('/api/analytics/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => {})
    } catch {}
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch('/api/comments/list?slug=' + encodeURIComponent(plant.slug))
        const j = await r.json()
        setComments(j.comments || [])
      } catch {}
    }
    load()
  }, [plant.slug])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!userContent.trim()) return
    setSubmitting(true)
    try {
      const body = { slug: plant.slug, user_name: userName, content: userContent }
      const r = await fetch('/api/comments/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (r.ok) {
        setUserContent('')
        setUserName('')
      }
    } catch {} finally {
      setSubmitting(false)
    }
  }

  const getToxicityLevel = (level) => {
    const L = String(level || '').toLowerCase();
    if (L.includes('safe')) return { 
      label: 'Safe for Cats', 
      color: '#fff', 
      bg: sageGreen, 
      icon: '✅',
      description: 'This plant is generally safe for cats and poses minimal risk.'
    };
    if (L.includes('danger') || L.includes('toxic') || L.includes('extreme') || L.includes('fatal')) return { 
      label: 'Toxic to Cats', 
      color: '#fff', 
      bg: '#E85D5D', 
      icon: '❌',
      description: 'This plant is dangerous and can cause serious health issues if ingested.'
    };
    return { 
      label: 'Moderate Risk', 
      color: '#2D2D2D', 
      bg: '#F5C842', 
      icon: '⚠️',
      description: 'This plant may cause mild to moderate symptoms if ingested.'
    };
  };

  const toxicity = getToxicityLevel(plant.toxicity_level);

  // Care Guide icons (placeholder data - can be enhanced with actual data from markdown)
  const careGuide = {
    light: { icon: '☀️', label: 'Bright Indirect Light', level: 'medium' },
    water: { icon: '💧', label: 'Moderate Watering', level: 'medium' },
    petFriendly: toxicity.label === 'Safe for Cats' ? { icon: '🐱', label: 'Cat-Safe', level: 'safe' } : { icon: '🐱', label: 'Keep Away from Cats', level: 'caution' }
  };

  return (
    <>
      <Head>
        <title>{plant.title} - PawSafePlants</title>
        <meta name="description" content={plant.summary || `Learn about ${plant.title} and its safety for cats.`} />
      </Head>

      <div style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
        background: warmCream,
        minHeight: '100vh',
        padding: '20px 0 40px 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {/* Back Link */}
          <Link 
            href="/"
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: sageGreenDark,
              textDecoration: 'none',
              marginBottom: '24px',
              fontWeight: 500,
              fontSize: '15px'
            }}
          >
            ← Back to all plants
          </Link>

          {/* Main Plant Header */}
          <div style={{
            background: '#fff',
            borderRadius: borderRadius,
            padding: '40px',
            marginBottom: '32px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: `2px solid ${warmCreamDark}`
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px', alignItems: 'start' }}>
              {/* Left: Plant Info */}
              <div>
                <h1 style={{
                  fontSize: '48px',
                  fontWeight: 700,
                  color: sageGreenDark,
                  marginBottom: '12px',
                  lineHeight: 1.2
                }}>
                  {plant.title}
                </h1>
                <p style={{
                  fontSize: '18px',
                  color: '#666',
                  marginBottom: '24px',
                  lineHeight: 1.6
                }}>
                  {plant.scientific_name && (
                    <span style={{ fontStyle: 'italic', color: '#888' }}>
                      {plant.scientific_name}
                    </span>
                  )}
                </p>

                {/* Toxicity Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '32px',
                  padding: '12px 20px',
                  backgroundColor: toxicity.bg,
                  color: toxicity.color,
                  borderRadius: '30px',
                  fontWeight: 600,
                  fontSize: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  <span style={{ fontSize: '20px', marginRight: '8px' }}>{toxicity.icon}</span>
                  {toxicity.label}
                </div>

                {/* Description */}
                <div style={{
                  fontSize: '16px',
                  lineHeight: 1.7,
                  color: '#333',
                  marginBottom: '32px'
                }}>
                  {plant.summary}
                </div>

                {/* Care Guide */}
                <div style={{
                  background: warmCream,
                  borderRadius: borderRadiusSmall,
                  padding: '24px',
                  marginBottom: '32px'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: sageGreenDark,
                    marginBottom: '16px'
                  }}>
                    🌿 Quick Care Guide
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {Object.entries(careGuide).map(([key, value]) => (
                      <div key={key} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>{value.icon}</div>
                        <div style={{ fontSize: '14px', color: '#666' }}>{value.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Plant Image */}
              <div>
                <SafeImage
                  src={plant.image}
                  alt={plant.title}
                  unsplashFallback="https://images.unsplash.com/photo-1586952860650-f6c9e65b0a8?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200&h=800&fit=crop"
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: borderRadiusSmall,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Pet Moments Section */}
          <PetMomentsSection plant={plant} />

          {/* What to Do Section */}
          {plant.what_to_do_html && (
            <div style={{
              background: '#fff',
              borderRadius: borderRadius,
              padding: '40px',
              marginBottom: '32px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              border: `2px solid ${warmCreamDark}`
            }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 600,
                color: sageGreenDark,
                marginBottom: '20px'
              }}>
                🚨 What to Do If Your Cat Eats This Plant
              </h2>
              <div 
                dangerouslySetInnerHTML={{ __html: plant.what_to_do_html }}
                style={{
                  fontSize: '16px',
                  lineHeight: 1.7,
                  color: '#333'
                }}
              />
            </div>
          )}

          {/* Comments Section */}
          <div style={{
            background: '#fff',
            borderRadius: borderRadius,
            padding: '40px',
            marginBottom: '32px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: `2px solid ${warmCreamDark}`
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 600,
              color: sageGreenDark,
              marginBottom: '20px'
            }}>
              💬 Community Experiences
            </h2>
            
            {/* Comments List */}
            <div style={{ marginBottom: '24px' }}>
              {comments.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic' }}>
                  No experiences shared yet. Be the first to share your experience!
                </p>
              ) : (
                comments.map((comment, idx) => (
                  <div key={idx} style={{
                    background: warmCream,
                    borderRadius: borderRadiusSmall,
                    padding: '16px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#333' }}>
                      {comment.user_name}
                    </div>
                    <div style={{ fontSize: '14px', lineHeight: 1.5, color: '#666' }}>
                      {comment.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={onSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="Your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: borderRadiusSmall,
                    border: `2px solid ${warmCreamDark}`,
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = sageGreen;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = warmCreamDark;
                  }}
                />
              </div>
              <textarea
                placeholder="Write your comment..."
                value={userContent}
                onChange={(e) => setUserContent(e.target.value)}
                rows={4}
                style={{
                  padding: '12px 16px',
                  borderRadius: borderRadiusSmall,
                  border: `2px solid ${warmCreamDark}`,
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = sageGreen;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = warmCreamDark;
                }}
              />
              <button
                type="submit"
                disabled={submitting || !userContent.trim()}
                style={{
                  padding: '14px 24px',
                  background: submitting || !userContent.trim() ? '#ccc' : sageGreen,
                  color: '#fff',
                  border: 'none',
                  borderRadius: borderRadiusSmall,
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: submitting || !userContent.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!submitting && userContent.trim()) {
                    e.currentTarget.style.background = sageGreenDark;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submitting && userContent.trim()) {
                    e.currentTarget.style.background = sageGreen;
                  }
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Comment (shown after review)'}
              </button>
            </form>
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 968px) {
            div[style*="grid-template-columns: 1fr 400px"] {
              grid-template-columns: 1fr !important;
            }
            div[style*="grid-template-columns: 1fr 1fr"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const fullPath = path.join(process.cwd(), 'content/plants', `${slug}.md`);
  if (fs.existsSync(fullPath)) {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const symptoms = Array.isArray(data.symptoms) ? data.symptoms : [];
    const common_names = Array.isArray(data.common_names) ? data.common_names : [];
    const clinical_signs = Array.isArray(data.clinical_signs) ? data.clinical_signs : [];
    const safe_alternatives = Array.isArray(data.safe_alternatives) ? data.safe_alternatives : [];
    const sources = Array.isArray(data.sources) ? data.sources : [];
    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();
    const what_to_do_html = String(data.what_to_do || '').trim()
      ? (await remark().use(html).process(String(data.what_to_do || ''))).toString()
      : '';
    let image = String(data.image || '');
    let image2 = String(data.image2 || '');
    let image3 = String(data.image3 || '');
    let fallbackHero = '/images/hero-default.svg';
    try {
      const siteRaw = fs.readFileSync(path.join(process.cwd(), 'content', 'site.json'), 'utf8');
      const siteJson = JSON.parse(siteRaw);
      if (siteJson && siteJson.heroImage) fallbackHero = siteJson.heroImage;
    } catch {}
    if (!image) image = fallbackHero;
    if (image) {
      try {
        const clean = image.startsWith('/') ? image.slice(1) : image;
        const abs = path.join(process.cwd(), 'public', clean);
        if (!fs.existsSync(abs)) image = fallbackHero;
      } catch {}
    }
    if (image2) {
      try {
        const clean2 = image2.startsWith('/') ? image2.slice(1) : image2;
        const abs2 = path.join(process.cwd(), 'public', clean2);
        if (!fs.existsSync(abs2)) image2 = '';
      } catch {}
    }
    if (image3) {
      try {
        const clean3 = image3.startsWith('/') ? image3.slice(1) : image3;
        const abs3 = path.join(process.cwd(), 'public', clean3);
        if (!fs.existsSync(abs3)) image3 = '';
      } catch {}
    }
    try {
      const supabaseUrl = process.env.SUPABASE_URL || ''
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
      if (supabaseUrl && supabaseKey) {
        const client = createClient(supabaseUrl, supabaseKey)
        const { data: rows } = await client.from('plant_images').select('image,image2,image3').eq('slug', slug).limit(1)
        const row = Array.isArray(rows) && rows[0] ? rows[0] : {}
        image = String(row.image || image || '')
        image2 = String(row.image2 || image2 || '')
        image3 = String(row.image3 || image3 || '')
      }
    } catch {}
    return {
      props: {
        plant: {
          ...data,
          image,
          image2,
          image3,
          pet_moment: String(data.pet_moment || ''),
          symptoms,
          common_names,
          clinical_signs,
          safe_alternatives,
          sources,
          contentHtml,
          what_to_do_html,
          slug
        }
      }
    };
  }
  const fallback = {
    lily: {
      title: 'Lily',
      scientific_name: 'Lilium spp.',
      toxicity_level: 'DANGER – Highly toxic to cats',
      summary: 'Even small ingestions can cause acute kidney failure in cats.',
      symptoms: ['Vomiting', 'Lethargy', 'Loss of appetite', 'Kidney failure'],
      what_to_do: '<p>Contact your veterinarian immediately. Early decontamination and IV fluids are critical.</p>'
    },
    rose: {
      title: 'Rose',
      scientific_name: 'Rosa spp.',
      toxicity_level: 'Safe – generally non-toxic',
      summary: 'Thorns can cause injury but plant is generally non-toxic.',
      symptoms: [],
      what_to_do: '<p>While generally safe, monitor for any signs of irritation from thorns.</p>'
    }
  };
  return {
    props: {
      plant: fallback[slug] || fallback.lily
    }
  };
}

export async function getStaticPaths() {
  const fs = require('fs');
  const path = require('path');
  const files = fs.readdirSync(path.join(process.cwd(), 'content', 'plants'));
  const paths = files.filter(f => f.endsWith('.md')).map(f => ({
    params: { slug: f.replace('.md', '') }
  }));
  return { paths, fallback: false };
}