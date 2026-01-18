import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PageTransition, FadeIn, SlideIn } from '../../components/PageTransitions'
import OptimizedImage from '../../components/OptimizedImage'
import { ASPCAReference, ASPCABadge } from '../../components/ASPCAReference'
import { createClient } from '@supabase/supabase-js'
import { remark } from 'remark'
import html from 'remark-html'

export default function BlogPost({ post }) {
  const [atmosphereImages, setAtmosphereImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [contentHtml, setContentHtml] = useState('')

  if (!post) {
    return <div>Article not found.</div>;
  }

  // Convert markdown content to HTML
  useEffect(() => {
    const convertContent = async () => {
      if (post.content) {
        try {
          const result = await remark().use(html).process(post.content)
          setContentHtml(result.toString())
        } catch (error) {
          console.error('Error converting markdown:', error)
          setContentHtml('<p>Content not available.</p>')
        }
      } else {
        setContentHtml('<p>Content not available.</p>')
      }
    }
    convertContent()
  }, [post.content])

  // Get gallery images for this specific blog post
  const galleryImages = post.gallery_images || []

  // Color palette
  const sageGreen = '#87A96B'
  const sageGreenDark = '#6B8553'
  const warmCream = '#FAF7F2'
  const warmCreamDark = '#F5F1E8'
  const valentineRed = '#e91e63'
  const valentinePink = '#f8bbd9'
  const borderRadius = '24px'

  // Load atmosphere images
  useEffect(() => {
    const loadAtmosphereImages = async () => {
      try {
        const imagesRes = await fetch('/api/atmosphere-images')
        const imagesData = await imagesRes.json()
        
        if (imagesData.atmosphere_images) {
          setAtmosphereImages(imagesData.atmosphere_images)
        }
      } catch (error) {
        console.error('Failed to load atmosphere images:', error)
      }
    }

    loadAtmosphereImages()
  }, [])

  return (
    <>
      <Head>
        <title>{post.title} - PawSafePlants</title>
        <meta name="description" content={post.title} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.title} />
        <meta property="og:image" content={post.cover_image_url} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.pawsafeplants.com/blog/${post.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.title} />
        <meta name="twitter:image" content={post.cover_image_url} />
      </Head>

      <PageTransition>
        <div style={{ 
          minHeight: '100vh', 
          backgroundColor: warmCream,
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {/* Hero Section */}
          <div style={{ 
            position: 'relative',
            height: '60vh',
            minHeight: '400px',
            backgroundImage: `linear-gradient(135deg, ${valentinePink} 0%, ${valentineRed} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {/* Floating Hearts Background */}
            <div style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              fontSize: '2rem',
              lineHeight: 1
            }}>
              {'💕💝💖💗💓💕💝💖💗💓'.split('').map((heart, i) => (
                <span key={i} style={{
                  position: 'absolute',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}>{heart}</span>
              ))}
            </div>

            <div style={{ 
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              color: 'white',
              padding: '2rem'
            }}>
              <FadeIn>
                <h1 style={{ 
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  lineHeight: 1.2
                }}>
                  {post.title}
                </h1>
                <div style={{ 
                  fontSize: '1.2rem',
                  opacity: 0.9,
                  marginBottom: '2rem'
                }}>
                  爱在空气中，安全在心中 💕
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '4rem 2rem',
            display: 'grid',
            gridTemplateColumns: '1fr 300px',
            gap: '3rem'
          }}>
            {/* Article Content */}
            <SlideIn>
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: borderRadius,
                padding: '3rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: `1px solid ${warmCreamDark}`
              }}>
                {/* Cover Image */}
                {post.cover_image_url && (
                  <div style={{ 
                    marginBottom: '2rem',
                    borderRadius: borderRadius,
                    overflow: 'hidden',
                    border: `1px solid ${warmCreamDark}`
                  }}>
                    <OptimizedImage
                      src={post.cover_image_url}
                      alt={post.title}
                      style={{
                        width: '100%',
                        height: '400px',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}

                {/* Blog Content */}
                <div 
                  style={{
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    color: '#2d3748'
                  }}
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div style={{ 
                    marginTop: '3rem',
                    paddingTop: '2rem',
                    borderTop: `1px solid ${warmCreamDark}`
                  }}>
                    <h3 style={{ 
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      color: sageGreenDark,
                      marginBottom: '1rem'
                    }}>
                      🏷️ 标签
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: valentinePink,
                            color: valentineRed,
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* ASPCA Reference */}
                <div style={{ marginTop: '3rem' }}>
                  <ASPCAReference />
                </div>
              </div>
            </SlideIn>

            {/* Sidebar */}
            <div>
              <FadeIn>
                {/* Gallery Images - Specific for Valentine's post */}
                {galleryImages.length > 0 && (
                  <div style={{ 
                    backgroundColor: 'white',
                    borderRadius: borderRadius,
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                    border: `1px solid ${warmCreamDark}`
                  }}>
                    <h3 style={{ 
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      color: sageGreenDark,
                      marginBottom: '1rem'
                    }}>
                      📸 求婚瞬间
                    </h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {galleryImages.map((image, index) => (
                        <div key={index} style={{ marginBottom: '1rem' }}>
                          <div style={{
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: `1px solid ${warmCreamDark}`
                          }}>
                            <OptimizedImage
                              src={image.url}
                              alt={image.title}
                              style={{
                                width: '100%',
                                height: '180px',
                                objectFit: 'cover'
                              }}
                            />
                          </div>
                          <h4 style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#2d3748',
                            marginTop: '0.5rem',
                            marginBottom: '0.25rem'
                          }}>
                            {image.title}
                          </h4>
                          <p style={{
                            fontSize: '0.9rem',
                            color: '#718096',
                            lineHeight: 1.4
                          }}>
                            {image.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Atmosphere Images */}
                {atmosphereImages.length > 0 && (
                  <div style={{ 
                    backgroundColor: 'white',
                    borderRadius: borderRadius,
                    padding: '1.5rem',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                    border: `1px solid ${warmCreamDark}`
                  }}>
                    <h3 style={{ 
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      color: sageGreenDark,
                      marginBottom: '1rem'
                    }}>
                      🌸 浪漫氛围
                    </h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {atmosphereImages.slice(0, 3).map((image, index) => (
                        <div key={index} style={{
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: `1px solid ${warmCreamDark}`
                        }}>
                          <OptimizedImage
                            src={image.url}
                            alt={image.title || 'Romantic atmosphere'}
                            style={{
                              width: '100%',
                              height: '120px',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Back to Home */}
                <div style={{ marginTop: '2rem' }}>
                  <Link href="/">
                    <button style={{
                      width: '100%',
                      padding: '1rem',
                      backgroundColor: sageGreen,
                      color: 'white',
                      border: 'none',
                      borderRadius: borderRadius,
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}>
                      🏠 返回首页
                    </button>
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Floating Animation Styles */}
          <style jsx>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(10deg); }
            }
          `}</style>
        </div>
      </PageTransition>
    </>
  )
}

export async function getStaticPaths() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('status', 'published')

    if (error) {
      console.error('Error fetching blog paths:', error)
      return { paths: [], fallback: true }
    }

    const paths = (data || []).map(post => ({
      params: { slug: post.slug }
    }))

    return { paths, fallback: true }
  } catch (error) {
    console.error('Error in getStaticPaths:', error)
    return { paths: [], fallback: true }
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error || !data) {
      console.error('Error fetching blog post:', error)
      return { props: { post: null } }
    }

    return {
      props: { post: data },
      revalidate: 3600 // Revalidate every hour
    }
  } catch (error) {
    console.error('Error in getStaticProps:', error)
    return { props: { post: null } }
  }
}
