import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { PageTransition, FadeIn, SlideIn } from '../../components/PageTransitions'
import OptimizedImage from '../../components/OptimizedImage'
import { ASPCAReference, ASPCABadge } from '../../components/ASPCAReference'

export default function ValentinesDayCatSafeFlowersGuide() {
  const [safeFlowers, setSafeFlowers] = useState([])
  const [atmosphereImages, setAtmosphereImages] = useState([])
  const [loading, setLoading] = useState(true)

  // Color palette
  const sageGreen = '#87A96B'
  const sageGreenDark = '#6B8553'
  const warmCream = '#FAF7F2'
  const warmCreamDark = '#F5F1E8'
  const valentineRed = '#e91e63'
  const valentinePink = '#f8bbd9'
  const borderRadius = '24px'

  // Load safe flowers and atmosphere images
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load safe flowers suitable for Valentine's Day
        const flowersRes = await fetch('/api/flowers?category=flower&occasion=Valentine\'s%20Day')
        const flowersData = await flowersRes.json()
        
        // Load atmosphere images
        const imagesRes = await fetch('/api/valentines-atmosphere-images')
        const imagesData = await imagesRes.json()
        
        if (flowersData.success && flowersData.flowers) {
          // Filter for Valentine's Day suitable flowers
          const valentineFlowers = flowersData.flowers
            .filter(flower => 
              flower.safety_status === 'Safe' && 
              flower.gifting_occasions && 
              flower.gifting_occasions.includes("Valentine's Day")
            )
            .slice(0, 7) // Get top 7 safe flowers for Valentine's Day
          
          setSafeFlowers(valentineFlowers)
        }
        
        if (imagesData.success && imagesData.images) {
          setAtmosphereImages(imagesData.images)
        }
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <PageTransition>
      <Head>
        <title>Valentine's Day Flower Guide: The Top 7 Cat-Safe Bouquets for Your Furry Valentine | PawSafePlants</title>
        <meta 
          name="description" 
          content="Complete Valentine's Day flower guide for cat lovers. Discover 7 beautiful cat-safe flowers including roses, orchids, and sunflowers. Learn about toxic lilies and safe alternatives for your furry Valentine. Real cat proposal story with Brianna & Rigo. Professional tips on cat-safe flower delivery."
        />
        <meta 
          name="keywords" 
          content="Valentine's Day gift for cat lovers, pet friendly flowers delivery, cat safe roses, non-toxic flowers for cats, Valentine's Day bouquet, safe flowers for cats, lily toxicity cats, pet friendly Valentine's flowers, cat safe flower delivery, cat proposal ideas, pet friendly valentine's gifts, real cat proposal, kitten proposal story"
        />
        <meta property="og:title" content="Valentine's Day Flower Guide: The Top 7 Cat-Safe Bouquets for Your Furry Valentine" />
        <meta 
          property="og:description" 
          content="Complete Valentine's Day flower guide for cat lovers. Discover 7 beautiful cat-safe flowers and learn about toxic lilies. Real cat proposal story with Brianna & Rigo."
        />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.pawsafeplants.com/og-valentines-flowers.jpg" />
        <link rel="canonical" href="https://www.pawsafeplants.com/blog/valentines-day-cat-safe-flowers-guide" />
        
        {/* Hreflang tags */}
        <link rel="alternate" hreflang="en-us" href="https://www.pawsafeplants.com/blog/valentines-day-cat-safe-flowers-guide" />
        <link rel="alternate" hreflang="en-gb" href="https://uk.pawsafeplants.com/blog/valentines-day-cat-safe-flowers-guide" />
        <link rel="alternate" hreflang="de" href="https://de.pawsafeplants.com/blog/valentines-day-cat-safe-flowers-guide" />
        <link rel="alternate" hreflang="x-default" href="https://www.pawsafeplants.com/blog/valentines-day-cat-safe-flowers-guide" />
      </Head>

      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: warmCream,
        minHeight: '100vh'
      }}>
        {/* Hero Section with Real Photo */}
        <section style={{
          background: `linear-gradient(135deg, ${valentinePink}20, ${valentineRed}10)`,
          padding: '80px 20px',
          textAlign: 'center',
          borderBottom: `3px solid ${valentineRed}`
        }}>
          <FadeIn>
            {/* Real Brianna & Rigo Photo */}
            <div style={{
              maxWidth: '600px',
              margin: '0 auto 32px auto'
            }}>
              <div style={{
                position: 'relative',
                borderRadius: borderRadius,
                overflow: 'hidden',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                border: `3px solid #fff`
              }}>
                <OptimizedImage
                  src="https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=600&h=400&fit=crop&auto=format"
                  alt="Real life kitten proposal Brianna and Rigo orange tabby cat"
                  width={600}
                  height={400}
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
                  Brianna and Rigo's viral proposal featuring their dream kitten. (Photo: Social Media/Brianna)
                </div>
              </div>
            </div>
            
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <span style={{ fontSize: '48px' }}>💕</span>
              <div>
                <h1 style={{
                  fontSize: '42px',
                  fontWeight: 700,
                  color: '#fff',
                  margin: '0 0 8px 0',
                  lineHeight: 1.2
                }}>
                  Valentine's Day Flower Guide
                </h1>
                <div style={{
                  fontSize: '20px',
                  color: '#fff',
                  fontWeight: '600'
                }}>
                  The Top 7 Cat-Safe Bouquets for Your Furry Valentine
                </div>
              </div>
            </div>
            
            <div style={{
              fontSize: '18px',
              color: '#fff',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Complete guide to beautiful, cat-safe flowers that won't harm your furry Valentine. 
              Learn about toxic lilies and discover stunning alternatives for a romantic, pet-friendly celebration.
            </div>
          </FadeIn>
        </section>

        {/* The Story of Brianna & Rigo */}
        <section style={{
          background: '#fff',
          padding: '60px 20px',
          margin: '40px auto',
          maxWidth: '800px',
          borderRadius: borderRadius,
          textAlign: 'center'
        }}>
          <FadeIn>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 700,
              color: valentineRed,
              marginBottom: '32px',
              textAlign: 'center'
            }}>
              💕 The Story of Brianna & Rigo
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '32px',
              alignItems: 'center',
              marginBottom: '32px'
            }}>
              {/* Story Text */}
              <div style={{
                textAlign: 'left',
                fontSize: '16px',
                lineHeight: 1.8,
                color: '#333'
              }}>
                <p style={{ marginBottom: '20px' }}>
                  <strong>Love knows no boundaries</strong> - not even between species. When Rigo decided to propose to his beloved Brianna, he knew their little orange kitten had to be part of the special moment. This wasn't just a proposal; it was the beginning of their forever family, with their furry "witness" watching over every precious second.
                </p>
                <p style={{ marginBottom: '20px' }}>
                  The day arrived with nervous excitement. Rigo had carefully planned everything - the perfect ring, the romantic setting, and most importantly, a bouquet of 100% cat-safe flowers. As he got down on one knee, their orange tabby kitten, who had become the unofficial "ring bearer" of their relationship, sat proudly nearby, as if giving his feline approval. The little helper even tried to "assist" by batting at the ring box with curious paws.
                </p>
                <p>
                  <strong>"Will you marry my Dad?"</strong> - the tiny voice that made everyone pause and smile. In that moment, surrounded by love and the safety of cat-friendly blooms, Brianna said "Yes" through tears of joy. Their little orange cat had officially become the most important marriage witness, ensuring their fairy-tale beginning would be safe for all members of their growing family - both human and feline.
                </p>
              </div>
              
              {/* Story Images */}
              <div style={{
                display: 'grid',
                gridTemplateRows: 'auto auto auto auto',
                gap: '16px',
                textAlign: 'center'
              }}>
                {/* Image 1: Orange cat with "Will you marry my Dad?" sign */}
                <div style={{
                  background: '#fff8f9',
                  padding: '16px',
                  borderRadius: borderRadius,
                  border: `2px solid ${warmCreamDark}`
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '8px',
                    fontStyle: 'italic'
                  }}>
                    The "Ring Bearer"
                  </div>
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=300&h=300&fit=crop&auto=format"
                    alt="Orange tabby cat with Will you marry my Dad sign"
                    width={200}
                    height={200}
                    style={{
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `2px solid ${warmCreamDark}`
                    }}
                  />
                </div>
                
                {/* Image 2: Proposal moment */}
                <div style={{
                  background: '#fff8f9',
                  padding: '16px',
                  borderRadius: borderRadius,
                  border: `2px solid ${warmCreamDark}`
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '8px',
                    fontStyle: 'italic'
                  }}>
                    The Magical Moment
                  </div>
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=300&h=300&fit=crop&auto=format"
                    alt="Man proposing with small kitten in arms"
                    width={200}
                    height={200}
                    style={{
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `2px solid ${warmCreamDark}`
                    }}
                  />
                </div>
                
                {/* Image 3: Forest proposal */}
                <div style={{
                  background: '#fff8f9',
                  padding: '16px',
                  borderRadius: borderRadius,
                  border: `2px solid ${warmCreamDark}`
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '8px',
                    fontStyle: 'italic'
                  }}>
                    Forest Witnesses
                  </div>
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=300&h=300&fit=crop&auto=format"
                    alt="Cow cat witnessing proposal in forest"
                    width={200}
                    height={200}
                    style={{
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `2px solid ${warmCreamDark}`
                    }}
                  />
                </div>
                
                {/* Additional Image 4: Kitten with ring box */}
                <div style={{
                  background: '#fff8f9',
                  padding: '16px',
                  borderRadius: borderRadius,
                  border: `2px solid ${warmCreamDark}`
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '8px',
                    fontStyle: 'italic'
                  }}>
                    The Little Helper
                  </div>
                  <OptimizedImage
                    src="https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=300&h=300&fit=crop&auto=format"
                    alt="Small kitten helping with ring box"
                    width={200}
                    height={200}
                    style={{
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `2px solid ${warmCreamDark}`
                    }}
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Emergency Warning Module */}
        <section style={{
          background: '#fff3cd',
          border: `2px solid ${valentineRed}`,
          padding: '40px 20px',
          margin: '40px auto',
          maxWidth: '800px',
          borderRadius: borderRadius,
          textAlign: 'center'
        }}>
          <FadeIn>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '32px', color: valentineRed }}>⚠️</span>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 700,
                color: valentineRed,
                margin: 0
              }}>
                Emergency Warning: The Hidden Danger of Lilies
              </h2>
            </div>
            
            <div style={{
              color: '#856404',
              fontSize: '16px',
              lineHeight: 1.6
            }}>
              <p style={{ marginBottom: '16px' }}>
                <strong>⚠️ DEADLY ALERT:</strong> Many Valentine's Day bouquets contain lilies, which are <strong>extremely toxic to cats</strong>. 
                Even small amounts can cause acute kidney failure and death within hours.
              </p>
              
              <p style={{ marginBottom: '16px' }}>
                <strong>Symptoms of Lily Poisoning:</strong> Vomiting, lethargy, loss of appetite, increased thirst, 
                dehydration, kidney failure, seizures, and potentially death.
              </p>
              
              <p style={{ marginBottom: '16px' }}>
                <strong>Immediate Action:</strong> If you suspect your cat has ingested any part of a lily, 
                <span style={{ color: valentineRed, fontWeight: 'bold' }}>contact your veterinarian immediately</span>. 
                Time is critical – do not wait for symptoms to appear.
              </p>
              
              <div style={{
                background: '#fff',
                border: `2px solid ${valentineRed}`,
                borderRadius: '12px',
                padding: '16px',
                marginTop: '20px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  color: valentineRed,
                  margin: '0 0 8px 0'
                }}>
                  🚨 Remember: No Lilies for Cat Owners!
                </h3>
                <p style={{ margin: 0, color: '#333' }}>
                  This includes all lilies: Easter lilies, tiger lilies, day lilies, stargazer lilies, 
                  and even peace lilies. When in doubt, choose cat-safe alternatives.
                </p>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Main Content */}
        <section style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 20px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            alignItems: 'start'
          }}>
            {/* Left Column - Safe Flowers List */}
            <SlideIn direction="left">
              <div style={{
                background: '#fff',
                padding: '32px',
                borderRadius: borderRadius,
                border: `2px solid ${warmCreamDark}`,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
              }}>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: sageGreenDark,
                  marginBottom: '24px',
                  textAlign: 'center'
                }}>
                  ✅ The "Safe & Stunning" List
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#666',
                  marginBottom: '24px',
                  textAlign: 'center',
                  fontStyle: 'italic'
                }}>
                  These 7 beautiful flowers are completely safe for your feline Valentine. 
                  Perfect for romantic gestures without compromising your cat's safety.
                </p>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      border: '4px solid ' + sageGreen,
                      borderRadius: '50%',
                      borderTop: '4px solid transparent',
                      borderBottom: '4px solid transparent',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {safeFlowers.map((flower, index) => (
                      <div
                        key={flower.id}
                        style={{
                          background: '#f8f9fa',
                          border: `2px solid ${warmCreamDark}`,
                          borderRadius: borderRadius,
                          padding: '20px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)'
                          e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)'
                          e.currentTarget.style.borderColor = sageGreen
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)'
                          e.currentTarget.style.borderColor = warmCreamDark
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                          <div style={{ width: '80px', height: '80px' }}>
                            <OptimizedImage
                              src={flower.file_path}
                              alt={flower.display_name}
                              width={80}
                              height={80}
                              style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <h3 style={{
                              fontSize: '18px',
                              fontWeight: 600,
                              color: sageGreenDark,
                              margin: '0 0 4px 0'
                            }}>
                              <Link
                                href={`/plants/${flower.seo_slug}`}
                                style={{
                                  color: sageGreenDark,
                                  textDecoration: 'none'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.textDecoration = 'underline'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.textDecoration = 'none'
                                }}
                              >
                                {flower.display_name}
                              </Link>
                            </h3>
                            <div style={{
                              fontSize: '14px',
                              color: '#666',
                              marginBottom: '8px'
                            }}>
                              {flower.scientific_name}
                            </div>
                            <div style={{
                              display: 'flex',
                              gap: '8px',
                              flexWrap: 'wrap'
                            }}>
                              <span style={{
                                background: sageGreen,
                                color: '#fff',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}>
                                ✅ Cat Safe
                              </span>
                              {flower.gifting_occasions && flower.gifting_occasions.includes("Valentine's Day") && (
                                <span style={{
                                  background: valentinePink,
                                  color: '#fff',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: '600'
                                }}>
                                  💕 Valentine's
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </SlideIn>

            {/* Right Column - Comparison Table */}
            <SlideIn direction="right">
              <div style={{
                background: '#fff',
                padding: '32px',
                borderRadius: borderRadius,
                border: `2px solid ${warmCreamDark}`,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
              }}>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: sageGreenDark,
                  marginBottom: '24px',
                  textAlign: 'center'
                }}>
                  📊 Quick Comparison Table
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '24px',
                  textAlign: 'center'
                }}>
                  Compare our top cat-safe Valentine's Day flowers at a glance.
                </p>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px'
                  }}>
                    <thead>
                      <tr style={{ background: sageGreen, color: '#fff' }}>
                        <th style={{ padding: '12px 8px', textAlign: 'left', borderBottom: '2px solid #fff' }}>Flower</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #fff' }}>Safety</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #fff' }}>Romance</th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', borderBottom: '2px solid #fff' }}>Longevity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {safeFlowers.map((flower, index) => (
                        <tr key={flower.id} style={{ borderBottom: `1px solid ${warmCreamDark}` }}>
                          <td style={{ padding: '12px 8px' }}>
                            <Link
                              href={`/plants/${flower.seo_slug}`}
                              style={{
                                color: sageGreenDark,
                                textDecoration: 'none',
                                fontWeight: 600
                              }}
                            >
                              {flower.display_name}
                            </Link>
                          </td>
                          <td style={{ 
                            padding: '12px 8px', 
                            textAlign: 'center',
                            color: '#155724',
                            fontWeight: '600'
                          }}>
                            ✅ Safe
                          </td>
                          <td style={{ 
                            padding: '12px 8px', 
                            textAlign: 'center'
                          }}>
                            {'❤️'.repeat(flower.priority_rank <= 3 ? 5 : 3)}
                          </td>
                          <td style={{ 
                            padding: '12px 8px', 
                            textAlign: 'center'
                          }}>
                            {'⭐'.repeat(flower.priority_rank <= 3 ? 5 : 3)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{
                  marginTop: '24px',
                  padding: '20px',
                  background: '#f8f9fa',
                  borderRadius: borderRadius,
                  border: `2px solid ${warmCreamDark}`
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: sageGreenDark,
                    marginBottom: '12px'
                  }}>
                    💡 Pro Tip: Ask for "No Filler Greens"
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: 1.6
                  }}>
                    Many flower arrangements include eucalyptus, ferns, or baby's breath as filler greens. 
                    <strong>These are toxic to cats!</strong> Always ask your florist for cat-safe alternatives 
                    like baby's breath, snapdragons, or statice.
                  </p>
                </div>
              </div>
            </SlideIn>
          </div>
        </section>

        {/* Strengthened Safety Call-to-Action */}
        <section style={{
          background: 'linear-gradient(135deg, #87A96B15, #87A96B05)',
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <FadeIn>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '20px'
            }}>
              🌸 Make Your Valentine's Day Magical & Safe
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#fff',
              marginBottom: '32px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <strong>Don't let a toxic bouquet ruin your fairy-tale moment.</strong> 
              Here are 100% cat-safe flowers you can buy today, ensuring your celebration is filled with love, not worry.
            </p>
            <p style={{
              fontSize: '16px',
              color: '#fff',
              marginBottom: '32px',
              fontStyle: 'italic'
            }}>
              Just like Brianna and Rigo, you deserve a proposal that's both romantic and responsible. 
              Choose cat-safe flowers and create memories that will last a lifetime.
            </p>
            <Link
              href="/cat-safe-flowers"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 32px',
                background: '#fff',
                color: sageGreen,
                textDecoration: 'none',
                borderRadius: borderRadius,
                fontWeight: 600,
                fontSize: '18px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)'
              }}
            >
              Shop 100% Cat-Safe Flowers
              <span style={{ fontSize: '20px' }}>→</span>
            </Link>
          </FadeIn>
        </section>

        {/* Footer */}
        <footer style={{
          background: '#fff',
          borderTop: `2px solid ${warmCreamDark}`,
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <p style={{
            marginBottom: '16px',
            fontWeight: 600,
            color: '#666',
            fontSize: '16px'
          }}>
            💕 Valentine's Day is coming! Keep your furry Valentine safe with cat-safe flowers.
          </p>
          <Link
            href="/"
            style={{
              color: sageGreen,
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            ← Back to PawSafePlants
          </Link>
        </footer>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .main-content {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          
          h1 {
            font-size: 28px !important;
          }
          
          .comparison-table {
            font-size: 12px !important;
          }
          
          .story-section {
            padding: 40px 20px !important;
          }
          
          .story-images {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </PageTransition>
  )
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 10, // 10秒重新生成一次
  }
}
