import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PageTransition, FadeIn, SlideIn } from '../../components/PageTransitions'
import OptimizedImage from '../../components/OptimizedImage'
import { ASPCAReference, ASPCABadge, ASPCASafetySeal, useASPCAVerification } from '../../components/ASPCAReference'

export default function FlowerDetail({ flower }) {
  const router = useRouter()
  const [relatedFlowers, setRelatedFlowers] = useState([])
  const [loading, setLoading] = useState(true)
  
  const { isVerified, verificationSource } = useASPCAVerification(flower)
  
  // Color palette
  const sageGreen = '#87A96B'
  const sageGreenDark = '#6B8553'
  const warmCream = '#FAF7F2'
  const warmCreamDark = '#F5F1E8'
  const borderRadius = '24px'

  // Safety status styling
  const getSafetyStyling = (status) => {
    switch (status) {
      case 'Safe':
        return {
          bg: '#d4edda',
          color: '#155724',
          border: '#c3e6cb',
          icon: '✅',
          label: '100% Cat Friendly',
          alertClass: 'alert-success'
        }
      case 'Mild':
        return {
          bg: '#fff3cd',
          color: '#856404',
          border: '#ffeaa7',
          icon: '⚠️',
          label: 'Mild Caution',
          alertClass: 'alert-warning'
        }
      case 'Toxic':
        return {
          bg: '#f8d7da',
          color: '#721c24',
          border: '#f5c6cb',
          icon: '⚠️',
          label: 'Toxic to Cats',
          alertClass: 'alert-danger'
        }
      case 'Deadly':
        return {
          bg: '#721c24',
          color: '#ffffff',
          border: '#dc3545',
          icon: '☠️',
          label: 'DEADLY - Extremely Toxic',
          alertClass: 'alert-deadly'
        }
      default:
        return {
          bg: '#e2e3e5',
          color: '#383d41',
          border: '#d6d8db',
          icon: '❓',
          label: 'Unknown',
          alertClass: 'alert-secondary'
        }
    }
  }

  const safetyStyling = getSafetyStyling(flower.safety_status)

  // Load related flowers
  useEffect(() => {
    const loadRelatedFlowers = async () => {
      try {
        const res = await fetch('/api/cat-safe-flowers')
        const data = await res.json()
        if (data.success && data.flowers) {
          // Filter by safety status and gifting occasions
          const related = data.flowers
            .filter(f => f.id !== flower.id)
            .filter(f => {
              // Show similar safety status flowers
              if (flower.safety_status === 'Safe') {
                return f.safety_status === 'Safe'
              } else if (flower.safety_status === 'Mild') {
                return f.safety_status === 'Safe' || f.safety_status === 'Mild'
              } else {
                return f.safety_status === 'Toxic' || f.safety_status === 'Deadly'
              }
            })
            .slice(0, 6)
          setRelatedFlowers(related)
        }
      } catch (error) {
        console.error('Failed to load related flowers:', error)
      } finally {
        setLoading(false)
      }
    }
    loadRelatedFlowers()
  }, [flower.id, flower.safety_status])

  if (!flower) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: warmCream,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🌸</div>
          <h2 style={{ color: '#666', marginBottom: '16px' }}>Flower Not Found</h2>
          <Link 
            href="/cat-safe-flowers"
            style={{
              color: sageGreen,
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            ← Back to Cat-Safe Flowers
          </Link>
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <Head>
        <title>{flower.display_name} - Is it a Cat Safe Flower? | PawSafePlants</title>
        <meta 
          name="description" 
          content={`${flower.display_name} ${flower.safety_status === 'Safe' ? 'is completely safe for cats' : 'may be harmful to cats'}. ${flower.toxicity_level}. ${flower.search_intent?.join(', ') || 'Cat safety information'}.`}
        />
        <meta 
          name="keywords" 
          content={`${flower.common_name}, ${flower.scientific_name}, ${flower.search_intent?.join(', ') || ''}, cat safe flowers, pet friendly flowers, ${flower.safety_status.toLowerCase()} flowers for cats`}
        />
        <meta property="og:title" content={`${flower.display_name} - Is it a Cat Safe Flower? | PawSafePlants`} />
        <meta 
          property="og:description" 
          content={`${flower.display_name} ${flower.safety_status === 'Safe' ? 'is completely safe for cats' : 'may be harmful to cats'}. ${flower.toxicity_level}.`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={flower.file_path} />
        <link rel="canonical" href={`https://www.pawsafeplants.com/plants/${flower.seo_slug}`} />
        
        {/* Hreflang tags */}
        <link rel="alternate" hreflang="en-us" href={`https://www.pawsafeplants.com/plants/${flower.seo_slug}`} />
        <link rel="alternate" hreflang="en-gb" href={`https://uk.pawsafeplants.com/plants/${flower.seo_slug}`} />
        <link rel="alternate" hreflang="de" href={`https://de.pawsafeplants.com/plants/${flower.seo_slug}`} />
        <link rel="alternate" hreflang="x-default" href={`https://www.pawsafeplants.com/plants/${flower.seo_slug}`} />
      </Head>

      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: warmCream,
        minHeight: '100vh'
      }}>
        {/* Hero Section with Safety Alert */}
        <section style={{
          background: `linear-gradient(135deg, ${safetyStyling.bg}20, ${safetyStyling.bg}10)`,
          padding: '60px 20px',
          borderBottom: `3px solid ${safetyStyling.border}`,
          textAlign: 'center'
        }}>
          <FadeIn>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '20px',
              padding: '16px 24px',
              background: safetyStyling.bg,
              border: `2px solid ${safetyStyling.border}`,
              borderRadius: borderRadius,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <span style={{ fontSize: '48px' }}>{safetyStyling.icon}</span>
              <div style={{ textAlign: 'left' }}>
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: safetyStyling.color,
                  margin: '0 0 8px 0',
                  lineHeight: 1.2
                }}>
                  {flower.display_name}
                </h1>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: safetyStyling.color
                }}>
                  {safetyStyling.label}
                </div>
              </div>
            </div>

            {/* Scientific Name */}
            <div style={{
              fontSize: '16px',
              color: '#666',
              fontStyle: 'italic',
              marginBottom: '16px'
            }}>
              {flower.scientific_name} • {flower.family}
            </div>

            {/* Toxicity Level */}
            <div style={{
              fontSize: '18px',
              fontWeight: 600,
              color: safetyStyling.color,
              marginBottom: '20px'
            }}>
              {flower.toxicity_level}
            </div>

            {/* ASPCA Reference */}
            {isVerified && (
              <div style={{ marginBottom: '20px' }}>
                <ASPCABadge 
                  toxicityLevel={flower.toxicity_level}
                  isVerified={isVerified}
                  size="large"
                />
              </div>
            )}
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
            {/* Left Column - Image and Basic Info */}
            <SlideIn direction="left">
              <div style={{ marginBottom: '32px' }}>
                <OptimizedImage
                  src={flower.file_path}
                  alt={`${flower.display_name} - Cat Safety Information`}
                  width={600}
                  height={400}
                  priority={true}
                  style={{
                    width: '100%',
                    borderRadius: borderRadius,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                  }}
                />
              </div>

              {/* Quick Info */}
              <div style={{
                background: '#fff',
                padding: '24px',
                borderRadius: borderRadius,
                border: `2px solid ${warmCreamDark}`,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: sageGreenDark,
                  marginBottom: '16px'
                }}>
                  Quick Facts
                </h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <strong>Common Name:</strong> {flower.common_name}
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <strong>Scientific Name:</strong> {flower.scientific_name}
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <strong>Family:</strong> {flower.family}
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <strong>Safety Status:</strong> 
                  <span style={{
                    color: safetyStyling.color,
                    fontWeight: 600,
                    marginLeft: '8px'
                  }}>
                    {safetyStyling.label}
                  </span>
                </div>

                {/* Gifting Occasions */}
                {flower.gifting_occasions && flower.gifting_occasions.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <strong>Perfect for:</strong>
                    <div style={{ marginTop: '8px' }}>
                      {flower.gifting_occasions.map((occasion, index) => (
                        <span
                          key={index}
                          style={{
                            display: 'inline-block',
                            background: sageGreen,
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            margin: '2px'
                          }}
                        >
                          {occasion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SlideIn>

            {/* Right Column - Detailed Information */}
            <SlideIn direction="right">
              {/* Safety Information */}
              <div style={{
                background: safetyStyling.bg,
                border: `2px solid ${safetyStyling.border}`,
                borderRadius: borderRadius,
                padding: '24px',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: safetyStyling.color,
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {safetyStyling.icon} Cat Safety Information
                </h3>

                {flower.safety_status === 'Safe' ? (
                  <div style={{ color: safetyStyling.color }}>
                    <p style={{ marginBottom: '12px' }}>
                      <strong>✅ Good News!</strong> {flower.display_name} is generally safe for cats.
                    </p>
                    <p style={{ marginBottom: '12px' }}>
                      This flower is considered non-toxic to felines, making it a great choice for cat-friendly homes and gardens.
                    </p>
                    <p>
                      <strong>Note:</strong> While generally safe, individual cats may have sensitivities. Always monitor your cat around new plants.
                    </p>
                  </div>
                ) : flower.safety_status === 'Mild' ? (
                  <div style={{ color: safetyStyling.color }}>
                    <p style={{ marginBottom: '12px' }}>
                      <strong>⚠️ Mild Caution</strong> {flower.display_name} may cause mild symptoms.
                    </p>
                    <p style={{ marginBottom: '12px' }}>
                      <strong>Symptoms:</strong> {flower.toxicity_symptoms}
                    </p>
                    <p>
                      <strong>Recommendation:</strong> Use with caution in homes with cats. Consider cat-safe alternatives for complete peace of mind.
                    </p>
                  </div>
                ) : (
                  <div style={{ color: safetyStyling.color }}>
                    <p style={{ marginBottom: '12px' }}>
                      <strong>⚠️ TOXIC ALERT</strong> {flower.display_name} is toxic to cats.
                    </p>
                    <p style={{ marginBottom: '12px' }}>
                      <strong>Symptoms:</strong> {flower.toxicity_symptoms}
                    </p>
                    <p style={{ marginBottom: '12px' }}>
                      <strong>Immediate Action:</strong> If your cat ingests this plant, contact your veterinarian immediately.
                    </p>
                    <p>
                      <strong>Prevention:</strong> Keep this plant out of reach of cats or avoid it entirely in cat households.
                    </p>
                  </div>
                )}

                {/* ASPCA Reference */}
                {isVerified && (
                  <div style={{ marginTop: '20px' }}>
                    <ASPCAReference
                      toxicityLevel={flower.toxicity_level}
                      plantName={flower.display_name}
                      isVerified={isVerified}
                      showLink={true}
                      showBadge={true}
                    />
                  </div>
                )}
              </div>

              {/* Search Intent Keywords */}
              {flower.search_intent && flower.search_intent.length > 0 && (
                <div style={{
                  background: '#fff',
                  border: `2px solid ${warmCreamDark}`,
                  borderRadius: borderRadius,
                  padding: '24px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: sageGreenDark,
                    marginBottom: '12px'
                  }}>
                    Popular Search Terms
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {flower.search_intent.map((term, index) => (
                      <span
                        key={index}
                        style={{
                          background: '#f8f9fa',
                          color: '#495057',
                          padding: '6px 12px',
                          borderRadius: '16px',
                          fontSize: '12px',
                          border: '1px solid #dee2e6'
                        }}
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </SlideIn>
          </div>
        </section>

        {/* Related Flowers */}
        {relatedFlowers.length > 0 && (
          <section style={{
            maxWidth: '1200px',
            margin: '40px auto',
            padding: '0 20px'
          }}>
            <FadeIn>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 700,
                color: sageGreenDark,
                marginBottom: '24px',
                textAlign: 'center'
              }}>
                Related Flowers
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px'
              }}>
                {relatedFlowers.map((relatedFlower, index) => {
                  const relatedSafety = getSafetyStyling(relatedFlower.safety_status)
                  return (
                    <Link
                      key={relatedFlower.id}
                      href={`/plants/${relatedFlower.seo_slug}`}
                      style={{
                        textDecoration: 'none',
                        color: 'inherit'
                      }}
                    >
                      <div
                        style={{
                          background: '#fff',
                          borderRadius: borderRadius,
                          overflow: 'hidden',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                          transition: 'all 0.3s ease',
                          border: `2px solid ${warmCreamDark}`,
                          height: '100%'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)'
                          e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)'
                          e.currentTarget.style.borderColor = sageGreen + '40'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)'
                          e.currentTarget.style.borderColor = warmCreamDark
                        }}
                      >
                        <div style={{ height: '200px', overflow: 'hidden' }}>
                          <OptimizedImage
                            src={relatedFlower.file_path}
                            alt={relatedFlower.display_name}
                            width={280}
                            height={200}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                        
                        <div style={{ padding: '16px' }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px'
                          }}>
                            <h3 style={{
                              fontSize: '16px',
                              fontWeight: 600,
                              color: sageGreenDark,
                              margin: 0
                            }}>
                              {relatedFlower.display_name}
                            </h3>
                            <span style={{
                              fontSize: '12px',
                              color: relatedSafety.color,
                              background: relatedSafety.bg,
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontWeight: 600
                            }}>
                              {relatedSafety.icon} {relatedSafety.label}
                            </span>
                          </div>
                          
                          {relatedFlower.toxicity_level && (
                            <div style={{
                              fontSize: '12px',
                              color: '#666',
                              marginBottom: '8px'
                            }}>
                              {relatedFlower.toxicity_level}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </FadeIn>
          </section>
        )}

        {/* Back to Flowers */}
        <section style={{
          textAlign: 'center',
          padding: '40px 20px'
        }}>
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
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = sageGreenDark
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = sageGreen
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            ← Back to Cat-Safe Flowers
          </Link>
        </section>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .main-content {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          
          h1 {
            font-size: 24px !important;
          }
          
          .related-flowers {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </PageTransition>
  )
}

export async function getServerSideProps({ params }) {
  const { slug } = params
  
  // In a real implementation, this would query the database
  // For now, we'll return mock data based on the slug
  const mockFlowers = {
    'peony-toxicity-cats': {
      id: 1,
      common_name: 'Peony',
      scientific_name: 'Paeonia lactiflora',
      family: 'Paeoniaceae',
      display_name: 'Peony',
      safety_status: 'Toxic',
      toxicity_level: 'Toxic – Can cause gastrointestinal upset',
      toxicity_symptoms: 'Vomiting, diarrhea, drooling, abdominal pain',
      gifting_occasions: ['Wedding', 'Anniversary', 'Birthday'],
      search_intent: ['Peony bouquet delivery', 'Are peonies safe?'],
      seo_slug: 'peony-toxicity-cats',
      file_path: 'https://images.unsplash.com/photo-1558628037-f3b6c1b0c3b2?w=400&h=400&fit=crop'
    },
    'cat-safe-roses': {
      id: 3,
      common_name: 'Rose',
      scientific_name: 'Rosa rubiginosa',
      family: 'Rosaceae',
      display_name: 'Rose',
      safety_status: 'Safe',
      toxicity_level: 'Safe – Generally non-toxic to cats',
      toxicity_symptoms: 'None (thorns may cause physical injury)',
      gifting_occasions: ['Valentine\'s Day', 'Anniversary', 'Birthday', 'Wedding'],
      search_intent: ['Classic romance', 'Cat safe roses'],
      seo_slug: 'cat-safe-roses',
      file_path: 'https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=400&h=400&fit=crop'
    },
    'lily-deadly-toxicity-cats': {
      id: 11,
      common_name: 'Lily',
      scientific_name: 'Lilium longiflorum',
      family: 'Liliaceae',
      display_name: 'Lily',
      safety_status: 'Deadly',
      toxicity_level: 'Deadly – Extremely toxic, can cause acute kidney failure',
      toxicity_symptoms: 'Vomiting, lethargy, loss of appetite, kidney failure, death',
      gifting_occasions: ['Easter', 'Wedding', 'Funeral'],
      search_intent: ['Easter Lily danger', 'Lily pollen cat death'],
      seo_slug: 'lily-deadly-toxicity-cats',
      file_path: 'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=400&h=400&fit=crop'
    }
  }

  const flower = mockFlowers[slug] || null

  return {
    props: {
      flower
    }
  }
}
