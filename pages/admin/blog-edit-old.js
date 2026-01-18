import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function BlogEdit() {
  const router = useRouter();
  const { id } = router.query;
  const [token, setToken] = useState('');
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    // 检查登录状态
    const storedToken = localStorage.getItem('admin_token');
    if (!storedToken) {
      router.push('/admin');
      return;
    }
    setToken(storedToken);

    if (id) {
      fetchBlog(storedToken, id);
    }
  }, [id]);

  const fetchBlog = async (authToken, blogId) => {
    try {
      const response = await fetch(`/api/admin/blog-edit?id=${blogId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const result = await response.json();
      
      if (result.success) {
        const blogData = result.data;
        setBlog(blogData);
        setTitle(blogData.title || '');
        setContent(blogData.content || '');
        setTags(blogData.tags ? blogData.tags.join(', ') : '');
        setCoverImage(blogData.cover_image_url || '');
        setGalleryImages(blogData.gallery_images || []);
      }
    } catch (error) {
      console.error('获取博客详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImageUpload = async (position, title, description) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          await uploadGalleryImage(position, title, description, reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const uploadGalleryImage = async (position, title, description, imageData) => {
    setUploadingImage(position);

    try {
      const response = await fetch('/api/admin/blog-edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          blogId: id,
          position,
          title,
          description,
          file: imageData
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`${title} 图片上传成功！`);
        setGalleryImages(result.data.gallery);
      } else {
        alert(`上传失败: ${result.error}`);
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败，请重试');
    } finally {
      setUploadingImage(null);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('请填写标题和内容');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/admin/blog-edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: id,
          title: title.trim(),
          content: content.trim(),
          tags: tags,
          cover_image_url: coverImage
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('博客保存成功！');
        setBlog(result.data);
      } else {
        alert(`保存失败: ${result.error}`);
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        加载中...
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        博客不存在
      </div>
    );
  }

  // 预定义的画廊图片位置
  const galleryPositions = [
    { position: 'the_ring_bearer', title: 'The Ring Bearer', description: '小猫咪戴着求婚戒指，准备见证主人的浪漫时刻' },
    { position: 'flower_crown', title: 'Flower Crown', description: '猫咪戴着花冠，成为情人节最可爱的见证者' },
    { position: 'proposal_moment', title: 'Proposal Moment', description: '在浪漫的求婚瞬间，猫咪静静陪伴在旁' },
    { position: 'celebration_hug', title: 'Celebration Hug', description: '求婚成功后，与猫咪一起庆祝这个特殊时刻' }
  ];

  return (
    <>
      <Head>
        <title>编辑博客 - PawSafePlants</title>
        <meta name="description" content="编辑博客文章" />
      </Head>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        {/* 头部 */}
        <div style={{ 
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '10px'
          }}>
            ✏️ 编辑博客
          </h1>
          <p style={{ 
            color: '#718096',
            fontSize: '16px'
          }}>
            编辑博客文章和画廊图片
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          {/* 主要编辑区域 */}
          <div>
            {/* 博客基本信息 */}
            <div style={{ 
              background: '#ffffff',
              borderRadius: '12px',
              padding: '30px',
              marginBottom: '30px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '25px'
              }}>
                📝 基本信息
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#4a5568',
                  marginBottom: '8px'
                }}>
                  博客标题 *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="请输入博客标题"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4299e1';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#4a5568',
                  marginBottom: '8px'
                }}>
                  标签 (用逗号分隔)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="例如: 猫咪, 植物, 安全"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4299e1';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                  }}
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#4a5568',
                  marginBottom: '8px'
                }}>
                  封面图片
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px dashed #cbd5e0',
                    borderRadius: '8px',
                    background: '#f7fafc',
                    cursor: 'pointer'
                  }}
                />
                
                {coverImage && (
                  <div style={{ marginTop: '15px' }}>
                    <img
                      src={coverImage}
                      alt="封面预览"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '150px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}
                    />
                    <button
                      onClick={() => setCoverImage('')}
                      style={{
                        marginLeft: '10px',
                        padding: '6px 12px',
                        background: '#e53e3e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      删除图片
                    </button>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#4a5568',
                  marginBottom: '8px'
                }}>
                  博客内容 *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="请输入博客内容（支持Markdown格式）"
                  rows={15}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4299e1';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                  }}
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving || !title.trim() || !content.trim()}
                style={{
                  padding: '14px 28px',
                  background: saving || !title.trim() || !content.trim() ? '#cbd5e0' : '#4299e1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: saving || !title.trim() || !content.trim() ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                {saving ? '保存中...' : '💾 保存博客'}
              </button>
            </div>
          </div>

          {/* 侧边栏 - 画廊图片管理 */}
          <div>
            <div style={{ 
              background: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '20px'
              }}>
                📸 画廊图片
              </h3>

              {galleryPositions.map((item, index) => {
                const existingImage = galleryImages.find(img => img.position === item.position);
                
                return (
                  <div key={item.position} style={{ 
                    marginBottom: '20px',
                    padding: '15px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    background: '#fafafa'
                  }}>
                    <h4 style={{ 
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#2d3748',
                      marginBottom: '8px'
                    }}>
                      {item.title}
                    </h4>
                    
                    <p style={{ 
                      fontSize: '12px',
                      color: '#718096',
                      marginBottom: '12px',
                      lineHeight: '1.4'
                    }}>
                      {item.description}
                    </p>

                    {existingImage ? (
                      <div>
                        <img
                          src={existingImage.url}
                          alt={existingImage.title}
                          style={{
                            width: '100%',
                            height: '120px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            marginBottom: '10px'
                          }}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleGalleryImageUpload(item.position, item.title, item.description)}
                            disabled={uploadingImage === item.position}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              background: uploadingImage === item.position ? '#cbd5e0' : '#4299e1',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: uploadingImage === item.position ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {uploadingImage === item.position ? '上传中...' : '🔄 更换'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleGalleryImageUpload(item.position, item.title, item.description)}
                        disabled={uploadingImage === item.position}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: uploadingImage === item.position ? '#cbd5e0' : '#e53e3e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          cursor: uploadingImage === item.position ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {uploadingImage === item.position ? '上传中...' : '📤 上传图片'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
