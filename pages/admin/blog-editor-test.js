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
      // 加载情人节博客完整内容 (英文版)
      const valentinesContent = `# 💕 Valentine's Day Cat-Safe Flowers Guide

> Love is in the air, flowers are blooming, but are our furry friends safe?

When Valentine's Day romance fills the air, many couples exchange beautiful flowers to express their love. However, for our beloved feline family members, some of the most popular Valentine's flowers may hide dangers. Let's ensure your romantic moment doesn't turn into a veterinary emergency.

## 🌹 Traditional Valentine's Flowers and Their Risks

### Roses - Relatively Safe Choice
**Toxicity Level**: 🟢 Generally Safe - Thorns are the main concern

Good news! Roses are generally non-toxic to cats. The main risk comes from thorns on the stem, which can cause physical injury. However, if roses have been treated (such as dyed or sprayed with preservatives), the situation might be different.

**Safety Tips**:
- Remove thorns from stems
- Ensure roses are not chemically treated
- Watch for any unusual behavior in your cat

### Lilies - Extremely Dangerous
**Toxicity Level**: 🔴 Extremely Dangerous - All parts are toxic

This is the most important warning! Lilies are highly toxic to cats. Even small amounts (just drinking from the vase water or licking petals) can cause acute kidney failure.

**Toxic Parts**:
- Petals
- Leaves  
- Pollen
- Stems
- Even the vase water

**Poisoning Symptoms**:
- Vomiting within 2-6 hours
- Loss of appetite
- Lethargy
- Acute kidney failure within 12-24 hours

### Tulips - Moderate Risk
**Toxicity Level**: 🟡 Moderately Toxic

Tulips contain toxins, primarily concentrated in their bulbs, but flowers and leaves can also cause problems.

**Poisoning Symptoms**:
- Excessive drooling
- Nausea and vomiting
- Diarrhea
- Loss of appetite

## 🛡️ Safe Valentine's Flower Alternatives

### African Violets - Perfectly Safe
**Toxicity Level**: 🟢 Completely Safe

These beautiful purple flowers are not only completely safe for cats but can also add elegant color to your home.

### Carnations - Relatively Safe
**Toxicity Level**: 🟢 Generally Safe

Carnations are generally non-toxic to cats but may cause mild gastrointestinal upset.

### Sunflowers - Absolutely Safe
**Toxicity Level**: 🟢 Completely Safe

Sunflowers are not only beautiful but completely harmless to cats, making them an ideal choice for Valentine's decorations.

### Lavender - Safe and Aromatic
**Toxicity Level**: 🟢 Generally Safe

Lavender is relatively safe for cats, and its calming scent may even help relieve cat anxiety.

## 🎁 Creating Cat-Friendly Valentine's

### Safe Celebration Ways
1. **Choose Safe Flowers**: Prioritize African violets, sunflowers, or carnations
2. **Vase Placement**: Place vases where cats cannot reach them
3. **Artificial Flowers**: Consider high-quality artificial flowers - beautiful and safe
4. **Cat-Specific Gifts**: Prepare special Valentine's gifts for your cat

### Emergency Preparedness
- **Veterinary Contact**: Always have 24-hour pet hospital contact information ready
- **Poisoning Symptom Recognition**: Know common poisoning symptoms
- **Quick Action**: If poisoning is suspected, seek veterinary help immediately

## 📋 Valentine's Flower Safety Checklist

| Flower | Safety Level | Main Risk | Recommendation |
|--------|-------------|-----------|----------------|
| 🌹 Rose | 🟢 Safe | Thorn injury | Remove thorns |
| 🌺 Lily | 🔴 Dangerous | Kidney failure | Absolutely avoid |
| 🌷 Tulip | 🟡 Moderate | GI upset | Use with caution |
| 🌻 Sunflower | 🟢 Safe | None | Recommended |
| 🌸 African Violet | 🟢 Safe | None | Ideal choice |

## 💡 Care Tips

### If Your Cat Ingests Toxic Flowers
1. **Don't Wait**: Contact your veterinarian immediately
2. **Collect Evidence**: Keep flower samples for veterinarian identification
3. **Don't Induce Vomiting**: Unless instructed by veterinarian
4. **Stay Calm**: Your calm helps your cat stay calm

### Preventive Measures
- Ask if flowers are pet-safe before purchasing
- Keep all flowers where cats cannot reach them
- Consider cat grass as a safe alternative
- Regularly check for fallen petals or leaves

## 🌈 Conclusion

Valentine's Day is a beautiful moment to express love, but this love should extend to all our family members, including our feline friends. By choosing safe decorations and staying vigilant, we can ensure this Valentine's Day is happy and safe for everyone.

Remember, true love is protecting everything we care about. Let's celebrate this special day with wisdom and care, ensuring our furry friends can safely accompany us.

---

**🚨 Emergency Contact Information**: If your cat shows any poisoning symptoms, contact your veterinarian or local 24-hour pet emergency hospital immediately.

**💝 Cat-Safe Valentine's Day!** Let love bloom, let safety prevail.`;

      setTitle('💕 Valentine\'s Day Cat-Safe Flowers Guide');
      setSlug('valentines-day-cat-safe-flowers-guide');
      setContent(valentinesContent);
      setExcerpt('Valentine\'s Day Cat-Safe Flowers Guide - Learn which flowers are safe for cats, which are toxic, and how to create a cat-friendly Valentine\'s environment. Includes detailed safety analysis of roses, lilies, tulips and more.');
      setTags('Valentine\'s Day, Cat Safety, Flower Guide, Pet Care, Romance, Lilies, Roses');
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
