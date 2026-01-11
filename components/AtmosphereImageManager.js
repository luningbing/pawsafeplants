import { useState, useEffect } from 'react';

const AtmosphereImageManager = ({ 
  mediaMetadata, 
  onAtmosphereChange, 
  loading = false 
}) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [atmosphereImages, setAtmosphereImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 加载当前氛围图
  useEffect(() => {
    loadAtmosphereImages();
  }, []);

  const loadAtmosphereImages = async () => {
    try {
      const response = await fetch('/api/admin/atmosphere-images');
      const data = await response.json();
      
      if (response.ok) {
        setAtmosphereImages(data.atmosphere_images || []);
        setSelectedImages((data.atmosphere_images || []).map(img => img.id));
      }
    } catch (error) {
      console.error('Failed to load atmosphere images:', error);
    }
  };

  const toggleImageAtmosphere = async (imageId, currentState) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/atmosphere-images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageId,
          isAtmosphere: !currentState
        })
      });

      const data = await response.json();

      if (response.ok) {
        // 更新本地状态
        if (!currentState) {
          setSelectedImages([...selectedImages, imageId]);
          setAtmosphereImages([...atmosphereImages, 
            mediaMetadata.find(img => img.id === imageId)
          ]);
        } else {
          setSelectedImages(selectedImages.filter(id => id !== imageId));
          setAtmosphereImages(atmosphereImages.filter(img => img.id !== imageId));
        }

        setMessage(`✅ ${data.message}`);
        setTimeout(() => setMessage(''), 2000);
      } else {
        setMessage(`❌ ${data.error || '操作失败'}`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to toggle atmosphere image:', error);
      setMessage('❌ 网络错误，请重试');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const saveAtmosphereImages = async () => {
    if (selectedImages.length === 0) {
      setMessage('❌ 请至少选择一张氛围图');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/atmosphere-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageIds: selectedImages })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        setTimeout(() => setMessage(''), 2000);
        onAtmosphereChange && onAtmosphereChange();
      } else {
        setMessage(`❌ ${data.error || '保存失败'}`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to save atmosphere images:', error);
      setMessage('❌ 网络错误，请重试');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      animation: 'fadeIn 0.4s ease'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#2d5016',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        🌸 猫猫氛围图管理
      </h2>

      {/* 状态消息 */}
      {message && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          borderRadius: '8px',
          fontSize: '0.9rem',
          fontWeight: '500',
          textAlign: 'center',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}

      {/* 当前氛围图 */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '500',
          color: '#333',
          marginBottom: '1rem'
        }}>
          当前氛围图 ({atmosphereImages.length}张)
        </h3>
        
        {atmosphereImages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#666',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '2px dashed #dee2e6'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌸</div>
            <div>还没有设置氛围图</div>
            <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              请从下方选择图片作为氛围图
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            {atmosphereImages.map(image => (
              <div key={image.id} style={{
                position: 'relative',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '2px solid #2d5016',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(45, 80, 22, 0.15)'
              }}>
                <img
                  src={image.file_path}
                  alt={image.display_name}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  backgroundColor: '#2d5016',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
                onClick={() => toggleImageAtmosphere(image.id, true)}
                title="移除氛围图"
              >
                ×
              </div>
                <div style={{
                  padding: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#666',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {image.display_name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 所有图片选择器 */}
      <div>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '500',
          color: '#333',
          marginBottom: '1rem'
        }}>
          选择氛围图
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '0.8rem',
          maxHeight: '400px',
          overflowY: 'auto',
          padding: '0.5rem',
          border: '2px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#fafafa'
        }}>
          {mediaMetadata.filter(img => !img.is_atmosphere).map(image => (
            <div key={image.id} style={{
              position: 'relative',
              cursor: 'pointer',
              borderRadius: '6px',
              overflow: 'hidden',
              border: selectedImages.includes(image.id) 
                ? '2px solid #2d5016' 
                : '2px solid #e5e7eb',
              backgroundColor: selectedImages.includes(image.id) ? '#f0fdf4' : 'white',
              transition: 'all 0.2s ease'
            }}>
              <img
                src={image.file_path}
                alt={image.display_name}
                style={{
                  width: '100%',
                  height: '100px',
                  objectFit: 'cover',
                  display: 'block',
                  opacity: selectedImages.includes(image.id) ? '1' : '0.7'
                }}
                onClick={() => toggleImageAtmosphere(image.id, image.is_atmosphere)}
              />
              
              {selectedImages.includes(image.id) && (
                <div style={{
                  position: 'absolute',
                  top: '0.25rem',
                  left: '0.25rem',
                  backgroundColor: '#2d5016',
                  color: 'white',
                  borderRadius: '4px',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.7rem',
                  fontWeight: '500'
                }}>
                  ✓
                </div>
              )}
              
              <div style={{
                padding: '0.5rem',
                fontSize: '0.75rem',
                color: '#666',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {image.display_name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 操作按钮 */}
      <div style={{
        marginTop: '2rem',
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center'
      }}>
        <button
          onClick={saveAtmosphereImages}
          disabled={loading || selectedImages.length === 0}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: loading || selectedImages.length === 0 ? '#94a3b8' : '#2d5016',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: loading || selectedImages.length === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {loading ? '保存中...' : `保存氛围图 (${selectedImages.length}张)`}
        </button>
        
        <button
          onClick={() => {
            setSelectedImages([]);
            setMessage('');
          }}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          清空选择
        </button>
      </div>
    </div>
  );
};

export default AtmosphereImageManager;
