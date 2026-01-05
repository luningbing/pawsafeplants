import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Image placeholder component with Unsplash fallback
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const unsplashPlaceholder = 'https://images.unsplash.com/photo-1545241047-6083a3684587';

  // Color palette
  const sageGreen = '#87A96B';
  const sageGreenDark = '#6B8553';
  const warmCream = '#FAF7F2';
  const warmCreamDark = '#F5F1E8';
  const terracotta = '#C17A5F';
  const borderRadius = '24px';
  const borderRadiusLarge = '32px';

  // Get popular/featured plants (4-6 plants)
  const featuredPlants = useMemo(() => {
    const sorted = plants.slice().sort((a, b) => {
      const aTitle = String(a.title || '').toLowerCase();
      const bTitle = String(b.title || '').toLowerCase();
      return aTitle.localeCompare(bTitle);
    });
    return sorted.slice(0, 6);
  }, [plants]);

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = plants
      .filter(plant => {
        const title = String(plant.title || '').toLowerCase();
        const scientific = String(plant.scientific_name || '').toLowerCase();
        const summary = String(plant.summary || '').toLowerCase();
        return title.includes(query) || scientific.includes(query) || summary.includes(query);
      })
      .slice(0, 5);
    
    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  }, [searchQuery, plants]);

  useEffect(() => {
    try {
      const body = { page_path: window.location.pathname, referrer: document.referrer }
      fetch('/api/analytics/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => {})
    } catch {}
  }, []);

  const getToxicityLevel = (level) => {
    const L = String(level || '').toLowerCase();
    if (L.includes('safe')) return { label: 'Safe', color: sageGreen, bg: `${sageGreen}20`, icon: '✅' };
    if (L.includes('danger') || L.includes('toxic') || L.includes('extreme')) return { label: 'Dangerous', color: '#E85D5D', bg: '#E85D5D20', icon: '❌' };
    return { label: 'Caution', color: '#F5C842', bg: '#F5C84220', icon: '⚠️' };
  };

  // Community Stories placeholder data (3 columns) with Unsplash images
  const communityStories = [
    { id: 1, name: 'Sarah & Max', plant: 'Spider Plant', location: 'Seattle, WA', image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=400&h=400&fit=crop' },
    { id: 2, name: 'Emma & Luna', plant: 'Cat Grass', location: 'Portland, OR', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=400&fit=crop' },
    { id: 3, name: 'James & Whiskers', plant: 'Boston Fern', location: 'San Francisco, CA', image: 'https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?w=400&h=400&fit=crop' },
    { id: 4, name: 'Maya & Simba', plant: 'Areca Palm', location: 'Austin, TX', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop' },
    { id: 5, name: 'Olivia & Pepper', plant: 'Prayer Plant', location: 'Denver, CO', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop' },
    { id: 6, name: 'Chris & Tigger', plant: 'African Violet', location: 'Miami, FL', image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=400&h=400&fit=crop' }
  ];

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
        <link rel="canonical" href="https://pawsafeplants.com" />
      </Head>

      <div style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
        background: warmCream,
        minHeight: '100vh'
      }}>
        {/* Hero Section - Left Text, Right Image */}
        <section style={{
          maxWidth: '1200px',
          margin: '40px auto',
          padding: '0 20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Left: Text Content */}
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <h1 style={{
              fontSize: '56px',
              fontWeight: 700,
              color: sageGreenDark,
              lineHeight: 1.2,
              letterSpacing: '-1px',
              margin: 0
            }}>
              Grow Together, Safely.
            </h1>
            <p style={{
              fontSize: '20px',
              color: '#5A5A5A',
              lineHeight: 1.6,
              margin: 0
            }}>
              Your Guide to Cat-Friendly Botanicals & Community
            </p>
            <div style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <Link 
                href="/plants/safe"
                style={{
                  display: 'inline-block',
                  padding: '16px 32px',
                  background: sageGreen,
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: borderRadius,
                  fontWeight: 600,
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(135, 169, 107, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = sageGreenDark;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(135, 169, 107, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = sageGreen;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(135, 169, 107, 0.3)';
                }}
              >
                Explore Safe Plants
              </Link>
              <Link 
                href="/community"
                style={{
                  display: 'inline-block',
                  padding: '16px 32px',
                  background: warmCream,
                  color: sageGreenDark,
                  textDecoration: 'none',
                  borderRadius: borderRadius,
                  fontWeight: 600,
                  fontSize: '16px',
                  border: `2px solid ${sageGreen}`,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = sageGreen + '10';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = warmCream;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Share Your Story
              </Link>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div style={{
            borderRadius: borderRadiusLarge,
            overflow: 'hidden',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
            height: '500px'
          }}>
            <SafeImage
              src={site?.heroImage || unsplashPlaceholder}
              alt="Cat-safe plants for your home"
              unsplashFallback={unsplashPlaceholder}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                display: 'block'
              }}
              containerStyle={{
                width: '100%',
                height: '100%'
              }}
            />
        </div>
        </section>

        {/* Global Search Section */}
        <section style={{
          maxWidth: '1200px',
          margin: '0 auto 48px auto',
          padding: '0 20px',
          position: 'relative'
        }}>
          <div style={{
            position: 'relative',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            <input
              type="text"
              placeholder="Search by plant name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '18px 24px',
                fontSize: '16px',
                borderRadius: borderRadius,
                border: `2px solid ${warmCreamDark}`,
                background: '#fff',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = sageGreen;
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(135, 169, 107, 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = warmCreamDark;
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
              }}
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#fff',
                borderRadius: borderRadius,
                marginTop: '8px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                border: `2px solid ${warmCreamDark}`,
                zIndex: 100,
                maxHeight: '400px',
                overflow: 'auto'
              }}>
                {searchResults.map(plant => {
                  const toxicity = getToxicityLevel(plant.toxicity_level);
                  return (
                    <Link
                      key={plant.slug}
                      href={`/plants/${plant.slug}`}
                      style={{
                        display: 'block',
                        padding: '16px 20px',
                        textDecoration: 'none',
                        color: '#2D2D2D',
                        borderBottom: `1px solid ${warmCreamDark}`,
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = warmCream;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>
                            {plant.title}
        </div>
                          <div style={{ fontSize: '14px', color: '#5A5A5A' }}>
                            {plant.summary?.substring(0, 60)}...
          </div>
        </div>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: toxicity.bg,
                          color: toxicity.color
                        }}>
                          {toxicity.icon} {toxicity.label}
                        </span>
                      </div>
                    </Link>
                  );
                })}
                </div>
            )}
              </div>
        </section>

        {/* Featured Plants Grid */}
        <section style={{
          maxWidth: '1200px',
          margin: '0 auto 64px auto',
          padding: '0 20px'
        }}>
          <h2 style={{
            fontSize: '40px',
            fontWeight: 700,
            color: sageGreenDark,
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            Popular Plants
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {featuredPlants.map(plant => {
              const toxicity = getToxicityLevel(plant.toxicity_level);
              return (
                <div
                  key={plant.slug}
                  style={{
                    background: '#fff',
                    borderRadius: borderRadius,
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    border: `2px solid ${warmCreamDark}`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
                    e.currentTarget.style.borderColor = sageGreen + '40';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = warmCreamDark;
                  }}
                >
                  {/* Plant Image */}
                  <div style={{ height: '240px', overflow: 'hidden', background: warmCreamDark }}>
                    <SafeImage
                      src={plant.image || plant.thumbPlant || unsplashPlaceholder}
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
                  
                  {/* Plant Info */}
                  <div style={{ padding: '24px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px'
                    }}>
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: sageGreenDark,
                        margin: 0
                      }}>
                        {plant.title}
                      </h3>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        background: toxicity.bg,
                        color: toxicity.color,
                        whiteSpace: 'nowrap'
                      }}>
                        {toxicity.icon} {toxicity.label}
                      </span>
        </div>
                    <p style={{
                      fontSize: '15px',
                      color: '#5A5A5A',
                      lineHeight: 1.6,
                      marginBottom: '20px',
                      minHeight: '48px'
                    }}>
                      {plant.summary || 'Learn more about this plant and its safety for cats.'}
                    </p>
                    <Link
                      href={`/plants/${plant.slug}`}
                      style={{
                        display: 'inline-block',
                        padding: '12px 24px',
                        background: sageGreen,
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: borderRadius,
                        fontWeight: 600,
                        fontSize: '15px',
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                        width: '100%'
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
                      View Details
                    </Link>
          </div>
        </div>
              );
            })}
          </div>
        </section>

        {/* Community Stories - 3 Column Grid */}
        <section style={{
          maxWidth: '1200px',
          margin: '0 auto 64px auto',
          padding: '0 20px'
        }}>
          <h2 style={{
            fontSize: '40px',
            fontWeight: 700,
            color: sageGreenDark,
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Community Stories
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#5A5A5A',
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            See how fellow cat owners are creating beautiful, pet-safe indoor gardens
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px'
          }}>
            {communityStories.map(story => (
              <div
                key={story.id}
                style={{
                  background: '#fff',
                  borderRadius: borderRadius,
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  border: `2px solid ${warmCreamDark}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
                }}
              >
                <div style={{
                  height: '280px',
                  overflow: 'hidden',
                  background: warmCreamDark
                }}>
                  <SafeImage
                    src={story.image || unsplashPlaceholder}
                    alt={`${story.name} with ${story.plant}`}
                    unsplashFallback={unsplashPlaceholder}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    containerStyle={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '64px'
                    }}
                    fallback={<span>📸</span>}
                  />
      </div>
                <div style={{ padding: '20px' }}>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '18px',
                    color: sageGreenDark,
                    marginBottom: '8px'
                  }}>
                    {story.name}
                </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#5A5A5A',
                    marginBottom: '4px'
                  }}>
                    {story.plant}
                </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#888'
                  }}>
                    {story.location}
                  </div>
                </div>
            </div>
          ))}
        </div>
        </section>

        {/* Footer */}
        <footer style={{
          background: '#fff',
          borderTop: `2px solid ${warmCreamDark}`,
          padding: '40px 20px',
          marginTop: '64px',
          textAlign: 'center'
        }}>
          <p style={{
            marginBottom: '16px',
            fontWeight: 600,
            color: '#E85D5D',
            fontSize: '16px'
          }}>
            ⚠️ If your cat ingested a plant, contact your veterinarian immediately.
          </p>
          <Link
            href="/about"
            style={{
              color: sageGreenDark,
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '15px'
            }}
          >
            About & Disclaimer
          </Link>
      </footer>
    </div>

      <style jsx>{`
        @media (max-width: 968px) {
          section:first-of-type {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          section:first-of-type > div:last-child {
            height: 400px !important;
          }
          section:nth-of-type(4) > div:last-of-type {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          h1 {
            font-size: 40px !important;
          }
          section:nth-of-type(4) > div:last-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
