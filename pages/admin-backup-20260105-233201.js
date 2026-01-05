import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Admin() {
  const [images, setImages] = useState([]);
  const [plants, setPlants] = useState([]);
  const [site, setSite] = useState({ heroImage: '', logo: '' });
  const [heroSelection, setHeroSelection] = useState('');
  const [logoSelection, setLogoSelection] = useState('');
  const [selPlant, setSelPlant] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState('');
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState('add-plant');
  const [copiedPath, setCopiedPath] = useState('');
  
  // Modal states for plant editing
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    scientific_name: '',
    toxicity_level: 'Safe',
    care_difficulty: 'Easy',
    summary: '',
    image: '',
    symptoms: [],
    what_to_do: '',
    aspca_link: '',
    care_tips: '',
    water_needs: '',
    light_needs: '',
    temperature: ''
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  // New Plant Form states
  const [plantName, setPlantName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [toxicityLevel, setToxicityLevel] = useState('Safe');
  const [careDifficulty, setCareDifficulty] = useState('Easy');
  const [englishDescription, setEnglishDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Color palette matching the main site
  const sageGreen = '#87A96B';
  const sageGreenDark = '#6B8553';
  const warmCream = '#FAF7F2';
  const warmCreamDark = '#F5F1E8';
  const terracotta = '#C17A5F';
  const borderRadius = '24px';
  const borderRadiusSmall = '16px';

  useEffect(() => {
    const load = async () => {
      try {
        const [imgRes, siteRes, plantRes] = await Promise.all([
          fetch('/api/list-images'),
          fetch('/api/site-config'),
          fetch('/api/plants')
        ]);
        const imgs = await imgRes.json();
        const s = await siteRes.json();
        const p = await plantRes.json();
        setImages(imgs.paths || []);
        setSite(s || { heroImage: '' });
        setHeroSelection((s || {}).heroImage || '');
        setLogoSelection((s || {}).logo || '');
        setPlants(p.plants || []);
      } catch {}
    };
    load();
  }, []);

  const onUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result;
        const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const res = await fetch('/api/upload-base64', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename, data: String(base64 || '') })
        });
        if (res.ok) {
          const j = await res.json();
          const imgs = await (await fetch('/api/list-images')).json();
          setImages(imgs.paths || []);
          setSite((s) => ({ ...s }));
          return j?.path || '';
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
    }
  };

  const confirmUpload = async () => {
    if (!uploadFile) return;
    const p = await onUpload(uploadFile);
    setUploading(false);
    if (p) {
      setMsg('图片已上传到素材库');
      setUploadFile(null);
      setUploadPreview('');
    }
  };

  const updateHero = async (path) => {
    if (!path) return;
    await fetch('/api/site-config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ heroImage: path }) });
    const s = await (await fetch('/api/site-config')).json();
    setSite(s);
    setHeroSelection(s.heroImage || '');
    setMsg('首页大图已更新');
  };

  const updateLogo = async (path) => {
    if (!path) return;
    await fetch('/api/site-config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ logo: path }) });
    const s = await (await fetch('/api/site-config')).json();
    setSite(s);
    setLogoSelection(s.logo || '');
    setMsg('站点 Logo 已更新');
  };

  const updatePlantImage = async (slug, imagePath) => {
    await fetch('/api/update-plant-image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, imagePath }) });
    const p = await (await fetch('/api/plants')).json();
    setPlants(p.plants || []);
    setSelPlant((prev) => ({ ...prev, [slug]: imagePath }));
    setMsg('植物封面图已更新');
  };

  const copyToClipboard = async (path) => {
    try {
      await navigator.clipboard.writeText(path);
      setCopiedPath(path);
      setMsg(`已复制路径：${path}`);
      setTimeout(() => setCopiedPath(''), 2000);
    } catch (err) {
      setMsg('复制失败，请手动复制');
    }
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setUploadFile(null);
      setUploadPreview('');
    }
  };

  const openEditModal = (plant) => {
    setEditingPlant(plant);
    setEditForm({
      title: plant.title || '',
      scientific_name: plant.scientific_name || '',
      toxicity_level: plant.toxicity_level || 'Safe',
      care_difficulty: plant.care_difficulty || 'Easy',
      summary: plant.summary || '',
      image: plant.image || '',
      symptoms: plant.symptoms || [],
      what_to_do: plant.what_to_do || '',
      aspca_link: plant.aspca_link || '',
      care_tips: plant.care_tips || '',
      water_needs: plant.water_needs || '',
      light_needs: plant.light_needs || '',
      temperature: plant.temperature || ''
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingPlant(null);
    setEditForm({
      title: '',
      scientific_name: '',
      toxicity_level: 'Safe',
      care_difficulty: 'Easy',
      summary: '',
      image: '',
      symptoms: [],
      what_to_do: '',
      aspca_link: '',
      care_tips: '',
      water_needs: '',
      light_needs: '',
      temperature: ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);

    try {
      const response = await fetch('/api/update-plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: editingPlant.slug,
          ...editForm
        })
      });

      if (response.ok) {
        setMsg('植物信息更新成功！');
        closeEditModal();
        // Refresh plants list
        const p = await (await fetch('/api/plants')).json();
        setPlants(p.plants || []);
      } else {
        const data = await response.json();
        setMsg(`更新失败：${data.error || '未知错误'}`);
      }
    } catch (error) {
      setMsg(`更新失败：${error.message || '网络错误'}`);
    } finally {
      setEditSubmitting(false);
    }
  };

  const deletePlant = async (plant) => {
    if (!confirm(`确定要删除植物"${plant.title || plant.slug}"吗？此操作不可撤销。`)) {
      return;
    }

    try {
      const response = await fetch('/api/delete-plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: plant.slug })
      });

      if (response.ok) {
        setMsg(`植物"${plant.title || plant.slug}"已删除`);
        // Refresh plants list
        const p = await (await fetch('/api/plants')).json();
        setPlants(p.plants || []);
      } else {
        const data = await response.json();
        setMsg(`删除失败：${data.error || '未知错误'}`);
      }
    } catch (error) {
      setMsg(`删除失败：${error.message || '网络错误'}`);
    }
  };

  const handleNewPlantSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormMessage('');

    const slug = plantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
    if (!slug) {
      setFormMessage('错误：植物名称不能为空。');
      setFormSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/save-plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: plantName,
          scientific_name: scientificName,
          toxicity_level: toxicityLevel,
          care_difficulty: careDifficulty,
          summary: englishDescription,
          image: imageUrl || `/images/plants/${slug}.jpg`,
          slug: slug
        })
      });

      if (res.ok) {
        setFormMessage('成功：植物添加成功！');
        setPlantName('');
        setScientificName('');
        setToxicityLevel('Safe');
        setCareDifficulty('Easy');
        setEnglishDescription('');
        setImageUrl('');
        const p = await (await fetch('/api/plants')).json();
        setPlants(p.plants || []);
      } else {
        const data = await res.json();
        setFormMessage(`错误：${data.error || '添加植物失败。'}`);
      }
    } catch (error) {
      setFormMessage(`错误：${error.message || '发生意外错误。'}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>管理后台 - PawSafePlants</title>
        <meta name="description" content="管理后台用于管理PawSafePlants内容" />
      </Head>

      <div style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
        background: warmCream,
        minHeight: '100vh'
      }}>
        {/* Header */}
        <header style={{
          background: '#fff',
          borderBottom: `2px solid ${warmCreamDark}`,
          padding: '20px 0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h1 style={{
                fontSize: '32px',
                fontWeight: 700,
                color: sageGreenDark,
                margin: 0
              }}>
                管理后台
              </h1>
              <Link 
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                  background: warmCream,
                  color: sageGreenDark,
                  textDecoration: 'none',
                  borderRadius: borderRadiusSmall,
                  fontWeight: 500,
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = warmCreamDark;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = warmCream;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                ← 返回首页
              </Link>
            </div>
            
            <form onSubmit={async (e) => { 
              e.preventDefault(); 
              await fetch('/api/auth/logout', { method: 'POST' }); 
              window.location.href = '/login'; 
            }}>
              <button 
                type="submit"
                style={{
                  padding: '10px 20px',
                  background: '#E85D5D',
                  color: '#fff',
                  border: 'none',
                  borderRadius: borderRadiusSmall,
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#D44444';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#E85D5D';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                退出登录
              </button>
            </form>
          </div>
        </header>

        {/* Success Message */}
        {msg && (
          <div style={{
            maxWidth: '1200px',
            margin: '20px auto',
            padding: '0 20px'
          }}>
            <div style={{
              padding: '16px 20px',
              background: `${sageGreen}20`,
              border: `2px solid ${sageGreen}`,
              borderRadius: borderRadiusSmall,
              color: sageGreenDark,
              fontWeight: 500,
              fontSize: '14px'
            }}>
              ✅ {msg}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{
          maxWidth: '1200px',
          margin: '20px auto',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            background: '#fff',
            padding: '8px',
            borderRadius: borderRadius,
            border: `2px solid ${warmCreamDark}`
          }}>
            {[
              { id: 'add-plant', label: '添加植物', icon: '🌱' },
              { id: 'images', label: '图片管理', icon: '🖼️' },
              { id: 'plants', label: '植物管理', icon: '🌿' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: activeTab === tab.id ? sageGreen : '#fff',
                  color: activeTab === tab.id ? '#fff' : sageGreenDark,
                  border: 'none',
                  borderRadius: borderRadiusSmall,
                  fontWeight: 600,
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = `${sageGreen}10`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = '#fff';
                  }
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto 40px auto',
          padding: '0 20px'
        }}>
          {/* Add Plant Tab */}
          {activeTab === 'add-plant' && (
            <div style={{
              background: '#fff',
              borderRadius: borderRadius,
              padding: '40px',
              border: `2px solid ${warmCreamDark}`,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
            }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 700,
                color: sageGreenDark,
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                🌱 添加新植物
              </h2>
              <p style={{
                color: '#5A5A5A',
                marginBottom: '32px',
                fontSize: '16px'
              }}>
                向数据库中添加新植物，包含猫咪安全信息。
              </p>

              <form onSubmit={handleNewPlantSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: 600,
                      color: sageGreenDark,
                      marginBottom: '8px',
                      fontSize: '14px'
                    }}>
                      植物名称 *
                    </label>
                    <input
                      type="text"
                      value={plantName}
                      onChange={(e) => setPlantName(e.target.value)}
                      required
                      placeholder="例如：吊兰"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: borderRadiusSmall,
                        border: `2px solid ${warmCreamDark}`,
                        fontSize: '15px',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = sageGreen;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${sageGreen}20`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = warmCreamDark;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: 600,
                      color: sageGreenDark,
                      marginBottom: '8px',
                      fontSize: '14px'
                    }}>
                      拉丁学名
                    </label>
                    <input
                      type="text"
                      value={scientificName}
                      onChange={(e) => setScientificName(e.target.value)}
                      placeholder="例如：Chlorophytum comosum"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: borderRadiusSmall,
                        border: `2px solid ${warmCreamDark}`,
                        fontSize: '15px',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = sageGreen;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${sageGreen}20`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = warmCreamDark;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: 600,
                      color: sageGreenDark,
                      marginBottom: '8px',
                      fontSize: '14px'
                    }}>
                      安全性等级 *
                    </label>
                    <select
                      value={toxicityLevel}
                      onChange={(e) => setToxicityLevel(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: borderRadiusSmall,
                        border: `2px solid ${warmCreamDark}`,
                        fontSize: '15px',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        background: '#fff'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = sageGreen;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${sageGreen}20`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = warmCreamDark;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="Safe">✅ 安全 (Safe)</option>
                      <option value="Caution">⚠️ 注意 (Caution)</option>
                      <option value="Dangerous">❌ 有毒 (Dangerous)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: 600,
                      color: sageGreenDark,
                      marginBottom: '8px',
                      fontSize: '14px'
                    }}>
                      养育难度 *
                    </label>
                    <select
                      value={careDifficulty}
                      onChange={(e) => setCareDifficulty(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: borderRadiusSmall,
                        border: `2px solid ${warmCreamDark}`,
                        fontSize: '15px',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        background: '#fff'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = sageGreen;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${sageGreen}20`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = warmCreamDark;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="Easy">🌱 简单 (Easy)</option>
                      <option value="Moderate">🌿 中等 (Moderate)</option>
                      <option value="Difficult">🌳 困难 (Difficult)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: sageGreenDark,
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    详细描述 *
                  </label>
                  <textarea
                    value={englishDescription}
                    onChange={(e) => setEnglishDescription(e.target.value)}
                    required
                    placeholder="请提供植物的简要描述及其对猫咪的安全性..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: borderRadiusSmall,
                      border: `2px solid ${warmCreamDark}`,
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = sageGreen;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${sageGreen}20`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = warmCreamDark;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: sageGreenDark,
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    图片 URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/plant-image.jpg"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: borderRadiusSmall,
                      border: `2px solid ${warmCreamDark}`,
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = sageGreen;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${sageGreen}20`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = warmCreamDark;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {formMessage && (
                  <div style={{
                    padding: '16px 20px',
                    borderRadius: borderRadiusSmall,
                    fontSize: '14px',
                    fontWeight: 500,
                    background: formMessage.includes('成功') ? `${sageGreen}20` : '#E85D5D20',
                    border: `2px solid ${formMessage.includes('成功') ? sageGreen : '#E85D5D'}`,
                    color: formMessage.includes('成功') ? sageGreenDark : '#E85D5D'
                  }}>
                    {formMessage.includes('成功') ? '✅' : '❌'} {formMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formSubmitting}
                  style={{
                    padding: '16px 32px',
                    background: formSubmitting ? '#ccc' : sageGreen,
                    color: '#fff',
                    border: 'none',
                    borderRadius: borderRadiusSmall,
                    fontWeight: 600,
                    fontSize: '16px',
                    cursor: formSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    alignSelf: 'flex-start'
                  }}
                  onMouseEnter={(e) => {
                    if (!formSubmitting) {
                      e.currentTarget.style.background = sageGreenDark;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(135, 169, 107, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!formSubmitting) {
                      e.currentTarget.style.background = sageGreen;
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {formSubmitting ? '正在添加...' : '🌱 保存植物信息'}
                </button>
              </form>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Upload Section with Preview */}
              <div style={{
                background: '#fff',
                borderRadius: borderRadius,
                padding: '32px',
                border: `2px solid ${warmCreamDark}`,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: sageGreenDark,
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  📤 上传图片
                </h2>
                <p style={{
                  color: '#5A5A5A',
                  marginBottom: '24px',
                  fontSize: '15px'
                }}>
                  上传图片用于植物和站点内容。支持 JPG、PNG、GIF 格式。
                </p>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 200px',
                  gap: '24px',
                  alignItems: 'start'
                }}>
                  {/* Upload Area */}
                  <div>
                    <div style={{
                      border: `2px dashed ${warmCreamDark}`,
                      borderRadius: borderRadiusSmall,
                      padding: '32px',
                      textAlign: 'center',
                      background: warmCream,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    onClick={() => document.getElementById('file-input').click()}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = sageGreen;
                      e.currentTarget.style.background = `${sageGreen}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = warmCreamDark;
                      e.currentTarget.style.background = warmCream;
                    }}>
                      <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                        style={{ display: 'none' }}
                      />
                      
                      {!uploadPreview ? (
                        <div>
                          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📷</div>
                          <div style={{ fontSize: '16px', fontWeight: 600, color: sageGreenDark, marginBottom: '8px' }}>
                            点击选择图片或拖拽到此处
                          </div>
                          <div style={{ fontSize: '14px', color: '#5A5A5A' }}>
                            支持 JPG、PNG、GIF 格式，最大 10MB
                          </div>
                        </div>
                      ) : (
                        <div style={{ position: 'relative' }}>
                          <img 
                            src={uploadPreview} 
                            alt="预览" 
                            style={{ 
                              maxWidth: '100%', 
                              maxHeight: '200px', 
                              borderRadius: '8px',
                              objectFit: 'contain'
                            }} 
                          />
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'rgba(0,0,0,0.7)',
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}>
                            {uploadFile?.name}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {uploadFile && (
                      <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                        <button
                          type="button"
                          onClick={confirmUpload}
                          disabled={uploading}
                          style={{
                            padding: '12px 24px',
                            background: uploading ? '#ccc' : sageGreen,
                            color: '#fff',
                            border: 'none',
                            borderRadius: borderRadiusSmall,
                            fontWeight: 600,
                            fontSize: '15px',
                            cursor: uploading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!uploading) {
                              e.currentTarget.style.background = sageGreenDark;
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!uploading) {
                              e.currentTarget.style.background = sageGreen;
                              e.currentTarget.style.transform = 'translateY(0)';
                            }
                          }}
                        >
                          {uploading ? '上传中...' : '确认上传'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadFile(null);
                            setUploadPreview('');
                          }}
                          style={{
                            padding: '12px 24px',
                            background: '#fff',
                            color: '#5A5A5A',
                            border: `2px solid ${warmCreamDark}`,
                            borderRadius: borderRadiusSmall,
                            fontWeight: 600,
                            fontSize: '15px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = warmCreamDark;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fff';
                          }}
                        >
                          取消
                        </button>
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  {uploadFile && (
                    <div style={{
                      background: warmCream,
                      padding: '16px',
                      borderRadius: borderRadiusSmall,
                      border: `2px solid ${warmCreamDark}`
                    }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: sageGreenDark, marginBottom: '8px' }}>
                        文件信息
                      </div>
                      <div style={{ fontSize: '13px', color: '#5A5A5A', lineHeight: '1.6' }}>
                        <div>文件名：{uploadFile.name}</div>
                        <div>大小：{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</div>
                        <div>类型：{uploadFile.type}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Hero Image Section */}
              <div style={{
                background: '#fff',
                borderRadius: borderRadius,
                padding: '32px',
                border: `2px solid ${warmCreamDark}`,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: sageGreenDark,
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  🏠 首页大图
                </h2>
                <p style={{
                  color: '#5A5A5A',
                  marginBottom: '24px',
                  fontSize: '15px'
                }}>
                  当前：<code style={{ background: warmCreamDark, padding: '4px 8px', borderRadius: '6px' }}>
                    {site?.heroImage || '未设置'}
                  </code>
                </p>
                
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                  <select
                    value={heroSelection || site.heroImage || ''}
                    onChange={(e) => setHeroSelection(e.target.value)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: borderRadiusSmall,
                      border: `2px solid ${warmCreamDark}`,
                      fontSize: '15px',
                      minWidth: '300px',
                      outline: 'none'
                    }}
                  >
                    <option value="">选择图片...</option>
                    {images.map(img => (
                      <option key={img} value={img}>{img}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => updateHero(heroSelection || site.heroImage || '')}
                    disabled={!(heroSelection || site.heroImage)}
                    style={{
                      padding: '12px 24px',
                      background: (heroSelection || site.heroImage) ? sageGreen : '#ccc',
                      color: '#fff',
                      border: 'none',
                      borderRadius: borderRadiusSmall,
                      fontWeight: 600,
                      fontSize: '15px',
                      cursor: (heroSelection || site.heroImage) ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (heroSelection || site.heroImage) {
                        e.currentTarget.style.background = sageGreenDark;
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (heroSelection || site.heroImage) {
                        e.currentTarget.style.background = sageGreen;
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    应用
                  </button>
                  {(heroSelection || site.heroImage) && (
                    <img 
                      src={heroSelection || site.heroImage} 
                      alt="预览" 
                      style={{ 
                        width: '100px', 
                        height: '60px', 
                        objectFit: 'cover', 
                        borderRadius: '8px',
                        border: `2px solid ${warmCreamDark}`
                      }} 
                    />
                  )}
                </div>
              </div>

              {/* Images Grid */}
              <div style={{
                background: '#fff',
                borderRadius: borderRadius,
                padding: '32px',
                border: `2px solid ${warmCreamDark}`,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: sageGreenDark,
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  🖼️ 图片库
                </h2>
                <p style={{
                  color: '#5A5A5A',
                  marginBottom: '24px',
                  fontSize: '15px'
                }}>
                  共 {images.length} 张图片
                </p>

                {images.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#5A5A5A',
                    fontSize: '16px'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
                    暂无图片，请先上传图片
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '20px'
                  }}>
                    {images.map((imagePath) => (
                      <div key={imagePath} style={{
                        border: `2px solid ${warmCreamDark}`,
                        borderRadius: borderRadiusSmall,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        background: '#fff'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                        e.currentTarget.style.borderColor = sageGreen;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = warmCreamDark;
                      }}>
                        {/* Image Thumbnail */}
                        <div style={{
                          height: '180px',
                          overflow: 'hidden',
                          background: warmCreamDark,
                          position: 'relative'
                        }}>
                          <img
                            src={imagePath}
                            alt={imagePath}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease'
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement.innerHTML = `
                                <div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 48px; color: #87A96B;">
                                  🖼️
                                </div>
                              `;
                            }}
                          />
                        </div>
                        
                        {/* File Info and Actions */}
                        <div style={{ padding: '16px' }}>
                          <div style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: sageGreenDark,
                            marginBottom: '8px',
                            wordBreak: 'break-all',
                            lineHeight: '1.4'
                          }}>
                            {imagePath.split('/').pop()}
                          </div>
                          
                          <div style={{
                            fontSize: '11px',
                            color: '#888',
                            marginBottom: '12px',
                            fontFamily: 'monospace',
                            background: warmCreamDark,
                            padding: '4px 6px',
                            borderRadius: '4px',
                            wordBreak: 'break-all'
                          }}>
                            {imagePath}
                          </div>
                          
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(imagePath)}
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                background: copiedPath === imagePath ? sageGreen : warmCream,
                                color: copiedPath === imagePath ? '#fff' : sageGreenDark,
                                border: `2px solid ${sageGreen}`,
                                borderRadius: '6px',
                                fontWeight: 600,
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px'
                              }}
                              onMouseEnter={(e) => {
                                if (copiedPath !== imagePath) {
                                  e.currentTarget.style.background = `${sageGreen}10`;
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (copiedPath !== imagePath) {
                                  e.currentTarget.style.background = warmCream;
                                }
                              }}
                            >
                              {copiedPath === imagePath ? '✅ 已复制' : '📋 复制路径'}
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => window.open(imagePath, '_blank')}
                              style={{
                                padding: '8px 12px',
                                background: '#fff',
                                color: sageGreenDark,
                                border: `2px solid ${warmCreamDark}`,
                                borderRadius: '6px',
                                fontWeight: 600,
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = warmCreamDark;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#fff';
                              }}
                            >
                              🔍 查看
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Manage Plants Tab */}
          {activeTab === 'plants' && (
            <div style={{
              background: '#fff',
              borderRadius: borderRadius,
              padding: '32px',
              border: `2px solid ${warmCreamDark}`,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 700,
                color: sageGreenDark,
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                🌿 植物管理
              </h2>
              <p style={{
                color: '#5A5A5A',
                marginBottom: '24px',
                fontSize: '15px'
              }}>
                共 {plants.length} 个植物条目
              </p>

              {plants.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#5A5A5A',
                  fontSize: '16px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌱</div>
                  暂无植物数据，请先添加植物
                </div>
              ) : (
                <div style={{
                  overflowX: 'auto',
                  border: `2px solid ${warmCreamDark}`,
                  borderRadius: borderRadiusSmall
                }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px'
                  }}>
                    {/* Table Header */}
                    <thead>
                      <tr style={{
                        background: warmCream,
                        borderBottom: `2px solid ${warmCreamDark}`
                      }}>
                        <th style={{
                          padding: '16px',
                          textAlign: 'left',
                          fontWeight: 600,
                          color: sageGreenDark,
                          fontSize: '13px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          预览图
                        </th>
                        <th style={{
                          padding: '16px',
                          textAlign: 'left',
                          fontWeight: 600,
                          color: sageGreenDark,
                          fontSize: '13px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          名称
                        </th>
                        <th style={{
                          padding: '16px',
                          textAlign: 'left',
                          fontWeight: 600,
                          color: sageGreenDark,
                          fontSize: '13px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          拉丁名
                        </th>
                        <th style={{
                          padding: '16px',
                          textAlign: 'left',
                          fontWeight: 600,
                          color: sageGreenDark,
                          fontSize: '13px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          安全等级
                        </th>
                        <th style={{
                          padding: '16px',
                          textAlign: 'left',
                          fontWeight: 600,
                          color: sageGreenDark,
                          fontSize: '13px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          操作
                        </th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                      {plants.map((plant, index) => {
                        const getToxicityInfo = (level) => {
                          const L = String(level || '').toLowerCase();
                          if (L.includes('safe') || L.includes('安全')) return { 
                            label: '安全', 
                            color: sageGreen, 
                            bg: `${sageGreen}20`, 
                            icon: '✅' 
                          };
                          if (L.includes('danger') || L.includes('toxic') || L.includes('有毒') || L.includes('dangerous')) return { 
                            label: '有毒', 
                            color: '#E85D5D', 
                            bg: '#E85D5D20', 
                            icon: '❌' 
                          };
                          return { 
                            label: '注意', 
                            color: '#F5C842', 
                            bg: '#F5C84220', 
                            icon: '⚠️' 
                          };
                        };

                        const toxicity = getToxicityInfo(plant.toxicity_level);

                        return (
                          <tr key={plant.slug} style={{
                            borderBottom: `1px solid ${warmCreamDark}`,
                            transition: 'background 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = warmCream;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fff';
                          }}>
                            {/* Preview Image */}
                            <td style={{ padding: '16px' }}>
                              <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                background: warmCreamDark,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {plant.image ? (
                                  <img
                                    src={plant.image}
                                    alt={plant.title}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.parentElement.innerHTML = '<span style="font-size: 24px;">🌿</span>';
                                    }}
                                  />
                                ) : (
                                  <span style={{ fontSize: '24px' }}>🌿</span>
                                )}
                              </div>
                            </td>

                            {/* Name */}
                            <td style={{ padding: '16px' }}>
                              <div style={{
                                fontWeight: 600,
                                color: sageGreenDark,
                                marginBottom: '4px'
                              }}>
                                {plant.title || plant.slug}
                              </div>
                              <div style={{
                                fontSize: '12px',
                                color: '#888',
                                fontFamily: 'monospace'
                              }}>
                                {plant.slug}
                              </div>
                            </td>

                            {/* Scientific Name */}
                            <td style={{ padding: '16px' }}>
                              <div style={{
                                fontStyle: 'italic',
                                color: '#5A5A5A',
                                fontSize: '13px'
                              }}>
                                {plant.scientific_name || '-'}
                              </div>
                            </td>

                            {/* Safety Level */}
                            <td style={{ padding: '16px' }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 600,
                                background: toxicity.bg,
                                color: toxicity.color
                              }}>
                                {toxicity.icon} {toxicity.label}
                              </span>
                            </td>

                            {/* Actions */}
                            <td style={{ padding: '16px' }}>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  type="button"
                                  onClick={() => openEditModal(plant)}
                                  style={{
                                    padding: '6px 12px',
                                    background: sageGreen,
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: 600,
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = sageGreenDark;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = sageGreen;
                                  }}
                                >
                                  ✏️ 编辑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deletePlant(plant)}
                                  style={{
                                    padding: '6px 12px',
                                    background: '#fff',
                                    color: '#E85D5D',
                                    border: `2px solid #E85D5D`,
                                    borderRadius: '6px',
                                    fontWeight: 600,
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#E85D5D';
                                    e.currentTarget.style.color = '#fff';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#fff';
                                    e.currentTarget.style.color = '#E85D5D';
                                  }}
                                >
                                  🗑️ 删除
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Edit Modal */}
        {editModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeEditModal();
            }
          }}>
            <div style={{
              background: '#fff',
              borderRadius: borderRadius,
              padding: '32px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              border: `2px solid ${warmCreamDark}`,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: sageGreenDark,
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  ✏️ 编辑植物信息
                </h3>
                <button
                  type="button"
                  onClick={closeEditModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#888',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = warmCreamDark;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: 600,
                      color: sageGreenDark,
                      marginBottom: '6px',
                      fontSize: '14px'
                    }}>
                      植物名称 *
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: borderRadiusSmall,
                        border: `2px solid ${warmCreamDark}`,
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = sageGreen;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${sageGreen}20`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = warmCreamDark;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: 600,
                      color: sageGreenDark,
                      marginBottom: '6px',
                      fontSize: '14px'
                    }}>
                      拉丁学名
                    </label>
                    <input
                      type="text"
                      value={editForm.scientific_name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, scientific_name: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: borderRadiusSmall,
                        border: `2px solid ${warmCreamDark}`,
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = sageGreen;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${sageGreen}20`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = warmCreamDark;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: 600,
                      color: sageGreenDark,
                      marginBottom: '6px',
                      fontSize: '14px'
                    }}>
                      安全性等级 *
                    </label>
                    <select
                      value={editForm.toxicity_level}
                      onChange={(e) => setEditForm(prev => ({ ...prev, toxicity_level: e.target.value }))}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: borderRadiusSmall,
                        border: `2px solid ${warmCreamDark}`,
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        background: '#fff'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = sageGreen;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${sageGreen}20`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = warmCreamDark;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="Safe">✅ 安全 (Safe)</option>
                      <option value="Caution">⚠️ 注意 (Caution)</option>
                      <option value="Dangerous">❌ 有毒 (Dangerous)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontWeight: 600,
                      color: sageGreenDark,
                      marginBottom: '6px',
                      fontSize: '14px'
                    }}>
                      养育难度 *
                    </label>
                    <select
                      value={editForm.care_difficulty}
                      onChange={(e) => setEditForm(prev => ({ ...prev, care_difficulty: e.target.value }))}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: borderRadiusSmall,
                        border: `2px solid ${warmCreamDark}`,
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        background: '#fff'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = sageGreen;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${sageGreen}20`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = warmCreamDark;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="Easy">🌱 简单 (Easy)</option>
                      <option value="Moderate">🌿 中等 (Moderate)</option>
                      <option value="Difficult">🌳 困难 (Difficult)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: sageGreenDark,
                    marginBottom: '6px',
                    fontSize: '14px'
                  }}>
                    详细描述 *
                  </label>
                  <textarea
                    value={editForm.summary}
                    onChange={(e) => setEditForm(prev => ({ ...prev, summary: e.target.value }))}
                    required
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: borderRadiusSmall,
                      border: `2px solid ${warmCreamDark}`,
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = sageGreen;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${sageGreen}20`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = warmCreamDark;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: sageGreenDark,
                    marginBottom: '6px',
                    fontSize: '14px'
                  }}>
                    图片链接
                  </label>
                  <input
                    type="url"
                    value={editForm.image}
                    onChange={(e) => setEditForm(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/plant-image.jpg"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: borderRadiusSmall,
                      border: `2px solid ${warmCreamDark}`,
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = sageGreen;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${sageGreen}20`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = warmCreamDark;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: sageGreenDark,
                    marginBottom: '6px',
                    fontSize: '14px'
                  }}>
                    症状（每行一个）
                  </label>
                  <textarea
                    value={editForm.symptoms.join('\n')}
                    onChange={(e) => setEditForm(prev => ({ 
                      ...prev, 
                      symptoms: e.target.value.split('\n').filter(s => s.trim()) 
                    }))}
                    placeholder="呕吐&#10;嗜睡&#10;食欲不振"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: borderRadiusSmall,
                      border: `2px solid ${warmCreamDark}`,
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = sageGreen;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${sageGreen}20`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = warmCreamDark;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: sageGreenDark,
                    marginBottom: '6px',
                    fontSize: '14px'
                  }}>
                    应对措施
                  </label>
                  <textarea
                    value={editForm.what_to_do}
                    onChange={(e) => setEditForm(prev => ({ ...prev, what_to_do: e.target.value }))}
                    placeholder="立即联系兽医..."
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: borderRadiusSmall,
                      border: `2px solid ${warmCreamDark}`,
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = sageGreen;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${sageGreen}20`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = warmCreamDark;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: sageGreenDark,
                    marginBottom: '6px',
                    fontSize: '14px'
                  }}>
                    ASPCA 链接
                  </label>
                  <input
                    type="url"
                    value={editForm.aspca_link}
                    onChange={(e) => setEditForm(prev => ({ ...prev, aspca_link: e.target.value }))}
                    placeholder="https://www.aspca.org/..."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: borderRadiusSmall,
                      border: `2px solid ${warmCreamDark}`,
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = sageGreen;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${sageGreen}20`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = warmCreamDark;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    style={{
                      padding: '12px 24px',
                      background: '#fff',
                      color: '#5A5A5A',
                      border: `2px solid ${warmCreamDark}`,
                      borderRadius: borderRadiusSmall,
                      fontWeight: 600,
                      fontSize: '15px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = warmCreamDark;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff';
                    }}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={editSubmitting}
                    style={{
                      padding: '12px 24px',
                      background: editSubmitting ? '#ccc' : sageGreen,
                      color: '#fff',
                      border: 'none',
                      borderRadius: borderRadiusSmall,
                      fontWeight: 600,
                      fontSize: '15px',
                      cursor: editSubmitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!editSubmitting) {
                        e.currentTarget.style.background = sageGreenDark;
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!editSubmitting) {
                        e.currentTarget.style.background = sageGreen;
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {editSubmitting ? '保存中...' : '💾 保存更改'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
