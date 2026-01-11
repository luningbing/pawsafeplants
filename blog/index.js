import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { PageTransition, FadeIn } from '../../components/PageTransitions'
import OptimizedImage from '../../components/OptimizedImage'

export default function BlogIndex() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // Color palette
  const sageGreen = '#87A96B'
  const sageGreenDark = '#6B8553'
  const warmCream = '#FAF7F2'
  const warmCreamDark = '#F5F1E8'
  const borderRadius = '24px'

  // Load blog posts
  useEffect(() => {
    const loadPosts = async () => {
      try {
        // For now, we'll use mock data. In production, this would come from a CMS or database
        const mockPosts = [
          {
            id: 1,
            title: "Valentine's Day Flower Guide: The Top 7 Cat-Safe Bouquets for Your Furry Valentine",
            slug: 'valentines-day-cat-safe-flowers-guide',
            excerpt: "Complete guide to beautiful, cat-safe flowers that won't harm your furry Valentine. Learn about toxic lilies and discover stunning alternatives for a romantic, pet-friendly celebration.",
            image: 'https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=400&h=250&fit=crop',
            category: 'Holiday Guides',
            date: '2026-01-12',
            readTime: '8 min read',
            featured: true,
            tags: ['Valentine\'s Day', 'Cat Safe Flowers', 'Pet Friendly', 'Flower Guide']
          }
        ]
        setPosts(mockPosts)
      } catch (error) {
        console.error('Failed to load blog posts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  return (
    <PageTransition>
      <Head>
        <title>PawSafePlants Blog - Cat-Safe Flower Guides & Pet Safety Tips</title>
        <meta 
          name="description" 
          content="Expert guides on cat-safe flowers, pet-friendly plants, and keeping your feline friends safe. Comprehensive flower safety information for every occasion."
        />
        <meta 
          name="keywords" 
          content="cat safe flowers blog, pet friendly plants, cat safety guide, flower toxicity cats, pet safety blog, cat safe gardening, non-toxic flowers for cats"
        />
        <meta property="og:title" content="PawSafePlants Blog - Cat-Safe Flower Guides & Pet Safety Tips" />
        <meta 
          property="og:description" 
          content="Expert guides on cat-safe flowers, pet-friendly plants, and keeping your feline friends safe."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.pawsafeplants.com/blog" />
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
          textAlign: 'center'
        }}>
          <FadeIn>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '20px',
              lineHeight: 1.2
            }}>
              🌸 PawSafePlants Blog
            </h1>
            <p style={{
              fontSize: '20px',
              color: '#fff',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Expert guides on cat-safe flowers, pet-friendly plants, and keeping your feline friends safe. 
              Comprehensive flower safety information for every occasion.
            </p>
          </FadeIn>
        </section>

        {/* Blog Posts Grid */}
        <section style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 20px'
        }}>
          <FadeIn>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '80px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  border: '4px solid ' + sageGreen,
                  borderRadius: '50%',
                  borderTop: '4px solid transparent',
                  borderBottom: '4px solid transparent',
                  animation: 'spin 1s linear infinite'
                }}></div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '32px'
              }}>
                {posts.map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
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
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s ease',
                        border: `2px solid ${warmCreamDark}`,
                        height: '100%'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)'
                        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.15)'
                        e.currentTarget.style.borderColor = sageGreen
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)'
                        e.currentTarget.style.borderColor = warmCreamDark
                      }}
                    >
                      {/* Featured Badge */}
                      {post.featured && (
                        <div style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          background: valentineRed,
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          zIndex: 10
                        }}>
                          ⭐ Featured
                        </div>
                      )}
                      
                      {/* Post Image */}
                      <div style={{ height: '250px', overflow: 'hidden' }}>
                        <OptimizedImage
                          src={post.image}
                          alt={post.title}
                          width={400}
                          height={250}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                      
                      {/* Post Content */}
                      <div style={{ padding: '24px' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px'
                        }}>
                          <span style={{
                            background: sageGreen,
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {post.category}
                          </span>
                          <span style={{
                            fontSize: '14px',
                            color: '#666'
                          }}>
                            {post.readTime}
                          </span>
                        </div>
                        
                        <h2 style={{
                          fontSize: '20px',
                          fontWeight: 700,
                          color: sageGreenDark,
                          marginBottom: '12px',
                          lineHeight: 1.3
                        }}>
                          {post.title}
                        </h2>
                        
                        <p style={{
                          fontSize: '16px',
                          color: '#666',
                          lineHeight: 1.6,
                          marginBottom: '16px'
                        }}>
                          {post.excerpt}
                        </p>
                        
                        {/* Tags */}
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px',
                          marginBottom: '16px'
                        }}>
                          {post.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              style={{
                                background: '#f8f9fa',
                                color: '#495057',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                border: '1px solid #dee2e6'
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div style={{
                          fontSize: '14px',
                          color: '#888',
                          fontStyle: 'italic'
                        }}>
                          {post.date}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </FadeIn>
        </section>

        {/* CTA Section */}
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
              🌸 Explore Our Cat-Safe Flower Database
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#fff',
              marginBottom: '32px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Ready to find the perfect cat-safe flowers for any occasion? 
              Browse our comprehensive database with safety information and gifting suggestions.
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
              Browse All Flowers
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
            🌸 Stay informed about cat-safe flowers and pet safety.
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
          .blog-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          
          h1 {
            font-size: 36px !important;
          }
        }
      `}</style>
    </PageTransition>
  )
}
