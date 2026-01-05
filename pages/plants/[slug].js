import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

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
      summary: 'Thorns can cause injury but the plant is generally non-toxic.',
      symptoms: [],
      what_to_do: '<p>Monitor for mechanical injury from thorns; toxicity is unlikely.</p>'
    }
  }
  const data = fallback[slug]
  if (!data) return { notFound: true }
  return { props: { plant: { ...data, contentHtml: '', slug } } }
}

export async function getStaticPaths() {
  const dir = path.join(process.cwd(), 'content/plants');
  let files = [];
  try { files = fs.readdirSync(dir).filter((f) => f.endsWith('.md')); } catch {}
  let paths = files.map((f) => ({ params: { slug: f.replace(/\.md$/, '') } }));
  if (!paths.length) paths = [{ params: { slug: 'lily' } }, { params: { slug: 'rose' } }]
  return { paths, fallback: 'blocking' };
}

export default function PlantPage({ plant }) {
  const [comments, setComments] = useState([])
  const [userName, setUserName] = useState('')
  const [userContent, setUserContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [openReplies, setOpenReplies] = useState({})
  
  const unsplashPlaceholder = 'https://images.unsplash.com/photo-1545241047-6083a3684587';
  const sageGreen = '#87A96B';
  const sageGreenDark = '#6B8553';
  const warmCream = '#FAF7F2';
  const warmCreamDark = '#F5F1E8';
  const terracotta = '#C17A5F';
  const borderRadius = '24px';
  const borderRadiusSmall = '16px';

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
                {plant.scientific_name && (
                  <p style={{
                    fontSize: '18px',
                    color: '#5A5A5A',
                    fontStyle: 'italic',
                    marginBottom: '24px'
                  }}>
                    {plant.scientific_name}
                  </p>
                )}
                <p style={{
                  fontSize: '18px',
                  color: '#5A5A5A',
                  lineHeight: 1.7,
                  marginBottom: '32px'
                }}>
                  {plant.summary}
                </p>

                {/* Toxicity Level Badge */}
                <div style={{
                  display: 'inline-block',
                  padding: '16px 24px',
                  borderRadius: borderRadiusSmall,
                  background: toxicity.bg,
                  color: toxicity.color,
                  marginBottom: '32px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '24px' }}>{toxicity.icon}</span>
                    <span style={{ fontSize: '20px', fontWeight: 700 }}>{toxicity.label}</span>
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>
                    {toxicity.description}
                  </div>
                </div>

                {/* Care Guide Icons */}
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    background: warmCreamDark,
                    borderRadius: borderRadiusSmall,
                    border: `2px solid ${warmCreamDark}`
                  }}>
                    <span style={{ fontSize: '24px' }}>{careGuide.light.icon}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#2D2D2D' }}>{careGuide.light.label}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    background: warmCreamDark,
                    borderRadius: borderRadiusSmall,
                    border: `2px solid ${warmCreamDark}`
                  }}>
                    <span style={{ fontSize: '24px' }}>{careGuide.water.icon}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#2D2D2D' }}>{careGuide.water.label}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    background: careGuide.petFriendly.level === 'safe' ? `${sageGreen}20` : `${toxicity.bg}20`,
                    borderRadius: borderRadiusSmall,
                    border: `2px solid ${careGuide.petFriendly.level === 'safe' ? sageGreen : toxicity.bg}40`
                  }}>
                    <span style={{ fontSize: '24px' }}>{careGuide.petFriendly.icon}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#2D2D2D' }}>{careGuide.petFriendly.label}</span>
                  </div>
                </div>
              </div>

              {/* Right: Plant Image */}
              <div style={{
                borderRadius: borderRadius,
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                height: '400px'
              }}>
                <SafeImage
                  src={plant.image || unsplashPlaceholder}
                  alt={plant.title}
                  unsplashFallback={unsplashPlaceholder}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  containerStyle={{
                    width: '100%',
                    height: '100%'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Additional Images */}
      {(plant.image2 || plant.image3) && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              marginBottom: '32px'
            }}>
          {plant.image2 && (
                <div style={{
                  borderRadius: borderRadius,
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  height: '280px'
                }}>
                  <SafeImage
                    src={plant.image2}
                    alt={plant.title + ' - 2'}
                    unsplashFallback={unsplashPlaceholder}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    containerStyle={{
                      width: '100%',
                      height: '100%'
                    }}
                  />
                </div>
          )}
          {plant.image3 && (
                <div style={{
                  borderRadius: borderRadius,
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  height: '280px'
                }}>
                  <SafeImage
                    src={plant.image3}
                    alt={plant.title + ' - 3'}
                    unsplashFallback={unsplashPlaceholder}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    containerStyle={{
                      width: '100%',
                      height: '100%'
                    }}
                  />
                </div>
          )}
        </div>
      )}

          {/* Content Sections */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            marginBottom: '32px'
          }}>
            {/* Left Column */}
            <div style={{
              display: 'grid',
              gap: '24px'
            }}>
      {plant.common_names && plant.common_names.length > 0 && (
                <div style={{
                  background: '#fff',
                  borderRadius: borderRadius,
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: `2px solid ${warmCreamDark}`
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: sageGreenDark,
                    marginBottom: '16px'
                  }}>
                    Also Known As
                  </h3>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    {plant.common_names.map((n, i) => (
                      <li key={i} style={{
                        padding: '8px 16px',
                        background: warmCreamDark,
                        borderRadius: borderRadiusSmall,
                        fontSize: '14px',
                        color: '#2D2D2D'
                      }}>
                        {n}
                      </li>
                    ))}
          </ul>
                </div>
              )}

              {(plant.what_to_do_html || plant.what_to_do) && (
                <div style={{
                  background: '#fff',
                  borderRadius: borderRadius,
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: `2px solid ${warmCreamDark}`
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: sageGreenDark,
                    marginBottom: '16px'
                  }}>
                    What to Do
                  </h3>
                  <div 
                    dangerouslySetInnerHTML={{ __html: plant.what_to_do_html || plant.what_to_do }}
                    style={{
                      fontSize: '15px',
                      color: '#5A5A5A',
                      lineHeight: 1.7
                    }}
                  />
                </div>
              )}
            </div>

            {/* Right Column */}
            <div style={{
              display: 'grid',
              gap: '24px'
            }}>
              {(plant.symptoms && plant.symptoms.length > 0) && (
                <div style={{
                  background: '#fff',
                  borderRadius: borderRadius,
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: `2px solid ${warmCreamDark}`
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: sageGreenDark,
                    marginBottom: '16px'
                  }}>
                    Symptoms
                  </h3>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'grid',
                    gap: '8px'
                  }}>
                    {plant.symptoms.map((s, i) => (
                      <li key={i} style={{
                        padding: '12px 16px',
                        background: warmCreamDark,
                        borderRadius: borderRadiusSmall,
                        fontSize: '14px',
                        color: '#2D2D2D'
                      }}>
                        {s}
                      </li>
                    ))}
          </ul>
                </div>
      )}

      {plant.safe_alternatives && plant.safe_alternatives.length > 0 && (
                <div style={{
                  background: '#fff',
                  borderRadius: borderRadius,
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: `2px solid ${warmCreamDark}`
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: sageGreenDark,
                    marginBottom: '16px'
                  }}>
                    Safe Alternatives
                  </h3>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'grid',
                    gap: '8px'
                  }}>
                    {plant.safe_alternatives.map((s, i) => (
                      <li key={i} style={{
                        padding: '12px 16px',
                        background: `${sageGreen}15`,
                        borderRadius: borderRadiusSmall,
                        fontSize: '14px',
                        color: '#2D2D2D',
                        border: `1px solid ${sageGreen}30`
                      }}>
                        {s}
                      </li>
                    ))}
          </ul>
                </div>
              )}
            </div>
          </div>

          {/* Full Width Content */}
          {plant.contentHtml && (
            <div style={{
              background: '#fff',
              borderRadius: borderRadius,
              padding: '32px',
              marginBottom: '32px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              border: `2px solid ${warmCreamDark}`
            }}>
              <div 
                dangerouslySetInnerHTML={{ __html: plant.contentHtml }}
                style={{
                  fontSize: '16px',
                  color: '#5A5A5A',
                  lineHeight: 1.8
                }}
              />
            </div>
          )}

          {/* ASPCA Link */}
      {plant.ascpa_link && (
            <div style={{
              background: '#fff',
              borderRadius: borderRadius,
              padding: '24px',
              marginBottom: '32px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              border: `2px solid ${warmCreamDark}`,
              textAlign: 'center'
            }}>
              <a 
                href={plant.ascpa_link} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  background: sageGreen,
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: borderRadiusSmall,
                  fontWeight: 600,
                  fontSize: '15px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = sageGreenDark;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = sageGreen;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                View on ASPCA.org →
              </a>
            </div>
          )}

          {/* Comments Section */}
          <div style={{
            background: '#fff',
            borderRadius: borderRadius,
            padding: '32px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: `2px solid ${warmCreamDark}`
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: sageGreenDark,
              marginBottom: '24px'
            }}>
              Comments
            </h3>
            {comments.length === 0 && (
              <div style={{ color: '#888', fontSize: '15px', padding: '20px', textAlign: 'center' }}>
                No approved comments yet. Be the first to share your experience!
              </div>
            )}
        {comments.map(c => (
              <div key={c.id} style={{
                border: `2px solid ${warmCreamDark}`,
                borderRadius: borderRadiusSmall,
                padding: '20px',
                marginBottom: '16px',
                background: warmCream
              }}>
                <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
                  {c.author || 'Anonymous'} • {new Date(c.created_at).toLocaleString()}
                </div>
                <div style={{ fontSize: '15px', color: '#2D2D2D', lineHeight: 1.6 }}>
                  {c.content}
                </div>
            {Array.isArray(c.replies) && c.replies.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <button 
                      type="button" 
                      onClick={() => setOpenReplies(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                      style={{
                        padding: '8px 16px',
                        background: 'transparent',
                        border: `2px solid ${sageGreen}`,
                        borderRadius: borderRadiusSmall,
                        color: sageGreenDark,
                        fontWeight: 600,
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = sageGreen;
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = sageGreenDark;
                      }}
                    >
                      {openReplies[c.id] ? 'Hide Replies' : `Show Replies (${c.replies.length})`}
                    </button>
                {openReplies[c.id] && (
                      <div style={{ marginTop: '12px', display: 'grid', gap: '12px' }}>
                    {[...c.replies].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).map(r => (
                          <div key={r.id} style={{
                            border: `1px dashed ${warmCreamDark}`,
                            borderRadius: borderRadiusSmall,
                            padding: '16px',
                            background: '#fff'
                          }}>
                            <div style={{ fontSize: '13px', color: '#888', marginBottom: '6px' }}>
                              {r.author || 'Admin'} • {new Date(r.created_at).toLocaleString()}
                            </div>
                            <div style={{ fontSize: '14px', color: '#2D2D2D', lineHeight: 1.6 }}>
                              {r.content}
                            </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
            <form onSubmit={onSubmit} style={{ marginTop: '24px', display: 'grid', gap: '16px', maxWidth: '600px' }}>
              <input
                placeholder="Your nickname (optional)"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={{
                  padding: '12px 16px',
                  borderRadius: borderRadiusSmall,
                  border: `2px solid ${warmCreamDark}`,
                  fontSize: '15px',
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
