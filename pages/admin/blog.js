import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function BlogAdmin() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查登录状态
    const storedToken = localStorage.getItem('admin_token');
    if (!storedToken) {
      router.push('/admin');
      return;
    }
    setToken(storedToken);
    fetchBlogs(storedToken);
  }, []);

  const fetchBlogs = async (authToken) => {
    try {
      const response = await fetch('/api/admin/blog-list', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setBlogs(result.data);
      }
    } catch (error) {
      console.error('获取博客列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert('请填写标题和内容');
      return;
    }

    setPublishing(true);

    try {
      let response;
      
      if (coverImage) {
        // 有图片，使用上传接口
        response = await fetch('/api/admin/blog-upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: title.trim(),
            content: content.trim(),
            tags: tags,
            file: coverImage
          })
        });
      } else {
        // 无图片，使用普通创建接口
        response = await fetch('/api/admin/blog-list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: title.trim(),
            content: content.trim(),
            tags: tags
          })
        });
      }

      const result = await response.json();
      
      if (result.success) {
        alert('博客发布成功！');
        // 清空表单
        setTitle('');
        setContent('');
        setTags('');
        setCoverImage('');
        // 刷新博客列表
        fetchBlogs(token);
      } else {
        alert(`发布失败: ${result.error}`);
      }
    } catch (error) {
      console.error('发布失败:', error);
      alert('发布失败，请重试');
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (!confirm('确定要删除这篇博客吗？')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog-list?id=${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        alert('博客删除成功');
        fetchBlogs(token);
      } else {
        alert(`删除失败: ${result.error}`);
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN');
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

  return (
    <>
      <Head>
        <title>博客管理 - PawSafePlants</title>
        <meta name="description" content="博客管理后台" />
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
            📝 博客管理
          </h1>
          <p style={{ 
            color: '#718096',
            fontSize: '16px'
          }}>
            发布和管理您的博客文章
          </p>
        </div>

        {/* 新建博客表单 */}
        <div style={{ 
          background: '#ffffff',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '40px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '25px'
          }}>
            ✍️ 发布新博客
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

          <div style={{ marginBottom: '20px' }}>
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
              onChange={handleImageUpload}
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
              placeholder="请输入博客内容（支持HTML格式）"
              rows={12}
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
            onClick={handlePublish}
            disabled={publishing || !title.trim() || !content.trim()}
            style={{
              padding: '14px 28px',
              background: publishing || !title.trim() || !content.trim() ? '#cbd5e0' : '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: publishing || !title.trim() || !content.trim() ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {publishing ? '发布中...' : '🚀 发布博客'}
          </button>
        </div>

        {/* 博客列表 */}
        <div style={{ 
          background: '#ffffff',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '25px'
          }}>
            📚 已发布的博客
          </h2>

          {blogs.length === 0 ? (
            <div style={{ 
              textAlign: 'center',
              padding: '40px',
              color: '#718096'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>📝</div>
              <p style={{ fontSize: '16px' }}>还没有发布任何博客</p>
              <p style={{ fontSize: '14px', marginTop: '10px' }}>开始发布您的第一篇博客吧！</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  style={{
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    background: '#fafafa'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '600',
                        color: '#2d3748',
                        marginBottom: '8px'
                      }}>
                        {blog.title}
                      </h3>
                      
                      {blog.cover_image_url && (
                        <img
                          src={blog.cover_image_url}
                          alt={blog.title}
                          style={{
                            width: '80px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            marginBottom: '10px'
                          }}
                        />
                      )}
                      
                      <p style={{ 
                        color: '#718096',
                        fontSize: '14px',
                        marginBottom: '8px'
                      }}>
                        {formatDate(blog.created_at)}
                      </p>
                      
                      {blog.tags && blog.tags.length > 0 && (
                        <div style={{ marginBottom: '10px' }}>
                          {blog.tags.map((tag, index) => (
                            <span
                              key={index}
                              style={{
                                display: 'inline-block',
                                padding: '4px 8px',
                                background: '#edf2f7',
                                color: '#4a5568',
                                fontSize: '12px',
                                borderRadius: '4px',
                                marginRight: '6px',
                                marginBottom: '4px'
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleDelete(blog.id)}
                      style={{
                        padding: '8px 12px',
                        background: '#e53e3e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
