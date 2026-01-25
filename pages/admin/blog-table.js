import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function BlogTable() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

  useEffect(() => {
    // 搜索和排序
    let filtered = blogs;

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredBlogs(filtered);
    setCurrentPage(1); // 重置到第一页
  }, [blogs, searchTerm, sortBy, sortOrder]);

  const fetchBlogs = async (authToken) => {
    try {
      const response = await fetch('/api/admin/blog-list', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setBlogs(result.data || []);
      }
    } catch (error) {
      console.error('获取博客列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (!confirm('确定要删除这篇博客吗？此操作不可恢复。')) {
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

  const getStatusBadge = (status) => {
    const colors = {
      published: { bg: '#10b981', text: '已发布' },
      draft: { bg: '#6b7280', text: '草稿' },
      archived: { bg: '#ef4444', text: '已归档' }
    };
    const color = colors[status] || colors.draft;
    return (
      <span style={{
        display: 'inline-block',
        padding: '4px 8px',
        backgroundColor: color.bg,
        color: 'white',
        fontSize: '12px',
        borderRadius: '4px',
        fontWeight: '500'
      }}>
        {color.text}
      </span>
    );
  };

  const getFeaturedBadge = (featured) => {
    if (!featured) return null;
    return (
      <span style={{
        display: 'inline-block',
        padding: '4px 8px',
        backgroundColor: '#f59e0b',
        color: 'white',
        fontSize: '12px',
        borderRadius: '4px',
        fontWeight: '500',
        marginLeft: '4px'
      }}>
        精选
      </span>
    );
  };

  // 分页逻辑
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        <meta name="description" content="博客列表管理" />
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
              📝 博客管理
            </h1>
            <p style={{ 
              color: '#718096',
              fontSize: '16px'
            }}>
              共 {filteredBlogs.length} 篇博客
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/admin/blog-editor">
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
                ➕ 新建博客
              </button>
            </Link>
            <Link href="/admin">
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
                🏠 返回后台
              </button>
            </Link>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div style={{ 
          background: '#ffffff',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ 
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#4a5568',
                marginBottom: '8px'
              }}>
                🔍 搜索博客
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索标题、摘要或标签..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
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
            
            <div>
              <label style={{ 
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#4a5568',
                marginBottom: '8px'
              }}>
                📊 排序字段
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              >
                <option value="created_at">创建时间</option>
                <option value="updated_at">更新时间</option>
                <option value="title">标题</option>
                <option value="status">状态</option>
              </select>
            </div>
            
            <div>
              <label style={{ 
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#4a5568',
                marginBottom: '8px'
              }}>
                ⬆️ 排序方向
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              >
                <option value="desc">降序</option>
                <option value="asc">升序</option>
              </select>
            </div>
          </div>
        </div>

        {/* 博客表格 */}
        <div style={{ 
          background: '#ffffff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
          border: '1px solid #e2e8f0'
        }}>
          {currentItems.length === 0 ? (
            <div style={{ 
              textAlign: 'center',
              padding: '60px 20px',
              color: '#718096'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                {searchTerm ? '没有找到匹配的博客' : '还没有发布任何博客'}
              </h3>
              <p style={{ fontSize: '16px' }}>
                {searchTerm ? '尝试调整搜索条件' : '开始发布您的第一篇博客吧！'}
              </p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ 
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ 
                        padding: '12px 8px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#4a5568',
                        fontSize: '13px',
                        textTransform: 'uppercase'
                      }}>
                        博客信息
                      </th>
                      <th style={{ 
                        padding: '12px 8px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#4a5568',
                        fontSize: '13px',
                        textTransform: 'uppercase'
                      }}>
                        状态
                      </th>
                      <th style={{ 
                        padding: '12px 8px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#4a5568',
                        fontSize: '13px',
                        textTransform: 'uppercase'
                      }}>
                        图片槽位
                      </th>
                      <th style={{ 
                        padding: '12px 8px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#4a5568',
                        fontSize: '13px',
                        textTransform: 'uppercase'
                      }}>
                        更新时间
                      </th>
                      <th style={{ 
                        padding: '12px 8px',
                        textAlign: 'center',
                        fontWeight: '600',
                        color: '#4a5568',
                        fontSize: '13px',
                        textTransform: 'uppercase'
                      }}>
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((blog) => (
                      <tr key={blog.id} style={{ 
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background-color 0.2s'
                      }}>
                        <td style={{ padding: '16px 8px' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            {blog.cover_image_url && (
                              <img
                                src={blog.cover_image_url}
                                alt={blog.title}
                                style={{
                                  width: '60px',
                                  height: '40px',
                                  objectFit: 'cover',
                                  borderRadius: '6px',
                                  border: '1px solid #e2e8f0'
                                }}
                              />
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ 
                                fontWeight: '600',
                                color: '#2d3748',
                                marginBottom: '4px',
                                fontSize: '15px'
                              }}>
                                {blog.title}
                              </div>
                              {blog.excerpt && (
                                <div style={{ 
                                  color: '#718096',
                                  fontSize: '13px',
                                  lineHeight: '1.4',
                                  marginBottom: '4px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {blog.excerpt}
                                </div>
                              )}
                              {blog.slug && (
                                <div style={{ 
                                  color: '#4299e1',
                                  fontSize: '12px',
                                  fontFamily: 'monospace'
                                }}>
                                  /blog/{blog.slug}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        <td style={{ padding: '16px 8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {getStatusBadge(blog.status)}
                            {getFeaturedBadge(blog.featured)}
                          </div>
                        </td>
                        
                        <td style={{ padding: '16px 8px' }}>
                          {blog.image_slots && Object.keys(blog.image_slots).length > 0 ? (
                            <div style={{ 
                              display: 'flex',
                              gap: '4px',
                              flexWrap: 'wrap'
                            }}>
                              {Object.keys(blog.image_slots).map((slot, index) => (
                                <span
                                  key={slot}
                                  style={{
                                    display: 'inline-block',
                                    padding: '2px 6px',
                                    backgroundColor: '#edf2f7',
                                    color: '#4a5568',
                                    fontSize: '11px',
                                    borderRadius: '3px',
                                    border: '1px solid #e2e8f0'
                                  }}
                                  title={slot}
                                >
                                  {slot.replace(/_/g, ' ')}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span style={{ color: '#cbd5e0', fontSize: '12px' }}>
                              无图片槽位
                            </span>
                          )}
                        </td>
                        
                        <td style={{ padding: '16px 8px' }}>
                          <div style={{ 
                            color: '#718096',
                            fontSize: '13px'
                          }}>
                            {formatDate(blog.updated_at)}
                          </div>
                        </td>
                        
                        <td style={{ padding: '16px 8px' }}>
                          <div style={{ 
                            display: 'flex',
                            gap: '8px',
                            justifyContent: 'center'
                          }}>
                            <Link href={`/admin/blog-editor?id=${blog.id}`}>
                              <button style={{
                                padding: '6px 12px',
                                background: '#4299e1',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                              }}>
                                ✏️ 编辑
                              </button>
                            </Link>
                            
                            <Link href={`/blog/${blog.slug}`} target="_blank">
                              <button style={{
                                padding: '6px 12px',
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                              }}>
                                👁️ 查看
                              </button>
                            </Link>
                            
                            <button
                              onClick={() => handleDelete(blog.id)}
                              style={{
                                padding: '6px 12px',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                              }}
                            >
                              🗑️ 删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 分页 */}
              {totalPages > 1 && (
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '20px',
                  gap: '8px'
                }}>
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      padding: '8px 12px',
                      background: currentPage === 1 ? '#e2e8f0' : '#4299e1',
                      color: currentPage === 1 ? '#a0aec0' : 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    上一页
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      style={{
                        padding: '8px 12px',
                        background: currentPage === number ? '#4299e1' : '#e2e8f0',
                        color: currentPage === number ? 'white' : '#4a5568',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '8px 12px',
                      background: currentPage === totalPages ? '#e2e8f0' : '#4299e1',
                      color: currentPage === totalPages ? '#a0aec0' : 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    下一页
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
