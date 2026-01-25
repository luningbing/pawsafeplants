import { useState } from 'react';
import Head from 'next/head';

export default function BlogTableTest() {
  const [blogs] = useState([
    {
      id: 1,
      title: '💕 情人节猫咪安全花卉指南',
      slug: 'valentines-day-cat-safe-flowers-guide',
      excerpt: '情人节猫咪安全花卉指南 - 了解哪些花卉对猫咪安全',
      status: 'published',
      featured: true,
      image_slots: {
        slot1: 'https://images.unsplash.com/photo-1574158622682-e40e69881006',
        slot2: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba'
      },
      created_at: '2026-01-25T13:00:00Z',
      updated_at: '2026-01-25T13:00:00Z'
    }
  ]);

  return (
    <>
      <Head>
        <title>博客列表测试 - PawSafePlants</title>
        <meta name="description" content="博客列表测试页面" />
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
              📊 博客列表测试
            </h1>
            <p style={{ 
              color: '#718096',
              fontSize: '16px'
            }}>
              工业级博客列表页面测试
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => window.location.href = '/admin/blog-editor'}
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
              ➕ 新建博客
            </button>
            <button 
              onClick={() => window.location.href = '/admin'}
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
              🏠 返回后台
            </button>
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
                {blogs.map((blog) => (
                  <tr key={blog.id} style={{ 
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background-color 0.2s'
                  }}>
                    <td style={{ padding: '16px 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ 
                            fontWeight: '600',
                            color: '#2d3748',
                            marginBottom: '4px',
                            fontSize: '15px'
                          }}>
                            {blog.title}
                          </div>
                          <div style={{ 
                            color: '#718096',
                            fontSize: '13px',
                            lineHeight: '1.4',
                            marginBottom: '4px'
                          }}>
                            {blog.excerpt}
                          </div>
                          <div style={{ 
                            color: '#4299e1',
                            fontSize: '12px',
                            fontFamily: 'monospace'
                          }}>
                            /blog/{blog.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td style={{ padding: '16px 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          backgroundColor: '#10b981',
                          color: 'white',
                          fontSize: '12px',
                          borderRadius: '4px',
                          fontWeight: '500'
                        }}>
                          已发布
                        </span>
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
                      </div>
                    </td>
                    
                    <td style={{ padding: '16px 8px' }}>
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
                    </td>
                    
                    <td style={{ padding: '16px 8px' }}>
                      <div style={{ 
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'center'
                      }}>
                        <button
                          onClick={() => window.location.href = `/admin/blog-editor?id=${blog.id}`}
                          style={{
                            padding: '6px 12px',
                            background: '#4299e1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                        >
                          ✏️ 编辑
                        </button>
                        
                        <button
                          onClick={() => window.location.href = `/blog/${blog.slug}`}
                          style={{
                            padding: '6px 12px',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                        >
                          👁️ 查看
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            • 这是简化的博客列表测试页面<br/>
            • 不依赖登录token<br/>
            • 使用静态数据展示<br/>
            • 测试window.location跳转功能
          </div>
        </div>
      </div>
    </>
  );
}
