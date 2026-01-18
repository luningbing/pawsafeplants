import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function BlogEditNew() {
  const router = useRouter();
  const { id } = router.query;
  const [token, setToken] = useState('');
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [imageSlots, setImageSlots] = useState({});
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
        setSlug(blogData.slug || '');
        setContent(blogData.content || '');
        setExcerpt(blogData.excerpt || '');
        setTags(blogData.tags ? blogData.tags.join(', ') : '');
        setCoverImage(blogData.cover_image_url || '');
        setImageSlots(blogData.image_slots || {});
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

  const addImageSlot = () => {
    const slotName = prompt('请输入图片槽位名称 (例如: ring_bearer, flower_crown):');
    if (slotName && !imageSlots[slotName]) {
      setImageSlots({
        ...imageSlots,
        [slotName]: ''
      });
    }
  };

  const removeImageSlot = (slotName) => {
    if (confirm(`确定要删除图片槽位 "${slotName}" 吗？`)) {
      const newSlots = { ...imageSlots };
      delete newSlots[slotName];
      setImageSlots(newSlots);
    }
  };

  const uploadImageSlot = async (slotName) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          await uploadImageToSlot(slotName, reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const uploadImageToSlot = async (slotName, imageData) => {
    setUploadingImage(slotName);

    try {
      // 上传到blog-images桶
      const response = await fetch('/api/admin/blog-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title || 'Untitled',
          content: content || '',
          tags: tags,
          file: imageData,
          slotName: slotName
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const imageUrl = result.data.image_url;
        setImageSlots({
          ...imageSlots,
          [slotName]: imageUrl
        });
        alert(`${slotName} 图片上传成功！`);
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
          slug: slug.trim(),
          content: content.trim(),
          excerpt: excerpt.trim(),
          tags: tags,
          cover_image_url: coverImage,
          image_slots: imageSlots
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

  return (
    <>
      <Head>
        <title>编辑博客 - PawSafePlants</title>
        <meta name="description" content="编辑博客文章" />
      </Head>

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        {/* 头部 */}
        <div style={{ 
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '8px'
            }}>
              ✏️ 编辑博客
            </h1>
            <p style={{ 
              color: '#718096',
              fontSize: '16px'
            }}>
              编辑博客文章和动态图片槽位
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href={`/blog/${slug}`} target="_blank">
              <button style={{
                padding: '12px 24px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}>
                👁️ 预览博客
              </button>
            </Link>
            <Link href="/admin/blog-list-new">
              <button style={{
                padding: '12px 24px',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}>
                📝 博客列表
              </button>
            </Link>
          </div>
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
                  URL Slug *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="url-friendly-slug"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'monospace',
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
                <div style={{ 
                  fontSize: '12px',
                  color: '#718096',
                  marginTop: '4px'
                }}>
                  访问地址: /blog/{slug || 'url-slug'}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#4a5568',
                  marginBottom: '8px'
                }}>
                  内容摘要
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="简短的内容摘要，用于列表显示"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    lineHeight: '1.5',
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
                disabled={saving || !title.trim() || !content.trim() || !slug.trim()}
                style={{
                  padding: '14px 28px',
                  background: saving || !title.trim() || !content.trim() || !slug.trim() ? '#cbd5e0' : '#4299e1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: saving || !title.trim() || !content.trim() || !slug.trim() ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                {saving ? '保存中...' : '💾 保存博客'}
              </button>
            </div>
          </div>

          {/* 侧边栏 - 动态图片槽位管理 */}
          <div>
            <div style={{ 
              background: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '600',
                  color: '#2d3748'
                }}>
                  🖼️ 动态图片槽位
                </h3>
                <button
                  onClick={addImageSlot}
                  style={{
                    padding: '8px 12px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  ➕ 添加槽位
                </button>
              </div>

              {Object.keys(imageSlots).length === 0 ? (
                <div style={{ 
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#718096'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>🖼️</div>
                  <p style={{ fontSize: '14px', marginBottom: '8px' }}>
                    还没有图片槽位
                  </p>
                  <p style={{ fontSize: '12px' }}>
                    点击"添加槽位"开始管理图片
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {Object.entries(imageSlots).map(([slotName, slotUrl]) => (
                    <div key={slotName} style={{ 
                      padding: '16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      background: '#fafafa'
                    }}>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px'
                      }}>
                        <h4 style={{ 
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#2d3748',
                          margin: 0
                        }}>
                          {slotName}
                        </h4>
                        <button
                          onClick={() => removeImageSlot(slotName)}
                          style={{
                            padding: '4px 8px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '10px',
                            cursor: 'pointer'
                          }}
                        >
                          删除
                        </button>
                      </div>

                      {slotUrl ? (
                        <div>
                          <img
                            src={slotUrl}
                            alt={slotName}
                            style={{
                              width: '100%',
                              height: '120px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              marginBottom: '8px'
                            }}
                          />
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => uploadImageSlot(slotName)}
                              disabled={uploadingImage === slotName}
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                background: uploadingImage === slotName ? '#cbd5e0' : '#4299e1',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: uploadingImage === slotName ? 'not-allowed' : 'pointer'
                              }}
                            >
                              {uploadingImage === slotName ? '上传中...' : '🔄 更换'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => uploadImageSlot(slotName)}
                          disabled={uploadingImage === slotName}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: uploadingImage === slotName ? '#cbd5e0' : '#e53e3e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            cursor: uploadingImage === slotName ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {uploadingImage === slotName ? '上传中...' : '📤 上传图片'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ 
                marginTop: '20px',
                padding: '12px',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '6px'
              }}>
                <div style={{ 
                  fontSize: '12px',
                  color: '#0369a1',
                  fontWeight: '500',
                  marginBottom: '4px'
                }}>
                  💡 使用提示
                </div>
                <div style={{ 
                  fontSize: '11px',
                  color: '#0c4a6e',
                  lineHeight: '1.4'
                }}>
                  • 槽位名称将作为key存储在image_slots中<br/>
                  • 前端可通过 blog.image_slots.slot_name 访问<br/>
                  • 支持任意数量的动态图片槽位
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
