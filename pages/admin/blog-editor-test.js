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
      // 加载情人节博客完整内容
      const valentinesContent = `# 💕 情人节猫咪安全花卉指南

> 爱在空气中，花朵在绽放，但我们毛茸茸的朋友安全吗？

当情人节的浪漫气息弥漫时，许多情侣会交换美丽的鲜花来表达爱意。然而，对于我们心爱的猫咪家庭成员来说，一些最受欢迎的情人节花卉可能隐藏着危险。让我们确保您的浪漫时刻不会变成兽医紧急情况。

## 🌹 传统情人节花卉及其风险

### 玫瑰 - 相对安全的选择
**毒性等级**: 🟢 一般安全 - 刺伤是主要问题

好消息！玫瑰通常对猫咪无毒。主要风险来自花茎上的刺，可能造成物理伤害。不过，如果玫瑰经过处理（如染色或喷洒保鲜剂），情况可能会有所不同。

**安全提示**:
- 去除花茎上的刺
- 确保玫瑰未经过化学处理
- 观察猫咪是否有异常行为

### 百合花 - 极度危险
**毒性等级**: 🔴 极度危险 - 所有部分都有毒

这是最需要警惕的！百合花对猫咪来说是剧毒植物。即使是少量摄入（只是喝了花瓶中的水或舔了花瓣）也可能导致急性肾衰竭。

**危险部分**:
- 花瓣
- 叶子  
- 花粉
- 花茎
- 甚至花瓶中的水

**中毒症状**:
- 2-6小时内出现呕吐
- 食欲不振
- 嗜睡
- 12-24小时内发展为急性肾衰竭

### 郁金香 - 中度风险
**毒性等级**: 🟡 中度毒性

郁金香含有毒素，主要集中在其球茎中，但花朵和叶子也可能引起问题。

**中毒症状**:
- 大量流口水
- 恶心和呕吐
- 腹泻
- 食欲不振

## 🛡️ 情人节安全花卉替代方案

### 非洲紫罗兰 - 完美安全
**毒性等级**: 🟢 完全安全

这些美丽的紫色花朵不仅对猫咪完全安全，还能为您的家增添优雅的色彩。

### 康乃馨 - 相对安全
**毒性等级**: 🟢 一般安全

康乃馨通常对猫咪无毒，但可能引起轻微的肠胃不适。

### 向日葵 - 绝对安全
**毒性等级**: 🟢 完全安全

向日葵不仅美丽，而且对猫咪完全无害，是情人节装饰的理想选择。

### 薰衣草 - 安全且芳香
**毒性等级**: 🟢 一般安全

薰衣草对猫咪相对安全，其镇静香气甚至可能帮助缓解猫咪的焦虑。

## 🎁 创造猫咪友好的情人节

### 安全庆祝方式
1. **选择安全花卉**: 优先考虑非洲紫罗兰、向日葵或康乃馨
2. **花瓶位置**: 将花瓶放在猫咪无法触及的地方
3. **人工花卉**: 考虑高质量的人工花卉，既美观又安全
4. **猫咪专属礼物**: 为您的猫咪准备特别的情人节礼物

### 紧急准备
- **兽医联系方式**: 始终准备好24小时宠物医院电话
- **中毒症状识别**: 了解常见的中毒症状
- **快速行动**: 如果怀疑中毒，立即寻求兽医帮助

## 📋 情人节花卉安全检查表

| 花卉 | 安全等级 | 主要风险 | 建议 |
|------|----------|----------|------|
| 🌹 玫瑰 | 🟢 安全 | 刺伤 | 去刺处理 |
| 🌺 百合 | 🔴 危险 | 肾衰竭 | 绝对避免 |
| 🌷 郁金香 | 🟡 中度 | 肠胃不适 | 谨慎使用 |
| 🌻 向日葵 | 🟢 安全 | 无 | 推荐选择 |
| 🌸 非洲紫罗兰 | 🟢 安全 | 无 | 理想选择 |

## 💡 爱护小贴士

### 如果您的猫咪摄入了有毒花卉
1. **不要等待**: 立即联系兽医
2. **收集证据**: 保留花卉样本供兽医识别
3. **不要催吐**: 除非兽医指示
4. **保持冷静**: 您的平静有助于猫咪保持冷静

### 预防措施
- 在购买花卉前询问是否对宠物安全
- 将所有花卉放在猫咪接触不到的地方
- 考虑为猫咪准备猫草作为安全的替代品
- 定期检查家中是否有掉落的花瓣或叶子

## 🌈 结语

情人节是表达爱的美好时刻，但这种爱应该延伸到我们所有的家庭成员，包括我们的猫咪朋友。通过选择安全的装饰和保持警惕，我们可以确保这个情人节对每个人都是快乐和安全的。

记住，真正的爱是保护我们所关心的一切。让我们用智慧和关怀来庆祝这个特殊的日子，确保我们的毛茸茸朋友能够安全地陪伴在我们身边。

---

**🚨 紧急联系信息**: 如果您的猫咪出现任何中毒症状，请立即联系您的兽医或当地24小时宠物急诊医院。

**💝 猫咪安全情人节！** 让爱绽放，让安全常在。`;

      setTitle('💕 情人节猫咪安全花卉指南');
      setSlug('valentines-day-cat-safe-flowers-guide');
      setContent(valentinesContent);
      setExcerpt('情人节猫咪安全花卉指南 - 了解哪些花卉对猫咪安全，哪些有毒，以及如何创造一个猫咪友好的情人节环境。包含玫瑰、百合、郁金香等花卉的详细安全分析。');
      setTags('情人节, 猫咪安全, 花卉指南, 宠物护理, 浪漫, 百合, 玫瑰');
      setCoverImage('https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=630&fit=crop');
      setImageSlots({
        slot1: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop&crop=faces',
        slot2: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=600&fit=crop&crop=faces',
        slot3: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=600&fit=crop&crop=faces',
        slot4: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800&h=600&fit=crop&crop=faces',
        slot5: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop&crop=faces'
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
