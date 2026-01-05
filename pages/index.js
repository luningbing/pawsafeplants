import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useMemo } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function getServerSideProps(context) {
  const plantsDir = path.join(process.cwd(), 'content/plants');
  let plants = [];
  try {
    const filenames = fs.readdirSync(plantsDir).filter((f) => f.endsWith('.md'));
    plants = filenames.map(filename => {
      const slug = filename.replace(/\.md$/, '');
      const fullPath = path.join(plantsDir, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return { slug, ...data };
    });
  } catch {}
  if (!plants.length) {
    plants = [
      {
        slug: 'lily',
        title: 'Lily',
        toxicity_level: 'DANGER – Highly toxic to cats',
        summary: 'Even small ingestions can cause acute kidney failure in cats.'
      },
      {
        slug: 'rose',
        title: 'Rose',
        toxicity_level: 'Safe – generally non-toxic',
        summary: 'Thorns can cause injury but the plant is generally non-toxic.'
      }
    ];
  }
  let heroImage = '/images/hero-default.svg';
  try {
    const origin = (process.env.VERCEL_URL ? ('https://' + process.env.VERCEL_URL) : (`${context.req.headers['x-forwarded-proto'] || 'http'}://${context.req.headers.host}`))
    const r = await fetch(origin + '/api/site-config')
    const j = await r.json()
    heroImage = String((j || {}).heroImage || heroImage)
  } catch {}
  return { props: { plants, site: { heroImage } } };
}

export default function Home({ plants, site }) {
  const featured = [
    { title: 'Sunflowers', level: 'Safe', desc: 'Bright and cat-safe', slug: 'sunflowers', icon: '✅' },
    { title: 'Spider Plant', level: 'Safe', desc: 'Generally safe; mild GI upset possible', slug: 'spider-plant', icon: '✅' },
    { title: 'Aloe Vera', level: 'Caution', desc: 'May cause gastrointestinal upset', slug: 'aloe-vera', icon: '⚠️' }
  ]

  // Community Stories placeholder data
  const communityStories = [
    { id: 1, name: 'Sarah & Max', photo: '/images/placeholder-story1.jpg', plant: 'Spider Plant', location: 'Seattle, WA' },
    { id: 2, name: 'Emma & Luna', photo: '/images/placeholder-story2.jpg', plant: 'Cat Grass', location: 'Portland, OR' },
    { id: 3, name: 'James & Whiskers', photo: '/images/placeholder-story3.jpg', plant: 'Boston Fern', location: 'San Francisco, CA' },
    { id: 4, name: 'Maya & Simba', photo: '/images/placeholder-story4.jpg', plant: 'Areca Palm', location: 'Austin, TX' }
  ]

  useEffect(() => {
    try {
      const body = { page_path: window.location.pathname, referrer: document.referrer }
      fetch('/api/analytics/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => {})
    } catch {}
  }, [])

  const sorted = useMemo(() => {
    return plants.slice().sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')))
  }, [plants])

  const tagStyle = (level) => {
    const L = String(level || '').toLowerCase()
    const safe = L.includes('safe')
    const danger = L.includes('danger') || L.includes('toxic') || L.includes('extreme')
    const caution = !safe && !danger
    const bg = safe ? '#87A96B' : caution ? '#F5C842' : '#E85D5D'
    const color = safe ? '#fff' : caution ? '#2D2D2D' : '#fff'
    return { 
      display: 'inline-block', 
      padding: '6px 12px', 
      borderRadius: '16px', 
      background: bg, 
      color,
      fontSize: '13px',
      fontWeight: 600
    }
  }

  const sageGreen = '#87A96B'
  const sageGreenDark = '#6B8553'
  const warmCream = '#FAF7F2'
  const warmCreamDark = '#F5F1E8'
  const borderRadius = '24px'
  const borderRadiusSmall = '16px'

  return (
    <>
      <Head>
        <title>PawSafePlants - Cat-Safe Plant Guide for Pet Owners</title>
        <meta 
          name="description" 
          content="Discover which plants are safe for your cats. Comprehensive guide to cat-safe and toxic plants, with expert tips for creating a pet-friendly indoor garden." 
        />
        <meta 
          name="keywords" 
          content="cat safe plants, toxic plants for cats, pet friendly plants, indoor plants cats, houseplants safe for cats, cat plant guide" 
        />
        <meta property="og:title" content="PawSafePlants - Cat-Safe Plant Guide for Pet Owners" />
        <meta 
          property="og:description" 
          content="Comprehensive guide to cat-safe and toxic plants. Keep your furry friends safe while enjoying beautiful indoor plants." 
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PawSafePlants - Cat-Safe Plant Guide" />
        <meta 
          name="twitter:description" 
          content="Discover which plants are safe for your cats. Expert guide to pet-friendly indoor gardening." 
        />
        <link rel="canonical" href="https://pawsafeplants.com" />
      </Head>

      <div style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
        background: warmCream,
        minHeight: '100vh',
        padding: '0 0 40px 0'
      }}>
      {site?.heroImage ? (
          <div style={{ margin: '20px 0', borderRadius: borderRadius, overflow: 'hidden', boxShadow: '0 8px 24px rgba(135, 169, 107, 0.15)' }}>
            <img 
              src={site.heroImage} 
              alt="Cat-safe plants for your home" 
              style={{ 
                width: '100%', 
                height: 450, 
                objectFit: 'cover', 
                objectPosition: 'center',
                display: 'block'
              }} 
            />
        </div>
      ) : (
          <div style={{ 
            margin: '20px 0', 
            padding: '32px', 
            background: `linear-gradient(135deg, ${sageGreen}15, ${sageGreen}25)`,
            borderRadius: borderRadius, 
            color: sageGreenDark,
            border: `2px dashed ${sageGreen}40`
          }}>
            <div style={{ fontWeight: 600, fontSize: '18px', marginBottom: '8px' }}>Hero Image Not Configured</div>
            <div style={{ fontSize: '14px', color: '#5A5A5A' }}>
              Configure your hero image in the <Link href="/admin" style={{ color: sageGreenDark, textDecoration: 'underline' }}>Admin Panel</Link>
            </div>
        </div>
      )}

        <div style={{ 
          display: 'grid', 
          gap: 20, 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          marginTop: 24 
        }}>
          <div style={{ 
            border: `2px solid ${warmCreamDark}`, 
            borderRadius: borderRadius, 
            padding: 24, 
            background: '#fff', 
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(135, 169, 107, 0.12)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: '18px', color: sageGreenDark }}>Latest Tips</div>
            <div style={{ display: 'grid', gap: 12 }}>
              <a href="#" style={{ color: sageGreenDark, textDecoration: 'none', fontSize: '15px', lineHeight: 1.6 }}>
                How to Choose Cat-Safe Indoor Plants →
              </a>
              <a href="#" style={{ color: sageGreenDark, textDecoration: 'none', fontSize: '15px', lineHeight: 1.6 }}>
                Identifying Toxic Plants in Your Home →
              </a>
              <a href="#" style={{ color: sageGreenDark, textDecoration: 'none', fontSize: '15px', lineHeight: 1.6 }}>
                Emergency Steps After Plant Ingestion →
              </a>
            </div>
          </div>

          <div style={{ 
            border: `2px solid ${warmCreamDark}`, 
            borderRadius: borderRadius, 
            padding: 24, 
            background: '#fff', 
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(135, 169, 107, 0.12)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontWeight: 700, marginBottom: 16, fontSize: '18px', color: sageGreenDark }}>Popular Plants</div>
            <div style={{ display: 'grid', gap: 14 }}>
            {featured.map((f, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 12 }}>
                <div>
                    <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{f.title}</div>
                    <div style={{ fontSize: '13px', color: '#5A5A5A' }}>{f.desc}</div>
                </div>
                <span style={{ ...tagStyle(f.level) }}>{f.icon} {f.level}</span>
              </div>
            ))}
          </div>
        </div>

          <div style={{ 
            border: `2px solid ${warmCreamDark}`, 
            borderRadius: borderRadius, 
            padding: 24, 
            background: '#fff', 
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(135, 169, 107, 0.12)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: '18px', color: sageGreenDark }}>Resources</div>
            <div style={{ display: 'grid', gap: 12 }}>
              <a href="https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants" target="_blank" rel="noopener noreferrer" style={{ color: sageGreenDark, textDecoration: 'none', fontSize: '15px', lineHeight: 1.6 }}>
                ASPCA Toxicity Database →
              </a>
              <a href="#" style={{ color: sageGreenDark, textDecoration: 'none', fontSize: '15px', lineHeight: 1.6 }}>
                Find Local Animal Hospitals →
              </a>
              <a href="#" style={{ color: sageGreenDark, textDecoration: 'none', fontSize: '15px', lineHeight: 1.6 }}>
                Cat Care Basics & Health →
              </a>
            </div>
          </div>
        </div>

        {/* Community Stories Section */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ 
            fontSize: '32px', 
            color: sageGreenDark, 
            marginBottom: 8,
            fontWeight: 700,
            letterSpacing: '-0.5px'
          }}>
            Community Stories
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#5A5A5A', 
            marginBottom: 24,
            maxWidth: '600px',
            lineHeight: 1.6
          }}>
            See how fellow cat owners are creating beautiful, pet-safe indoor gardens. Share your own story and inspire others!
          </p>
          <div style={{ 
            display: 'grid', 
            gap: 20, 
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' 
          }}>
            {communityStories.map((story) => (
              <div 
                key={story.id}
                style={{ 
                  background: '#fff',
                  borderRadius: borderRadius,
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  border: `2px solid ${warmCreamDark}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(135, 169, 107, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'
                }}
              >
                <div style={{ 
                  width: '100%', 
                  height: 200, 
                  background: `linear-gradient(135deg, ${sageGreen}20, ${sageGreen}10)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px'
                }}>
                  <span>📸</span>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ 
                    fontWeight: 700, 
                    fontSize: '18px', 
                    color: sageGreenDark,
                    marginBottom: '6px'
                  }}>
                    {story.name}
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#5A5A5A',
                    marginBottom: '8px'
                  }}>
                    {story.plant} · {story.location}
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: '#888',
                    fontStyle: 'italic'
                  }}>
                    "Love our pet-safe setup!"
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <a 
              href="#" 
              style={{ 
                display: 'inline-block',
                padding: '14px 28px',
                background: sageGreen,
                color: '#fff',
                textDecoration: 'none',
                borderRadius: borderRadius,
                fontWeight: 600,
                fontSize: '16px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = sageGreenDark
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(135, 169, 107, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = sageGreen
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Share Your Story
            </a>
          </div>
        </div>

        <div id="all-plants" style={{ marginTop: 56 }}>
          <h2 style={{ 
            fontSize: '32px', 
            color: sageGreenDark, 
            marginBottom: 24,
            fontWeight: 700,
            letterSpacing: '-0.5px'
          }}>
            All Plants
          </h2>
          <div style={{ 
            display: 'grid', 
            gap: 20, 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' 
          }}>
            {sorted.map(plant => (
              <div 
                key={plant.slug} 
                style={{ 
                  border: `2px solid ${warmCreamDark}`, 
                  borderRadius: borderRadius, 
                  padding: 20, 
                  background: '#fff', 
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(135, 169, 107, 0.12)'
                  e.currentTarget.style.borderColor = sageGreen + '40'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'
                  e.currentTarget.style.borderColor = warmCreamDark
                }}
              >
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '80px 80px 1fr', 
                  alignItems: 'center', 
                  gap: 12,
                  marginBottom: 12
                }}>
                  <div style={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: borderRadiusSmall, 
                    overflow: 'hidden', 
                    background: warmCreamDark, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: `2px solid ${warmCreamDark}`
                  }}>
                    {plant.thumbPlant ? (
                      <img src={plant.thumbPlant} alt={plant.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : plant.image ? (
                      <img src={plant.image} alt={plant.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: 32 }}>🌿</span>
                    )}
                  </div>
                  <div style={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: borderRadiusSmall, 
                    overflow: 'hidden', 
                    background: warmCreamDark, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: `2px solid ${warmCreamDark}`
                  }}>
                    {plant.thumbCat ? (
                      <img src={plant.thumbCat} alt="cat" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: 32 }}>🐱</span>
                    )}
                </div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>
                      <Link 
                        href={`/plants/${plant.slug}`} 
                        style={{ 
                          color: sageGreenDark, 
                          textDecoration: 'none'
                        }}
                      >
                        {plant.title}
                      </Link>
                    </div>
                    <div style={{ marginTop: 4 }}>
                    {String(plant.toxicity_level || 'Unknown').includes('DANGER')
                        ? <span style={{ fontSize: '20px' }}>❌</span>
                      : String(plant.toxicity_level || '').toLowerCase().includes('safe')
                          ? <span style={{ fontSize: '20px' }}>✅</span>
                          : <span style={{ fontSize: '20px' }}>⚠️</span>}
                    </div>
                  </div>
                </div>
                <div style={{ 
                  color: '#5A5A5A', 
                  marginTop: 12, 
                  minHeight: 48,
                  lineHeight: 1.6,
                  fontSize: '14px'
                }}>
                  {plant.summary}
                </div>
                <div style={{ marginTop: 16 }}>
                  <Link 
                    href={`/plants/${plant.slug}`}
                    style={{ 
                      color: sageGreenDark, 
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '15px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            ))}
            </div>
        </div>
        
        <footer style={{ 
          marginTop: 64, 
          fontSize: '15px', 
          color: '#5A5A5A', 
          padding: '32px 24px',
          background: '#fff',
          borderRadius: borderRadius,
          border: `2px solid ${warmCreamDark}`,
          textAlign: 'center'
        }}>
          <p style={{ marginBottom: 16, fontWeight: 600, color: '#E85D5D' }}>
            ⚠️ If your cat ingested a plant, contact your veterinarian immediately.
          </p>
          <Link 
            href="/about" 
            style={{ 
              color: sageGreenDark, 
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            About & Disclaimer
          </Link>
        </footer>
      </div>
    </>
  );
}
