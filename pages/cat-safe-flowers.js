import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { PageTransition, FadeIn, SlideIn, ListItemAnimation } from '../components/PageTransitions'
import OptimizedImage from '../components/OptimizedImage'

export default function CatSafeFlowers() {
  const [flowers, setFlowers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedScenario, setSelectedScenario] = useState('all')

  // 场景化长尾词
  const scenarios = [
    { id: 'all', name: 'All Flowers', keywords: 'cat safe flowers, pet friendly flowers' },
    { id: 'bouquets', name: 'Bouquets', keywords: 'cat safe bouquets, pet friendly bouquets' },
    { id: 'gift', name: 'Gift Flowers', keywords: 'cat safe gift flowers, pet friendly gifts' },
    { id: 'weddings', name: 'Weddings', keywords: 'cat safe wedding flowers, pet friendly weddings' },
    { id: 'valentines', name: 'Valentine\'s Day', keywords: 'cat safe valentines flowers, pet friendly valentines' },
    { id: 'anniversaries', name: 'Anniversaries', keywords: 'cat safe anniversary flowers, pet friendly anniversaries' },
    { id: 'birthdays', name: 'Birthdays', keywords: 'cat safe birthday flowers, pet friendly birthdays' },
    { id: 'get-well', name: 'Get Well', keywords: 'cat safe get well flowers, pet friendly get well' },
    { id: 'sympathy', name: 'Sympathy', keywords: 'cat safe sympathy flowers, pet friendly sympathy' }
  ]

  // Color palette
  const sageGreen = '#87A96B'
  const sageGreenDark = '#6B8553'
  const warmCream = '#FAF7F2'
  const warmCreamDark = '#F5F1E8'
  const borderRadius = '24px'

  useEffect(() => {
    const loadFlowers = async () => {
      try {
        const res = await fetch('/api/cat-safe-flowers')
        const data = await res.json()
        if (data.success && data.flowers) {
          setFlowers(data.flowers)
        }
      } catch (error) {
        console.error('Failed to load cat-safe flowers:', error)
      } finally {
        setLoading(false)
      }
    }
    loadFlowers()
  }, [])

  // 过滤花朵
  const filteredFlowers = selectedScenario === 'all' 
    ? flowers 
    : flowers.filter(flower => 
        flower.scenarios && flower.scenarios.includes(selectedScenario)
      )

  if (loading) {
    return (
      <PageTransition>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: warmCream,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid #f0f0f0',
              borderTop: '4px solid ' + sageGreen,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <p style={{ color: '#666', fontSize: '16px' }}>Loading cat-safe flowers...</p>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <Head>
        <title>Cat Safe Flowers - Complete Guide to Pet-Friendly Bouquets | PawSafePlants</title>
        <meta 
          name="description" 
          content="Discover beautiful cat-safe flowers for bouquets, gifts, and arrangements. Complete guide to pet-friendly flowers that keep your cats safe while adding beauty to your home." 
        />
        <meta 
          name="keywords" 
          content="cat safe flowers, pet friendly bouquets, cat safe arrangements, non-toxic flowers for cats, cat safe gift flowers, pet friendly wedding flowers, cat safe garden flowers, feline safe bouquets, cat safe valentines flowers, cat safe wedding flowers, cat safe birthday flowers" 
        />
        <meta property="og:title" content="Cat Safe Flowers - Complete Guide to Pet-Friendly Bouquets | PawSafePlants" />
        <meta 
          property="og:description" 
          content="Discover beautiful cat-safe flowers for bouquets, gifts, and arrangements. Complete guide to pet-friendly flowers that keep your cats safe." 
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.pawsafeplants.com/cat-safe-flowers" />
        
        {/* Hreflang tags */}
        <link rel="alternate" hreflang="en" href="https://www.pawsafeplants.com/cat-safe-flowers" />
        <link rel="alternate" hreflang="zh-CN" href="https://www.pawsafeplants.com/cat-safe-flowers" />
        <link rel="alternate" hreflang="ja" href="https://www.pawsafeplants.com/cat-safe-flowers" />
        <link rel="alternate" hreflang="x-default" href="https://www.pawsafeplants.com/cat-safe-flowers" />
      </Head>

      <div style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: warmCream,
        minHeight: '100vh'
      }}>
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #87A96B15, #87A96B05)',
          padding: '80px 20px',
          textAlign: 'center',
          borderBottom: `2px solid ${warmCreamDark}`
        }}>
          <FadeIn>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 700,
              color: sageGreenDark,
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              🌸 Cat Safe Flowers
            </h1>
            <p style={{
              fontSize: '20px',
              color: '#5A5A5A',
              maxWidth: '700px',
              margin: '0 auto 40px auto',
              lineHeight: 1.6
            }}>
              Discover beautiful flowers that are completely safe for your cats. Perfect for bouquets, gifts, and arrangements that won't harm your feline friends.
            </p>
            
            {/* Scenario Filter */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              {scenarios.map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario.id)}
                  style={{
                    padding: '12px 20px',
                    border: `2px solid ${selectedScenario === scenario.id ? sageGreen : warmCreamDark}`,
                    background: selectedScenario === scenario.id ? sageGreen : '#fff',
                    color: selectedScenario === scenario.id ? '#fff' : '#5A5A5A',
                    borderRadius: borderRadius,
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '44px',
                    minHeight: '44px'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedScenario !== scenario.id) {
                      e.currentTarget.style.background = warmCream
                      e.currentTarget.style.borderColor = sageGreen
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedScenario !== scenario.id) {
                      e.currentTarget.style.background = '#fff'
                      e.currentTarget.style.borderColor = warmCreamDark
                    }
                  }}
                >
                  {scenario.name}
                </button>
              ))}
            </div>
            
            <p style={{
              fontSize: '14px',
              color: '#888',
              fontStyle: 'italic'
            }}>
              {scenarios.find(s => s.id === selectedScenario)?.keywords}
            </p>
          </FadeIn>
        </section>

        {/* Flowers Grid */}
        <section style={{
          maxWidth: '1200px',
          margin: '64px auto',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px'
          }}>
            {filteredFlowers.map((flower, index) => (
              <ListItemAnimation key={flower.id} index={index}>
                <div
                  style={{
                    background: '#fff',
                    borderRadius: borderRadius,
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    border: `2px solid ${warmCreamDark}`,
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-12px)';
                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(135, 169, 107, 0.2)';
                    e.currentTarget.style.borderColor = sageGreen + '40';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = warmCreamDark;
                  }}
                >
                  {/* Flower Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: sageGreen,
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 600,
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    🌸 Cat Safe
                  </div>
                  
                  {/* Flower Image */}
                  <div style={{ height: '280px', overflow: 'hidden' }}>
                    <OptimizedImage
                      src={flower.image}
                      alt={`${flower.name} - Cat Safe Flower`}
                      width={400}
                      height={280}
                      priority={index < 4}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  
                  {/* Flower Info */}
                  <div style={{ padding: '32px' }}>
                    <h2 style={{
                      fontSize: '24px',
                      fontWeight: 700,
                      color: sageGreenDark,
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      {flower.name}
                      <span style={{
                        fontSize: '14px',
                        color: '#87A96B',
                        background: '#87A96B15',
                        padding: '4px 10px',
                        borderRadius: '12px'
                      }}>
                        Safe
                      </span>
                    </h2>
                    
                    <p style={{
                      fontSize: '16px',
                      color: '#5A5A5A',
                      lineHeight: 1.6,
                      marginBottom: '20px',
                      minHeight: '60px'
                    }}>
                      {flower.summary}
                    </p>
                    
                    {/* Scenarios Tags */}
                    {flower.scenarios && flower.scenarios.length > 0 && (
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginBottom: '24px'
                      }}>
                        {flower.scenarios.slice(0, 4).map((scenario, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '12px',
                              color: '#666',
                              background: '#f8f9fa',
                              padding: '6px 12px',
                              borderRadius: '12px',
                              textTransform: 'capitalize',
                              border: '1px solid #e9ecef'
                            }}
                          >
                            {scenario}
                          </span>
                        ))}
                        {flower.scenarios.length > 4 && (
                          <span style={{
                            fontSize: '12px',
                            color: '#999',
                            padding: '6px 12px'
                          }}>
                            +{flower.scenarios.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    <Link
                      href={`/plants/${flower.name.toLowerCase().replace(/\s+/g, '-')}`}
                      style={{
                        display: 'inline-block',
                        padding: '14px 28px',
                        background: sageGreen,
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: borderRadius,
                        fontWeight: 600,
                        fontSize: '16px',
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                        width: '100%',
                        minHeight: '48px'
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
            ))}
          </div>
          
          {filteredFlowers.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              color: '#666'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🌸</div>
              <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>No flowers found</h3>
              <p>Try selecting a different scenario or check back later for more cat-safe flowers.</p>
            </div>
          )}
        </section>

        {/* SEO Content Section */}
        <section style={{
          maxWidth: '800px',
          margin: '64px auto',
          padding: '0 20px',
          background: '#fff',
          borderRadius: borderRadius,
          padding: '48px',
          border: `2px solid ${warmCreamDark}`
        }}>
          <FadeIn>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 700,
              color: sageGreenDark,
              marginBottom: '24px'
            }}>
              Why Choose Cat-Safe Flowers?
            </h2>
            
            <div style={{ lineHeight: 1.8, color: '#5A5A5A' }}>
              <p style={{ marginBottom: '20px' }}>
                When you have cats at home, choosing the right flowers is crucial for their safety and wellbeing. 
                Many common flowers can be toxic to cats, causing symptoms ranging from mild irritation to severe health issues.
              </p>
              
              <h3 style={{
                fontSize: '24px',
                fontWeight: 600,
                color: sageGreenDark,
                marginTop: '32px',
                marginBottom: '16px'
              }}>
                Popular Cat-Safe Flower Options:
              </h3>
              
              <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                <li><strong>Roses:</strong> Classic and romantic, completely safe for cats</li>
                <li><strong>Sunflowers:</strong> Bright and cheerful, perfect for sunny arrangements</li>
                <li><strong>Orchids:</strong> Elegant and long-lasting, safe for feline friends</li>
                <li><strong>Zinnias:</strong> Colorful and vibrant, great for garden bouquets</li>
                <li><strong>Marigolds:</strong> Festive and bright, safe for indoor arrangements</li>
              </ul>
              
              <h3 style={{
                fontSize: '24px',
                fontWeight: 600,
                color: sageGreenDark,
                marginTop: '32px',
                marginBottom: '16px'
              }}>
                Perfect for Every Occasion:
              </h3>
              
              <p style={{ marginBottom: '20px' }}>
                Our cat-safe flowers are perfect for weddings, Valentine's Day, birthdays, anniversaries, 
                or simply brightening up your home. You can create beautiful bouquets and arrangements 
                without worrying about your feline friends' safety.
              </p>
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
            ⚠️ Always consult with your veterinarian if you're unsure about a plant's safety.
          </p>
          <Link
            href="/"
            style={{
              color: sageGreenDark,
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '15px'
            }}
          >
            ← Back to Home
          </Link>
        </footer>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          h1 {
            font-size: 32px !important;
          }
          
          .scenario-filters {
            justify-content: center;
          }
          
          .flowers-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </PageTransition>
  )
}
