import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { PageTransition, FadeIn, SlideIn } from '../../components/PageTransitions'
import OptimizedImage from '../../components/OptimizedImage'
import { ASPCAReference, ASPCABadge } from '../../components/ASPCAReference'

export default function BlogEditor({ post }) {
  const [content, setContent] = useState(post?.content || '')
  const [imagesConfig, setImagesConfig] = useState(post?.images_config || [])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedImages, setSelectedImages] = useState([])

  // Load media library
  const [mediaLibrary, setMediaLibrary] = useState([])
  const [mediaLoading, setMediaLoading] = useState(false)

  useEffect(() => {
    const loadMediaLibrary = async () => {
      try {
        setMediaLoading(true)
        const res = await fetch('/api/media')
        const data = await res.json()
        
        if (data.success && data.media) {
          setMediaLibrary(data.media)
          console.log('Media library loaded:', data.media.length, 'images')
        } else {
          console.error('Failed to load media library:', data.error)
          setMessage('Failed to load media library')
        }
      } catch (error) {
        console.error('Error loading media library:', error)
        setMessage('Error loading media library')
      } finally {
        setMediaLoading(false)
      }
    }

    loadMediaLibrary()
  }, [])

  const handleContentChange = (value) => {
    setContent(value)
    
    // Replace image placeholders in content
    const updatedContent = value.replace(/\[\[photo\d+\]\]/g, (match) => {
      const imageIndex = parseInt(match[1])
      if (selectedImages[imageIndex]) {
        return selectedImages[imageIndex].publicUrl
      }
      return match[0] // Keep original placeholder if image not selected
    })
    
    setContent(updatedContent)
  }

  const handleImageSelect = (image) => {
    setSelectedImages(prev => {
      const exists = prev.some(img => img.publicUrl === image.publicUrl)
      if (exists) {
        return prev // Image already selected
      }
      return [...prev, image]
    })
  }

  const handleImageRemove = (imageToRemove) => {
    setSelectedImages(prev => prev.filter(img => img.publicUrl !== imageToRemove.publicUrl))
  }

  const handleSaveBlog = async () => {
    if (!post) {
      setMessage('Blog post not found')
      return
    }

    setLoading(true)
    setSaving(true)

    try {
      const res = await fetch(`/api/plants/${post.slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...post,
          content,
          images_config: selectedImages.map(img => ({
            url: img.publicUrl,
            alt: img.display_name || img.original_name,
            caption: img.display_name || img.original_name,
            position: img.position || 'center'
          }))
        })
      })

      const data = await res.json()

      if (data.success) {
        setMessage('Blog post updated successfully!')
        // Update local post state
        setContent(content)
        setImagesConfig(selectedImages)
      } else {
        setMessage(`Failed to update blog post: ${data.error}`)
      }
    } catch (error) {
      console.error('Error updating blog post:', error)
      setMessage(`Error updating blog post: ${error.message}`)
    } finally {
      setLoading(false)
      setSaving(false)
    }
  }

  const handleAddImage = () => {
    const newImage = {
      url: '',
      alt: '',
      caption: '',
      position: 'center'
    }
    setSelectedImages(prev => [...prev, newImage])
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        padding: '2rem'
      }}>
        <div style={{ 
          maxWidth: '800px', 
          width: '100%', 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
          padding: '2rem'
        }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem', 
            color: '#2D2D2D' 
          }}>
            Edit Blog Post: {post?.title || 'Untitled'}
          </h1>

          {message && (
            <div style={{
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '8px',
              background: message.includes('success') ? '#d4edda' : '#f8d7da',
              color: 'white',
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600', 
              color: '#2D2D2D' 
            }}>
              Blog Content
            </label>
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              style={{
                width: '100%',
                height: '400px',
                padding: '1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'monospace',
                resize: 'vertical'
              }}
              placeholder="Write your blog content here..."
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600', 
              color: '#2D2D2D' 
            }}>
              Images Configuration
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {selectedImages.map((image, index) => (
                <div key={index} style={{
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '1rem',
                  background: '#f8f9fa'
                }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      value={image.alt}
                      onChange={(e) => {
                        const updatedImages = [...selectedImages]
                        updatedImages[index] = {
                          ...image,
                          alt: e.target.value
                        }
                        setSelectedImages(updatedImages)
                      }}
                      placeholder={`Image ${index + 1} alt text`}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}
                    />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleImageRemove(image)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleAddImage}
                disabled={saving}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: saving ? '#ccc' : '#2D2D2D',
                  color: saving ? '#666' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
              >
                {saving ? 'Saving...' : 'Add Image'}
              </button>
              <button
                onClick={handleSaveBlog}
                disabled={saving}
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: '#87A96B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
              >
                {saving ? 'Saving...' : 'Save Blog'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          fontSize: '1.5rem',
          color: '#666'
        }}>
          <div>Loading blog editor...</div>
        </div>
      )}
    </div>
  )
}
