import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import UltimateHeroCarousel from '../components/UltimateHeroCarousel';
import OptimizedImage from '../components/OptimizedImage';
import { AtmosphereParallax } from '../components/ParallaxEffects';
import { PageTransition, FadeIn, SlideIn, ScaleIn, ListItemAnimation } from '../components/PageTransitions';

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

export default function Home({ plants, site }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [heroSlides, setHeroSlides] = useState([]);
  const [atmosphereImages, setAtmosphereImages] = useState([]);
  const [catSafeFlowers, setCatSafeFlowers] = useState([]);
  const unsplashPlaceholder = 'https://images.unsplash.com/photo-1545241047-6083a3684587';

  // Color palette
  const sageGreen = '#87A96B';
  const sageGreenDark = '#6B8553';
  const warmCream = '#FAF7F2';
  const warmCreamDark = '#F5F1E8';
  const valentineRed = '#e91e63';
  const valentinePink = '#f8bbd9';
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

  // Load ultimate hero carousel data
  useEffect(() => {
    const loadHeroSlides = async () => {
      try {
        console.log('Loading ultimate hero slides from file...');
        const res = await fetch('/api/ultimate-hero');
        const data = await res.json();
        console.log('Ultimate hero slides response:', data);
        if (data.slides && data.slides.length > 0) {
          console.log('Setting ultimate hero slides:', data.slides);
          setHeroSlides(data.slides);
        } else {
          console.log('No ultimate hero slides found');
        }
      } catch (error) {
        console.error('Failed to load ultimate hero slides:', error);
      }
    };
    loadHeroSlides();
  }, []);

  // Load atmosphere images
  useEffect(() => {
    const loadAtmosphereImages = async () => {
      try {
        console.log('Loading atmosphere images...');
        const res = await fetch('/api/atmosphere-images');
        const data = await res.json();
        console.log('Atmosphere images response:', data);
        if (data.atmosphere_images && data.atmosphere_images.length > 0) {
          console.log('Setting atmosphere images:', data.atmosphere_images);
          setAtmosphereImages(data.atmosphere_images);
        } else {
          console.log('No atmosphere images found, using defaults');
          // 设置默认氛围图
          setAtmosphereImages([
            {
              url: 'https://images.unsplash.com/photo-1514888074191-9c2e2c8bf77?w=400&h=400&fit=crop',
              title: '慵懒的猫咪',
              createdAt: new Date().toISOString()
            },
            {
              url: 'https://images.unsplash.com/photo-1574158610182-6e2bae4e9d3?w=400&h=400&fit=crop',
              title: '窗边的小猫',
              createdAt: new Date().toISOString()
            },
            {
              url: 'https://images.unsplash.com/photo-1596854406854-1c2f7b2b2a9?w=400&h=400&fit=crop',
              title: '花丛中的猫咪',
              createdAt: new Date().toISOString()
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to load atmosphere images:', error);
        // 设置默认氛围图作为后备
        setAtmosphereImages([
          {
            url: 'https://images.unsplash.com/photo-1514888074191-9c2e2c8bf77?w=400&h=400&fit=crop',
            title: '慵懒的猫咪',
            createdAt: new Date().toISOString()
          },
          {
            url: 'https://images.unsplash.com/photo-1574158610182-6e2bae4e9d3?w=400&h=400&fit=crop',
            title: '窗边的小猫',
            createdAt: new Date().toISOString()
          },
          {
            url: 'https://images.unsplash.com/photo-1596854406854-1c2f7b2b2a9?w=400&h=400&fit=crop',
            title: '花丛中的猫咪',
            createdAt: new Date().toISOString()
          }
        ]);
      }
    };
    loadAtmosphereImages();
  }, []);

  // Load cat-safe flowers data
  useEffect(() => {
    const loadCatSafeFlowers = async () => {
      try {
        console.log('Loading cat-safe flowers...');
        const res = await fetch('/api/cat-safe-flowers');
        const data = await res.json();
        console.log('Cat-safe flowers response:', data);
        if (data.success && data.flowers) {
          console.log('Setting cat-safe flowers:', data.flowers);
          setCatSafeFlowers(data.flowers);
        } else {
          console.log('No cat-safe flowers found, using defaults');
          // 设置默认花朵数据
          setCatSafeFlowers([
            {
              id: 1,
              name: 'Rose',
              image: 'https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=400&h=400&fit=crop',
              category: 'flower',
              is_flower: true,
              toxicity_level: 'Safe – generally non-toxic to cats',
              summary: 'Classic roses are safe for cats. Perfect for romantic cat-safe bouquets.',
              scenarios: ['bouquets', 'gift', 'weddings', 'valentines']
            },
            {
              id: 2,
              name: 'Sunflower',
              image: 'https://images.unsplash.com/photo-1506805945078-4b0c4d8d71b6?w=400&h=400&fit=crop',
              category: 'flower',
              is_flower: true,
              toxicity_level: 'Safe – generally non-toxic to cats',
              summary: 'Bright sunflowers are completely safe for cats. Great for sunny arrangements.',
              scenarios: ['bouquets', 'gift', 'summer', 'birthdays']
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to load cat-safe flowers:', error);
        // 设置默认花朵数据作为后备
        setCatSafeFlowers([
          {
            id: 1,
            name: 'Rose',
            image: 'https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=400&h=400&fit=crop',
            category: 'flower',
            is_flower: true,
            toxicity_level: 'Safe – generally non-toxic to cats',
            summary: 'Classic roses are safe for cats. Perfect for romantic cat-safe bouquets.',
            scenarios: ['bouquets', 'gift', 'weddings', 'valentines']
          }
        ]);
      }
    };
    loadCatSafeFlowers();
  }, []);

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
    <PageTransition>
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
        <link rel="canonical" href="https://www.pawsafeplants.com" />
      </Head>

      <div style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
        background: warmCream,
        minHeight: '100vh'
      }}>
        {/* Hero Carousel - Full Screen */}
        <section style={{
          width: '100%',
          height: '100vh',
          margin: 0,
          padding: 0,
          position: 'relative'
        }}>
          <UltimateHeroCarousel slides={heroSlides} />
        </section>

        {/* Global Search Section */}
        <section style={{
          maxWidth: '1200px',
          margin: '0 auto 48px auto',
          padding: '0 20px',
          position: 'relative'
        }}>
          <FadeIn delay={0.2}>
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
          </FadeIn>
        </section>

        {/* Featured Plants Grid */}
        <section style={{
          maxWidth: '1200px',
          margin: '0 auto 64px auto',
          padding: '0 20px'
        }}>
          <FadeIn delay={0.3}>
            <h2 style={{
              fontSize: '40px',
              fontWeight: 700,
              color: sageGreenDark,
              marginBottom: '32px',
              textAlign: 'center'
            }}>
              Popular Plants
            </h2>
          </FadeIn>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {featuredPlants.map((plant, index) => {
              const toxicity = getToxicityLevel(plant.toxicity_level);
              return (
                <ListItemAnimation key={plant.slug} index={index}>
                  <div
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
                </ListItemAnimation>
              );
            })}
          </div>
        </section>

        {/* Atmosphere Images Section */}
        <section style={{
          maxWidth: '1200px',
          margin: '0 auto 48px auto',
          padding: '0 20px'
        }}>
          <FadeIn delay={0.4}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 700,
              color: sageGreenDark,
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              🌸 猫猫氛围
            </h2>
          </FadeIn>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {atmosphereImages.map((image, index) => (
              <FadeIn key={index} delay={0.5 + (index * 0.1)}>
                <AtmosphereParallax 
                  image={image}
                  title={image.title}
                  index={index}
                />
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Cat-Safe Flowers - Featured Section */}
        <section style={{
          maxWidth: '1200px',
          margin: '0 auto 64px auto',
          padding: '0 20px'
        }}>
          <FadeIn delay={0.55}>
            <div style={{
              background: 'linear-gradient(135deg, #87A96B15, #87A96B05)',
              borderRadius: borderRadiusLarge,
              padding: '48px',
              border: `2px solid ${sageGreen}20`,
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              <h2 style={{
                fontSize: '42px',
                fontWeight: 700,
                color: sageGreenDark,
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}>
                🌸 Cat-Safe Flowers
              </h2>
              <p style={{
                fontSize: '18px',
                color: '#5A5A5A',
                maxWidth: '600px',
                margin: '0 auto 24px auto',
                lineHeight: 1.6
              }}>
                Discover beautiful flowers that are completely safe for your cats. Perfect for bouquets, gifts, and arrangements that won't harm your feline friends.
              </p>
              <Link
                href="/cat-safe-flowers"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
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
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(135, 169, 107, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = sageGreen;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(135, 169, 107, 0.3)';
                }}
              >
                Explore All Flowers
                <span style={{ fontSize: '18px' }}>→</span>
              </Link>
            </div>
          </FadeIn>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {catSafeFlowers.slice(0, 6).map((flower, index) => (
              <ListItemAnimation key={flower.id} index={index}>
                <div
                  style={{
                    background: '#fff',
                    borderRadius: borderRadius,
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    border: `2px solid ${warmCreamDark}`,
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(135, 169, 107, 0.15)';
                    e.currentTarget.style.borderColor = sageGreen + '40';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = warmCreamDark;
                  }}
                >
                  {/* Flower Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: sageGreen,
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    🌸 Cat Safe
                  </div>
                  
                  {/* Flower Image */}
                  <div style={{ height: '220px', overflow: 'hidden', background: warmCreamDark }}>
                    <SafeImage
                      src={flower.image}
                      alt={`${flower.name} - Cat Safe Flower`}
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
                  
                  {/* Flower Info */}
                  <div style={{ padding: '24px' }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      color: sageGreenDark,
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {flower.name}
                      <span style={{
                        fontSize: '14px',
                        color: '#87A96B',
                        background: '#87A96B15',
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>
                        Safe
                      </span>
                    </h3>
                    
                    <p style={{
                      fontSize: '14px',
                      color: '#5A5A5A',
                      lineHeight: 1.5,
                      marginBottom: '16px',
                      minHeight: '48px'
                    }}>
                      {flower.summary}
                    </p>
                    
                    {/* Scenarios Tags */}
                    {flower.scenarios && flower.scenarios.length > 0 && (
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginBottom: '16px'
                      }}>
                        {flower.scenarios.slice(0, 3).map((scenario, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '11px',
                              color: '#666',
                              background: '#f5f5f5',
                              padding: '4px 8px',
                              borderRadius: '8px',
                              textTransform: 'capitalize'
                            }}
                          >
                            {scenario}
                          </span>
                        ))}
                        {flower.scenarios.length > 3 && (
                          <span style={{
                            fontSize: '11px',
                            color: '#999',
                            padding: '4px 8px'
                          }}>
                            +{flower.scenarios.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    <Link
                      href={`/plants/${flower.name.toLowerCase().replace(/\s+/g, '-')}`}
                      style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        background: 'transparent',
                        color: sageGreen,
                        textDecoration: 'none',
                        borderRadius: borderRadius,
                        fontWeight: 600,
                        fontSize: '14px',
                        transition: 'all 0.3s ease',
                        border: `2px solid ${sageGreen}`,
                        textAlign: 'center',
                        width: '100%'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = sageGreen;
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = sageGreen;
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </ListItemAnimation>
            ))}
          </div>
        </section>

        {/* Community Stories - 3 Column Grid */}
        <section style={{
          maxWidth: '1200px',
          margin: '0 auto 64px auto',
          padding: '0 20px'
        }}>
          <FadeIn delay={0.6}>
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
          </FadeIn>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px'
          }}>
            {communityStories.map((story, index) => (
              <ListItemAnimation key={story.id} index={index}>
                <div
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
              </ListItemAnimation>
            ))}
          </div>
        </section>

        {/* Latest Stories - Valentine's Blog */}
        <section style={{
          maxWidth: '1200px',
          margin: '0 auto 48px auto',
          padding: '0 20px'
        }}>
          <FadeIn>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 700,
              color: valentineRed,
              marginBottom: '32px',
              textAlign: 'center'
            }}>
              💕 Latest Stories
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '32px',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <div style={{
                background: '#fff',
                borderRadius: borderRadius,
                padding: '32px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                border: `2px solid ${warmCreamDark}`,
                textAlign: 'center'
              }}>
                <div style={{
                  width: '100%',
                  height: '200px',
                  marginBottom: '24px',
                  borderRadius: borderRadius,
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=600&h=400&fit=crop&auto=format"
                    alt="Brianna and Rigo's viral proposal featuring their dream kitten"
                    width={600}
                    height={400}
                    priority={true}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: '#fff',
                    padding: '12px',
                    fontSize: '14px',
                    textAlign: 'center',
                    fontStyle: 'italic'
                  }}>
                    Brianna and Rigo's viral proposal featuring their dream kitten
                  </div>
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: sageGreenDark,
                  marginBottom: '16px'
                }}>
                  💕 The Story of Brianna & Rigo
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#666',
                  lineHeight: 1.6,
                  marginBottom: '24px'
                }}>
                  A heartwarming tale of love, proposals, and a little orange kitten who became the most important marriage witness. 
                  Discover how Brianna and Rigo's viral proposal story is changing the way we think about romance and pet safety.
                </p>
                <Link
                  href="/blog/valentines-day-cat-safe-flowers-guide"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: valentineRed,
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: borderRadius,
                    fontWeight: 600,
                    fontSize: '16px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(233, 30, 99, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(233, 30, 99, 0.2)'
                  }}
                >
                  Read Full Story
                  <span style={{ fontSize: '18px' }}>→</span>
                </Link>
              </div>
            </div>
          </FadeIn>
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
    </PageTransition>
  );
}

export async function getStaticProps() {
  try {
    // 读取植物数据
    const plantsDirectory = path.join(process.cwd(), 'content', 'plants');
    const filenames = fs.readdirSync(plantsDirectory);
    
    const plants = filenames
      .filter(filename => filename.endsWith('.md'))
      .map(filename => {
        const filePath = path.join(plantsDirectory, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const matterResult = matter(fileContents);
        
        return {
          slug: filename.replace('.md', ''),
          title: matterResult.data.title || '',
          scientific_name: matterResult.data.scientific_name || '',
          summary: matterResult.data.summary || '',
          toxicity_level: matterResult.data.toxicity_level || '',
          image: matterResult.data.image || ''
        };
      });

    return {
      props: {
        plants,
      },
      revalidate: 10, // 10秒重新生成一次
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        plants: [],
      },
      revalidate: 10,
    };
  }
}
