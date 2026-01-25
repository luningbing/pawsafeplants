import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function BlogEditorTest() {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [imageSlots, setImageSlots] = useState({
    slot1: '',
    slot2: '',
    slot3: '',
    slot4: '',
    slot5: ''
  });
  const [saving, setSaving] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState(null);

  useEffect(() => {
    if (id) {
      // 模拟加载博客数据
      setTitle('💕 情人节猫咪安全花卉指南');
      setSlug('valentines-day-cat-safe-flowers-guide');
      setExcerpt('情人节猫咪安全花卉指南 - 了解哪些花卉对猫咪安全');
      setTags('情人节, 猫咪安全, 花卉指南');
      setImageSlots({
        slot1: 'https://images.unsplash.com/photo-1574158622682-e40e69881006',
        slot2: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
        slot3: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
        slot4: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e',
        slot5: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0'
      });
    }
  }, [id]);

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

  const handleSlotImageUpload = async (slotName) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          setUploadingSlot(slotName);
          // 模拟上传延迟
          setTimeout(() => {
            setImageSlots({
              ...imageSlots,
              [slotName]: reader.result
            });
            setUploadingSlot(null);
            alert(`${slotName} 图片上传成功！`);
          }, 1000);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('请填写标题和内容');
      return;
    }

    setSaving(true);
    
    // 模拟保存延迟
    setTimeout(() => {
      alert(id ? '博客更新成功！' : '博客创建成功！');
      setSaving(false);
    }, 1000);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!id && !slug) {
      setSlug(generateSlug(newTitle));
    }
  };

  return (
    <>
      <Head>
        <title>{id ? '编辑博客' : '新建博客'} - PawSafePlants</title>
        <meta name="description" content="博客编辑器测试" />
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
              {id ? '✏️ 编辑博客' : '➕ 新建博客'}
            </h1>
            <p style={{ 
              color: '#718096',
              fontSize: '16px'
            }}>
              {id ? '编辑博客文章和图片槽位' : '创建新的博客文章'}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            {id && slug && (
              <button
                onClick={() => window.location.href = `/blog/${slug}`}
                style={{
                  padding: '12px 24px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                👁️ 预览博客
              </button>
            )}
            <button
              onClick={() => window.location.href = '/admin/blog-table-test'}
              style={{
                padding: '12px 24px',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              📝 博客列表
            </button>
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
                  onChange={handleTitleChange}
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

          {/* 侧边栏 - 5个图片槽位 */}
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
                🖼️ 图片槽位 (5个)
              </h3>

              <div style={{ display: 'grid', gap: '16px' }}>
                {Object.entries(imageSlots).map(([slotName, slotUrl], index) => (
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
                        槽位 {index + 1} ({slotName})
                      </h4>
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
                            onClick={() => handleSlotImageUpload(slotName)}
                            disabled={uploadingSlot === slotName}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              background: uploadingSlot === slotName ? '#cbd5e0' : '#4299e1',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: uploadingSlot === slotName ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {uploadingSlot === slotName ? '上传中...' : '🔄 更换'}
                          </button>
                          <button
                            onClick={() => setImageSlots({...imageSlots, [slotName]: ''})}
                            style={{
                              padding: '8px 12px',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSlotImageUpload(slotName)}
                        disabled={uploadingSlot === slotName}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: uploadingSlot === slotName ? '#cbd5e0' : '#e53e3e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          cursor: uploadingSlot === slotName ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {uploadingSlot === slotName ? '上传中...' : '📤 上传图片'}
                      </button>
                    )}
                  </div>
                ))}
              </div>

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
                  💡 使用说明
                </div>
                <div style={{ 
                  fontSize: '11px',
                  color: '#0c4a6e',
                  lineHeight: '1.4'
                }}>
                  • 5个独立图片槽位<br/>
                  • 上传后自动存储到image_slots<br/>
                  • 前端可通过blog.image_slots.slot1访问<br/>
                  • 支持JPG、PNG、WebP格式
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 测试信息 */}
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px'
        }}>
          <h3 style={{ 
            fontSize: '16px',
            color: '#0369a1',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            🧪 测试页面信息
          </h3>
          <div style={{ 
            fontSize: '14px',
            color: '#0c4a6e',
            lineHeight: '1.5'
          }}>
            • 这是简化的博客编辑器测试页面<br/>
            • 不依赖登录token<br/>
            • 模拟图片上传功能<br/>
            • 测试window.location跳转功能
          </div>
        </div>
      </div>
    </>
  );
}
