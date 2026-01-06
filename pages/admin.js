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
  const [activeTab, setActiveTab] = useState('hero-carousel');
  const [copiedPath, setCopiedPath] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Hero Carousel states
  const [heroSlides, setHeroSlides] = useState([
    { imageUrl: '', title: '', subtitle: '', link: '' },
    { imageUrl: '', title: '', subtitle: '', link: '' },
    { imageUrl: '', title: '', subtitle: '', link: '' }
  ]);
  const [heroUploading, setHeroUploading] = useState([false, false, false]);
  const [heroPreviews, setHeroPreviews] = useState(['', '', '']);
  const [heroMediaOpen, setHeroMediaOpen] = useState([false, false, false]);
  
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
    temperature: '',
    pet_moment: ''
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
  
  // Image handling states
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const [selectedMediaImage, setSelectedMediaImage] = useState('');
  
  // Edit modal image states
  const [editSelectedImageFile, setEditSelectedImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const [editImageUploading, setEditImageUploading] = useState(false);
  const [editMediaLibraryOpen, setEditMediaLibraryOpen] = useState(false);
  const [editSelectedMediaImage, setEditSelectedMediaImage] = useState('');
  
  // Pet images states
  const [petImages, setPetImages] = useState([]);
  const [petLibraryOpen, setPetLibraryOpen] = useState(false);

  // Mobile responsive hook
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        const [imgRes, siteRes, plantRes, heroRes] = await Promise.all([
          fetch('/api/list-images'),
          fetch('/api/site-config'),
          fetch('/api/plants'),
          fetch('/api/hero-carousel')
        ]);
        const imgs = await imgRes.json();
        const s = await siteRes.json();
        const p = await plantRes.json();
        const hero = await heroRes.json();
        setImages(imgs.paths || []);
        setSite(s || { heroImage: '' });
        setHeroSelection((s || {}).heroImage || '');
        setLogoSelection((s || {}).logo || '');
        setPlants(p.plants || []);
        
        // Load hero carousel data
        if (hero.slides && hero.slides.length > 0) {
          setHeroSlides(hero.slides);
          setHeroPreviews(hero.slides.map(slide => slide.imageUrl || ''));
        }
      } catch {}
    };
    load();
  }, []);

  const onUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      // Check file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file && file.size > maxSize) {
        setMsg('文件大小不能超过50MB，请选择较小的图片');
        setTimeout(() => setMsg(''), 3000);
        // Clear the file input
        const fileInput = document.getElementById('file-upload');
        if (fileInput) fileInput.value = '';
        setUploadFile(null);
        setUploadPreview('');
        return;
      }
      
      // Use FormData for chunked upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name.replace(/[^a-zA-Z0-9._-]/g, '_'));
      
      const res = await fetch('/api/upload-chunked', {
        method: 'POST',
        body: formData,
      });
      
      console.log('Upload response status:', res.status);
      
      if (res.ok) {
        const j = await res.json();
        console.log('Upload response:', j);
        
        const imgs = await (await fetch('/api/list-images')).json();
        setImages(imgs.paths || []);
        setUploadFile(null);
        setUploadPreview('');
        setMsg('图片上传成功！');
        setTimeout(() => setMsg(''), 3000);
        return j?.path || '';
      } else {
        const errorText = await res.text();
        console.error('Upload failed:', res.status, errorText);
        setMsg('上传失败: ' + errorText);
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMsg('上传失败: ' + error.message);
      setTimeout(() => setMsg(''), 3000);
    } finally {
      setUploading(false);
    }
  };
  
  // Generate filename from plant name
  const generatePlantFilename = (plantName, originalFile) => {
    if (!plantName) return originalFile.name;
    const extension = originalFile.name.split('.').pop();
    const normalized = plantName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
    return `${normalized}.${extension}`;
  };
  
  // Handle plant image upload with auto-naming
  const handlePlantImageUpload = async (file, isEdit = false) => {
    if (!file) return;
    
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setMsg('文件大小不能超过10MB，请选择较小的图片');
      setTimeout(() => setMsg(''), 3000);
      return;
    }
    
    const filename = generatePlantFilename(isEdit ? editForm.title : plantName, file);
    const uploadPath = filename; // 直接上传到uploads根目录
    
    if (isEdit) {
      setEditImageUploading(true);
    } else {
      setImageUploading(true);
    }
    
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result;
        const res = await fetch('/api/upload-base64', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            filename: uploadPath, 
            data: String(base64 || '') 
          })
        });
        
        if (res.ok) {
          const j = await res.json();
          const imagePath = j?.path || '';
          
          if (isEdit) {
            setEditForm({ ...editForm, image: imagePath });
            setEditImageUploading(false);
          } else {
            setImageUrl(imagePath);
            setImageUploading(false);
          }
          
          // Refresh images list
          const imgs = await (await fetch('/api/list-images')).json();
          setImages(imgs.paths || []);
        } else {
          if (isEdit) {
            setEditImageUploading(false);
          } else {
            setImageUploading(false);
          }
        }
      };
      reader.readAsDataURL(file);
    } catch {
      if (isEdit) {
        setEditImageUploading(false);
      } else {
        setImageUploading(false);
      }
    }
  };
  
  // Handle image file selection
  const handleImageFileSelect = (file, isEdit = false) => {
    if (isEdit) {
      setEditSelectedImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setEditImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  
  // Handle media library selection
  const handleMediaLibrarySelect = (imagePath, isEdit = false) => {
    if (isEdit) {
      setEditSelectedMediaImage(imagePath);
      setEditForm({ ...editForm, image: imagePath });
      setEditImagePreview(imagePath); // 同时更新预览
      setEditMediaLibraryOpen(false);
    } else {
      setSelectedMediaImage(imagePath);
      setImageUrl(imagePath);
      setImagePreview(imagePath); // 同时更新预览
      setMediaLibraryOpen(false);
    }
  };
  
  // Handle pet image selection
  const handlePetImageSelect = (imagePath) => {
    setEditForm({ ...editForm, pet_moment: imagePath });
    setPetLibraryOpen(false);
  };

  // Hero Carousel handlers
  const handleHeroImageUpload = async (file, index) => {
    if (!file) return;
    
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setMsg('文件大小不能超过10MB，请选择较小的图片');
      setTimeout(() => setMsg(''), 3000);
      return;
    }
    
    const newHeroUploading = [...heroUploading];
    newHeroUploading[index] = true;
    setHeroUploading(newHeroUploading);
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result.split(',')[1];
        const filename = `hero-${index + 1}-${Date.now()}.jpg`;
        
        const res = await fetch('/api/upload-base64', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename, base64 })
        });
        
        if (res.ok) {
          const imageUrl = `/uploads/${filename}`;
          const newHeroSlides = [...heroSlides];
          newHeroSlides[index].imageUrl = imageUrl;
          setHeroSlides(newHeroSlides);
          
          const newHeroPreviews = [...heroPreviews];
          newHeroPreviews[index] = imageUrl;
          setHeroPreviews(newHeroPreviews);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Hero image upload error:', error);
    } finally {
      const newHeroUploading = [...heroUploading];
      newHeroUploading[index] = false;
      setHeroUploading(newHeroUploading);
    }
  };

  const handleHeroMediaSelect = (imagePath, index) => {
    console.log('Hero media select:', { imagePath, index });
    const newHeroSlides = [...heroSlides];
    newHeroSlides[index].imageUrl = imagePath;
    setHeroSlides(newHeroSlides);
    console.log('Updated hero slides:', newHeroSlides);
    
    const newHeroPreviews = [...heroPreviews];
    newHeroPreviews[index] = imagePath;
    setHeroPreviews(newHeroPreviews);
    console.log('Updated hero previews:', newHeroPreviews);
    
    const newHeroMediaOpen = [...heroMediaOpen];
    newHeroMediaOpen[index] = false;
    setHeroMediaOpen(newHeroMediaOpen);
  };

  const handleHeroLinkChange = (link, index) => {
    const newHeroSlides = [...heroSlides];
    newHeroSlides[index].link = link;
    setHeroSlides(newHeroSlides);
  };

  const handleHeroTitleChange = (title, index) => {
    const newHeroSlides = [...heroSlides];
    newHeroSlides[index].title = title;
    setHeroSlides(newHeroSlides);
  };

  const handleHeroSubtitleChange = (subtitle, index) => {
    const newHeroSlides = [...heroSlides];
    newHeroSlides[index].subtitle = subtitle;
    setHeroSlides(newHeroSlides);
  };

  const saveHeroCarousel = async () => {
    try {
      console.log('Saving hero carousel:', heroSlides);
      const res = await fetch('/api/hero-carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides: heroSlides })
      });
      
      console.log('Save response status:', res.status);
      
      if (res.ok) {
        const result = await res.json();
        console.log('Save response:', result);
        setMsg('首页轮播图保存成功！');
        setTimeout(() => setMsg(''), 3000);
      } else {
        const errorText = await res.text();
        console.error('Save failed:', res.status, errorText);
        setMsg('保存失败: ' + errorText);
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (error) {
      console.error('Save hero carousel error:', error);
      setMsg('保存失败: ' + error.message);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPath(text);
      setTimeout(() => setCopiedPath(''), 2000);
    } catch {
      setMsg('复制失败');
    }
  };

  const handleEditPlant = (plant) => {
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
      temperature: plant.temperature || '',
      pet_moment: plant.pet_moment || ''
    });
    // Set image preview if exists
    if (plant.image) {
      setEditImagePreview(plant.image);
    } else {
      setEditImagePreview('');
    }
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    try {
      const res = await fetch('/api/update-plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: editingPlant.slug,
          ...editForm
        })
      });
      if (res.ok) {
        const updatedPlants = await (await fetch('/api/plants')).json();
        setPlants(updatedPlants.plants || []);
        setEditModalOpen(false);
        setMsg('植物信息更新成功！');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch {
      setMsg('更新失败');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeletePlant = async (slug) => {
    if (!confirm('确定要删除这个植物吗？')) return;
    try {
      const res = await fetch('/api/delete-plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug })
      });
      if (res.ok) {
        const updatedPlants = await (await fetch('/api/plants')).json();
        setPlants(updatedPlants.plants || []);
        setMsg('植物删除成功！');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch {
      setMsg('删除失败');
    }
  };

  const handleAddPlant = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
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
          image: imageUrl
        })
      });
      if (res.ok) {
        const updatedPlants = await (await fetch('/api/plants')).json();
        setPlants(updatedPlants.plants || []);
        setPlantName('');
        setScientificName('');
        setToxicityLevel('Safe');
        setCareDifficulty('Easy');
        setEnglishDescription('');
        setImageUrl('');
        setFormMessage('植物添加成功！');
        setTimeout(() => setFormMessage(''), 3000);
      }
    } catch {
      setFormMessage('添加失败');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Filter plants based on search term
  const filteredPlants = plants.filter(plant =>
    plant.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plant.scientific_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sidebar menu items
  const menuItems = [
    { id: 'hero-carousel', label: '首页轮播图', icon: '🎠' },
    { id: 'add-plant', label: '添加植物', icon: '🌱' },
    { id: 'plant-list', label: '植物列表', icon: '📋' },
    { id: 'media-library', label: '媒体库', icon: '🖼️' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: warmCream, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Head>
        <title>管理后台 - PawSafePlants</title>
        <meta name="description" content="植物安全管理系统" />
      </Head>

      {/* Header */}
      <div style={{
        backgroundColor: sageGreen,
        color: 'white',
        padding: '1.5rem 2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
          🌿 PawSafePlants 管理后台
        </h1>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
          返回首页
        </Link>
      </div>

      <div style={{ 
        display: isMobile ? 'block' : 'flex', 
        minHeight: 'calc(100vh - 80px)' 
      }}>
        {/* Sidebar */}
        <div style={{
          width: isMobile ? '100%' : '260px',
          backgroundColor: 'white',
          boxShadow: isMobile ? 'none' : '4px 0 12px rgba(0,0,0,0.08)',
          padding: isMobile ? '1rem' : '2rem 0',
          borderBottom: isMobile ? `1px solid ${warmCreamDark}` : 'none'
        }}>
          <nav style={{ padding: '0 1rem' }}>
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  border: 'none',
                  borderRadius: borderRadiusSmall,
                  backgroundColor: activeTab === item.id ? sageGreen : 'transparent',
                  color: activeTab === item.id ? 'white' : '#333',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  boxShadow: activeTab === item.id ? '0 4px 12px rgba(135, 169, 107, 0.3)' : 'none'
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ 
          flex: 1, 
          padding: isMobile ? '1rem' : '2rem', 
          overflowY: 'auto',
          width: isMobile ? '100%' : 'auto'
        }}>
          {/* Success/Error Messages */}
          {msg && (
            <div style={{
              padding: '1rem',
              marginBottom: '1.5rem',
              borderRadius: borderRadiusSmall,
              backgroundColor: sageGreen,
              color: 'white',
              boxShadow: '0 4px 12px rgba(135, 169, 107, 0.3)',
              animation: 'slideIn 0.3s ease'
            }}>
              {msg}
            </div>
          )}

          {/* Hero Carousel Tab */}
          {activeTab === 'hero-carousel' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: borderRadius,
              padding: '2rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              minHeight: '600px'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: sageGreenDark,
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🎠 首页轮播图管理
              </h2>

              <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: isMobile ? '1rem' : '2rem', 
        alignItems: 'start' 
      }}>
                {heroSlides.map((slide, index) => (
                  <div key={slide.id} style={{
                    border: `2px solid ${warmCreamDark}`,
                    borderRadius: borderRadiusSmall,
                    padding: '1.5rem',
                    backgroundColor: warmCream
                  }}>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: sageGreenDark,
                      marginBottom: '1rem'
                    }}>
                      轮播图 {index + 1}
                    </h3>

                    {/* Image Preview */}
                    <div style={{
                      width: '100%',
                      height: isMobile ? '150px' : '200px',
                      borderRadius: borderRadiusSmall,
                      border: `2px dashed ${sageGreen}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem',
                      overflow: 'hidden',
                      backgroundColor: '#fff'
                    }}>
                      {heroPreviews[index] ? (
                        <img
                          src={heroPreviews[index]}
                          alt={`轮播图 ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <div style={{
                          textAlign: 'center',
                          color: '#666'
                        }}>
                          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🖼️</div>
                          <p>暂无图片</p>
                        </div>
                      )}
                    </div>

                    {/* Upload Button */}
                    <div style={{ marginBottom: '1rem' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) handleHeroImageUpload(file, index);
                        }}
                        style={{ display: 'none' }}
                        id={`hero-upload-${index}`}
                      />
                      <label
                        htmlFor={`hero-upload-${index}`}
                        style={{
                          display: isMobile ? 'block' : 'inline-block',
                          width: isMobile ? '100%' : 'auto',
                          padding: isMobile ? '1rem' : '0.75rem 1rem',
                          backgroundColor: heroUploading[index] ? '#ccc' : sageGreen,
                          color: 'white',
                          borderRadius: borderRadiusSmall,
                          cursor: heroUploading[index] ? 'not-allowed' : 'pointer',
                          fontSize: isMobile ? '1rem' : '0.9rem',
                          textAlign: 'center',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {heroUploading[index] ? '上传中...' : '📁 选择图片 (最大50MB)'}
                      </label>
                    </div>

                    {/* Media Library Button */}
                    <div style={{ marginBottom: '1rem' }}>
                      <button
                        onClick={() => {
                          const newHeroMediaOpen = [...heroMediaOpen];
                          newHeroMediaOpen[index] = true;
                          setHeroMediaOpen(newHeroMediaOpen);
                        }}
                        style={{
                          display: isMobile ? 'block' : 'inline-block',
                          width: isMobile ? '100%' : 'auto',
                          padding: isMobile ? '1rem' : '0.75rem 1rem',
                          backgroundColor: warmCream,
                          color: sageGreenDark,
                          border: `2px solid ${sageGreen}`,
                          borderRadius: borderRadiusSmall,
                          cursor: 'pointer',
                          fontSize: isMobile ? '1rem' : '0.9rem',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        🖼️ 从媒体库选择
                      </button>
                    </div>

                    {/* Link Input */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500',
                        color: '#333',
                        fontSize: '0.9rem'
                      }}>
                        跳转链接（可选）
                      </label>
                      <input
                        type="text"
                        value={slide.link}
                        onChange={(e) => handleHeroLinkChange(e.target.value, index)}
                        placeholder="例如：/plants/spider-plant"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `2px solid ${warmCreamDark}`,
                          borderRadius: borderRadiusSmall,
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>

                    {/* Title Input */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500',
                        color: '#333',
                        fontSize: '0.9rem'
                      }}>
                        标题
                      </label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => handleHeroTitleChange(e.target.value, index)}
                        placeholder="例如：Cat-Safe Plants"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `2px solid ${warmCreamDark}`,
                          borderRadius: borderRadiusSmall,
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>

                    {/* Subtitle Input */}
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '500',
                        color: '#333',
                        fontSize: '0.9rem'
                      }}>
                        副标题
                      </label>
                      <input
                        type="text"
                        value={slide.subtitle}
                        onChange={(e) => handleHeroSubtitleChange(e.target.value, index)}
                        placeholder="例如：Create a beautiful, pet-friendly living space"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `2px solid ${warmCreamDark}`,
                          borderRadius: borderRadiusSmall,
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <div style={{
                marginTop: '2rem',
                textAlign: 'center'
              }}>
                <button
                  onClick={saveHeroCarousel}
                  style={{
                    display: isMobile ? 'block' : 'inline-block',
                    width: isMobile ? '100%' : 'auto',
                    padding: isMobile ? '1.2rem 2rem' : '1rem 2rem',
                    backgroundColor: sageGreen,
                    color: 'white',
                    border: 'none',
                    borderRadius: borderRadiusSmall,
                    fontSize: isMobile ? '1.1rem' : '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(135, 169, 107, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = sageGreenDark;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = sageGreen;
                  }}
                >
                  💾 保存轮播图设置
                </button>
              </div>

              {/* Hero Media Library Modals */}
              {heroMediaOpen.map((isOpen, index) =>
                isOpen && (
                  <div
                    key={`hero-modal-${index}`}
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 1000
                    }}
                    onClick={() => {
                      const newHeroMediaOpen = [...heroMediaOpen];
                      newHeroMediaOpen[index] = false;
                      setHeroMediaOpen(newHeroMediaOpen);
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: 'white',
                        borderRadius: borderRadius,
                        padding: isMobile ? '1rem' : '2rem',
                        width: isMobile ? '95%' : '90%',
                        maxWidth: isMobile ? 'none' : '900px',
                        maxHeight: isMobile ? '95vh' : '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.2)'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 style={{
                        color: sageGreen,
                        marginBottom: '1.5rem',
                        fontSize: '1.5rem',
                        fontWeight: '600'
                      }}>
                        📁 选择轮播图 {index + 1}
                      </h3>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(100px, 1fr))' : 'repeat(auto-fill, minmax(150px, 1fr))',
                        gap: isMobile ? '0.5rem' : '1rem',
                        marginBottom: '2rem'
                      }}>
                        {images.filter(img => {
                          console.log('Filtering hero image:', img);
                          return img && (img.includes('/uploads/') || img.includes('/storage/'));
                        }).map((img, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleHeroMediaSelect(img, index)}
                            style={{
                              cursor: 'pointer',
                              borderRadius: borderRadiusSmall,
                              overflow: 'hidden',
                              border: heroPreviews[index] === img ? `3px solid ${sageGreen}` : '2px solid #e0e0e0',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <img
                              src={img}
                              alt={`媒体图片 ${idx + 1}`}
                              style={{
                                width: '100%',
                                height: '120px',
                                objectFit: 'cover'
                              }}
                            />
                            <div style={{
                              padding: '0.5rem',
                              backgroundColor: warmCream,
                              fontSize: '0.75rem',
                              color: '#666',
                              wordBreak: 'break-all'
                            }}>
                              {img.split('/').pop()}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          const newHeroMediaOpen = [...heroMediaOpen];
                          newHeroMediaOpen[index] = false;
                          setHeroMediaOpen(newHeroMediaOpen);
                        }}
                        style={{
                          padding: '1rem',
                          backgroundColor: '#ccc',
                          color: '#333',
                          border: 'none',
                          borderRadius: borderRadiusSmall,
                          fontSize: '1rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        取消
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* Add Plant Tab */}
          {activeTab === 'add-plant' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: borderRadius,
              padding: isMobile ? '1rem' : '2rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              animation: 'fadeIn 0.4s ease'
            }}>
              <h2 style={{ 
                color: sageGreen, 
                marginBottom: '2rem', 
                fontSize: isMobile ? '1.5rem' : '1.75rem', 
                fontWeight: '600' 
              }}>
                添加新植物
              </h2>
              <form onSubmit={handleAddPlant} style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    植物名称
                  </label>
                  <input
                    type="text"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: isMobile ? '1rem' : '0.75rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: borderRadiusSmall,
                      fontSize: isMobile ? '1rem' : '1rem',
                      transition: 'border-color 0.3s ease'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    拉丁学名
                  </label>
                  <input
                    type="text"
                    value={scientificName}
                    onChange={(e) => setScientificName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: isMobile ? '1rem' : '0.75rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: borderRadiusSmall,
                      fontSize: isMobile ? '1rem' : '1rem',
                      transition: 'border-color 0.3s ease'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    安全性
                  </label>
                  <select
                    value={toxicityLevel}
                    onChange={(e) => setToxicityLevel(e.target.value)}
                    style={{
                      width: '100%',
                      padding: isMobile ? '1rem' : '0.75rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: borderRadiusSmall,
                      fontSize: isMobile ? '1rem' : '1rem',
                      transition: 'border-color 0.3s ease'
                    }}
                  >
                    <option value="Safe">安全 (Safe)</option>
                    <option value="Caution">注意 (Caution)</option>
                    <option value="Toxic">有毒 (Toxic)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    养育难度
                  </label>
                  <select
                    value={careDifficulty}
                    onChange={(e) => setCareDifficulty(e.target.value)}
                    style={{
                      width: '100%',
                      padding: isMobile ? '1rem' : '0.75rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: borderRadiusSmall,
                      fontSize: isMobile ? '1rem' : '1rem',
                      transition: 'border-color 0.3s ease'
                    }}
                  >
                    <option value="Easy">简单 (Easy)</option>
                    <option value="Moderate">中等 (Moderate)</option>
                    <option value="Difficult">困难 (Difficult)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    详细描述
                  </label>
                  <textarea
                    value={englishDescription}
                    onChange={(e) => setEnglishDescription(e.target.value)}
                    rows={isMobile ? 6 : 4}
                    style={{
                      width: '100%',
                      padding: isMobile ? '1rem' : '0.75rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: borderRadiusSmall,
                      fontSize: isMobile ? '1rem' : '1rem',
                      resize: 'vertical',
                      transition: 'border-color 0.3s ease'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    植物图片
                  </label>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {/* Image Preview */}
                    {(imagePreview || imageUrl) && (
                      <div style={{ position: 'relative' }}>
                        <img
                          src={imagePreview || imageUrl}
                          alt="植物图片预览"
                          style={{
                            width: isMobile ? '150px' : '200px',
                            height: isMobile ? '150px' : '200px',
                            objectFit: 'cover',
                            borderRadius: borderRadiusSmall,
                            border: '2px solid #e0e0e0'
                          }}
                        />
                        {imageUrl && (
                          <div style={{
                            position: 'absolute',
                            bottom: '8px',
                            left: '8px',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem'
                          }}>
                            {imageUrl}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Upload and Library Buttons */}
                    <div style={{ display: 'grid', gap: isMobile ? '0.75rem' : '1rem', gridTemplateColumns: isMobile ? '1fr' : 'auto auto' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageFileSelect(file, false);
                          }
                        }}
                        style={{ display: 'none' }}
                        id="plant-image-upload"
                      />
                      <label
                        htmlFor="plant-image-upload"
                        style={{
                          display: isMobile ? 'block' : 'inline-block',
                          width: isMobile ? '100%' : 'auto',
                          padding: isMobile ? '1rem' : '0.75rem 1.5rem',
                          backgroundColor: sageGreen,
                          color: 'white',
                          borderRadius: borderRadiusSmall,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 12px rgba(135, 169, 107, 0.3)',
                          textAlign: 'center',
                          fontSize: isMobile ? '1rem' : '0.9rem'
                        }}
                      >
                        📁 本地上传
                      </label>
                      
                      <button
                        type="button"
                        onClick={() => setMediaLibraryOpen(true)}
                        style={{
                          display: isMobile ? 'block' : 'inline-block',
                          width: isMobile ? '100%' : 'auto',
                          padding: isMobile ? '1rem' : '0.75rem 1.5rem',
                          backgroundColor: warmCream,
                          color: sageGreenDark,
                          border: `2px solid ${sageGreen}`,
                          borderRadius: borderRadiusSmall,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          textAlign: 'center',
                          fontSize: isMobile ? '1rem' : '0.9rem'
                        }}
                      >
                        🖼️ 媒体库
                      </button>
                    </div>
                    
                    {/* Upload Button for Selected File */}
                    {selectedImageFile && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                          type="button"
                          onClick={() => handlePlantImageUpload(selectedImageFile, false)}
                          disabled={imageUploading || !plantName}
                          style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: imageUploading || !plantName ? '#ccc' : sageGreen,
                            color: 'white',
                            border: 'none',
                            borderRadius: borderRadiusSmall,
                            cursor: imageUploading || !plantName ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {imageUploading ? '上传中...' : `上传为 ${plantName ? generatePlantFilename(plantName, selectedImageFile) : '请先填写植物名称'}`}
                        </button>
                        <span style={{ fontSize: '0.875rem', color: '#666' }}>
                          文件: {selectedImageFile.name}
                        </span>
                      </div>
                    )}
                    
                    {/* Hidden URL field for form submission */}
                    <input
                      type="hidden"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
                </div>
                {formMessage && (
                  <div style={{
                    padding: '0.75rem',
                    borderRadius: borderRadiusSmall,
                    backgroundColor: sageGreen,
                    color: 'white',
                    textAlign: 'center'
                  }}>
                    {formMessage}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={formSubmitting}
                  style={{
                    display: isMobile ? 'block' : 'inline-block',
                    width: isMobile ? '100%' : 'auto',
                    padding: isMobile ? '1.2rem 2rem' : '1rem 2rem',
                    backgroundColor: sageGreen,
                    color: 'white',
                    border: 'none',
                    borderRadius: borderRadiusSmall,
                    fontSize: isMobile ? '1.1rem' : '1rem',
                    fontWeight: '500',
                    cursor: formSubmitting ? 'not-allowed' : 'pointer',
                    opacity: formSubmitting ? 0.7 : 1,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(135, 169, 107, 0.3)'
                  }}
                >
                  {formSubmitting ? '保存中...' : '保存植物信息'}
                </button>
              </form>
            </div>
          )}

          {/* Plant List Tab */}
          {activeTab === 'plant-list' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: borderRadius,
              padding: isMobile ? '1rem' : '2rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              animation: 'fadeIn 0.4s ease'
            }}>
              <h2 style={{ 
                color: sageGreen, 
                marginBottom: '2rem', 
                fontSize: isMobile ? '1.5rem' : '1.75rem', 
                fontWeight: '600' 
              }}>
                植物列表
              </h2>
              
              {/* Search Bar */}
              <div style={{ marginBottom: '2rem' }}>
                <input
                  type="text"
                  placeholder="搜索植物名称或拉丁学名..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: isMobile ? '1rem' : '1rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: borderRadiusSmall,
                    fontSize: isMobile ? '1rem' : '1rem',
                    transition: 'border-color 0.3s ease'
                  }}
                />
              </div>

              {/* Plants Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: warmCreamDark }}>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>预览</th>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>名称</th>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>拉丁名</th>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>安全等级</th>
                      <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlants.map((plant) => (
                      <tr key={plant.slug} style={{ borderBottom: '1px solid #e0e0e0', transition: 'background-color 0.3s ease' }}>
                        <td style={{ padding: '1rem' }}>
                          {plant.image && (
                            <img
                              src={plant.image}
                              alt={plant.title}
                              style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                          )}
                        </td>
                        <td style={{ padding: '1rem', fontWeight: '500' }}>{plant.title}</td>
                        <td style={{ padding: '1rem', fontStyle: 'italic', color: '#666' }}>{plant.scientific_name}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            backgroundColor: 
                              plant.toxicity_level === 'Safe' ? '#d4edda' :
                              plant.toxicity_level === 'Caution' ? '#fff3cd' : '#f8d7da',
                            color: 
                              plant.toxicity_level === 'Safe' ? '#155724' :
                              plant.toxicity_level === 'Caution' ? '#856404' : '#721c24'
                          }}>
                            {plant.toxicity_level === 'Safe' ? '安全' :
                             plant.toxicity_level === 'Caution' ? '注意' : '有毒'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleEditPlant(plant)}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: sageGreen,
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => handleDeletePlant(plant.slug)}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: terracotta,
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Media Library Tab */}
          {activeTab === 'media-library' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: borderRadius,
              padding: isMobile ? '1rem' : '2rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              animation: 'fadeIn 0.4s ease'
            }}>
              <h2 style={{ 
                color: sageGreen, 
                marginBottom: '2rem', 
                fontSize: isMobile ? '1.5rem' : '1.75rem', 
                fontWeight: '600' 
              }}>
                媒体库
              </h2>

              {/* Upload Section */}
              <div style={{ 
                marginBottom: '2rem', 
                padding: isMobile ? '1rem' : '2rem', 
                backgroundColor: warmCream, 
                borderRadius: borderRadiusSmall 
              }}>
                <h3 style={{ marginBottom: '1rem', color: sageGreen, fontSize: isMobile ? '1.2rem' : '1.3rem' }}>上传新图片</h3>
                <div style={{ 
                  display: 'grid', 
                  gap: isMobile ? '0.75rem' : '1rem', 
                  gridTemplateColumns: isMobile ? '1fr' : 'auto auto',
                  alignItems: 'center' 
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      console.log('File selected:', file?.name, 'Size:', file?.size, 'Type:', file?.type);
                      
                      // Check file size (10MB limit)
                      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
                      if (file && file.size > maxSize) {
                        setMsg('文件大小不能超过10MB，请选择较小的图片');
                        setTimeout(() => setMsg(''), 3000);
                        // Clear the file input
                        e.target.value = '';
                        setUploadFile(null);
                        setUploadPreview('');
                        return;
                      }
                      
                      if (file) {
                        setUploadFile(file);
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          console.log('FileReader loaded, preview length:', e.target.result?.length);
                          setUploadPreview(e.target.result);
                        };
                        reader.onerror = (e) => console.error('FileReader error:', e);
                        reader.readAsDataURL(file);
                      } else {
                        console.log('No file selected');
                      }
                    }}
                    style={{ display: 'none' }}
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: sageGreen,
                      color: 'white',
                      borderRadius: borderRadiusSmall,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(135, 169, 107, 0.3)'
                    }}
                  >
                    选择图片 (最大50MB)
                  </label>
                  {uploadFile && (
                    <button
                      onClick={() => onUpload(uploadFile)}
                      disabled={uploading}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: uploading ? '#ccc' : sageGreen,
                        color: 'white',
                        border: 'none',
                        borderRadius: borderRadiusSmall,
                        cursor: uploading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {uploading ? '上传中...' : '上传'}
                    </button>
                  )}
                </div>
                {uploadPreview && (
                  <div style={{ marginTop: '1rem' }}>
                    <img
                      src={uploadPreview}
                      alt="预览"
                      style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: borderRadiusSmall }}
                    />
                  </div>
                )}
              </div>

              {/* Images Grid - Waterfall Layout */}
              <div className="waterfall-grid">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      breakInside: 'avoid',
                      marginBottom: '1rem',
                      backgroundColor: warmCream,
                      borderRadius: borderRadiusSmall,
                    }}
                  >
                    <img
                      src={img}
                      alt={`图片 ${idx}`}
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: `${borderRadiusSmall} ${borderRadiusSmall} 0 0`,
                        cursor: 'pointer'
                      }}
                      onClick={() => copyToClipboard(img)}
                    />
                    <div style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem', wordBreak: 'break-all' }}>
                        {img.split('/').pop()}
                      </div>
                      <button
                        onClick={() => copyToClipboard(img)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          backgroundColor: copiedPath === img ? '#28a745' : sageGreen,
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {copiedPath === img ? '已复制!' : '复制路径'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: borderRadius,
            padding: '2rem',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 16px 48px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ color: sageGreen, marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>
              编辑植物信息
            </h3>
            <form onSubmit={handleEditSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                  植物名称
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: borderRadiusSmall,
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                  拉丁学名
                </label>
                <input
                  type="text"
                  value={editForm.scientific_name}
                  onChange={(e) => setEditForm({...editForm, scientific_name: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: borderRadiusSmall,
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                  安全性
                </label>
                <select
                  value={editForm.toxicity_level}
                  onChange={(e) => setEditForm({...editForm, toxicity_level: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: borderRadiusSmall,
                    fontSize: '1rem'
                  }}
                >
                  <option value="Safe">安全 (Safe)</option>
                  <option value="Caution">注意 (Caution)</option>
                  <option value="Toxic">有毒 (Toxic)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                  养育难度
                </label>
                <select
                  value={editForm.care_difficulty}
                  onChange={(e) => setEditForm({...editForm, care_difficulty: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: borderRadiusSmall,
                    fontSize: '1rem'
                  }}
                >
                  <option value="Easy">简单 (Easy)</option>
                  <option value="Moderate">中等 (Moderate)</option>
                  <option value="Difficult">困难 (Difficult)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                  详细描述
                </label>
                <textarea
                  value={editForm.summary}
                  onChange={(e) => setEditForm({...editForm, summary: e.target.value})}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: borderRadiusSmall,
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                  植物图片
                </label>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {/* Image Preview */}
                  {(editImagePreview || editForm.image) && (
                    <div style={{ position: 'relative' }}>
                      <img
                        src={editImagePreview || editForm.image}
                        alt="植物图片预览"
                        style={{
                          width: '200px',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: borderRadiusSmall,
                          border: '2px solid #e0e0e0'
                        }}
                      />
                      {editForm.image && (
                        <div style={{
                          position: 'absolute',
                          bottom: '8px',
                          left: '8px',
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem'
                        }}>
                          {editForm.image}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Upload and Library Buttons */}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageFileSelect(file, true);
                        }
                      }}
                      style={{ display: 'none' }}
                      id="edit-plant-image-upload"
                    />
                    <label
                      htmlFor="edit-plant-image-upload"
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: sageGreen,
                        color: 'white',
                        borderRadius: borderRadiusSmall,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(135, 169, 107, 0.3)',
                        display: 'inline-block'
                      }}
                    >
                      📁 本地上传
                    </label>
                    
                    <button
                      type="button"
                      onClick={() => setEditMediaLibraryOpen(true)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: warmCreamDark,
                        color: '#333',
                        border: 'none',
                        borderRadius: borderRadiusSmall,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontSize: '1rem'
                      }}
                    >
                      🖼️ 从媒体库选择
                    </button>
                  </div>
                  
                  {/* Upload Button for Selected File */}
                  {editSelectedImageFile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <button
                        type="button"
                        onClick={() => handlePlantImageUpload(editSelectedImageFile, true)}
                        disabled={editImageUploading || !editForm.title}
                        style={{
                          padding: '0.75rem 1.5rem',
                          backgroundColor: editImageUploading || !editForm.title ? '#ccc' : sageGreen,
                          color: 'white',
                          border: 'none',
                          borderRadius: borderRadiusSmall,
                          cursor: editImageUploading || !editForm.title ? 'not-allowed' : 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {editImageUploading ? '上传中...' : `上传为 ${editForm.title ? generatePlantFilename(editForm.title, editSelectedImageFile) : '请先填写植物名称'}`}
                      </button>
                      <span style={{ fontSize: '0.875rem', color: '#666' }}>
                        文件: {editSelectedImageFile.name}
                      </span>
                    </div>
                  )}
                  
                  {/* Manual URL input as fallback */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="或直接输入图片URL..."
                      value={editForm.image}
                      onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        border: '2px solid #e0e0e0',
                        borderRadius: borderRadiusSmall,
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                  护理技巧
                </label>
                <textarea
                  value={editForm.care_tips}
                  onChange={(e) => setEditForm({...editForm, care_tips: e.target.value})}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: borderRadiusSmall,
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                  水分需求
                </label>
                <input
                  type="text"
                  value={editForm.water_needs}
                  onChange={(e) => setEditForm({...editForm, water_needs: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: borderRadiusSmall,
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                  光照需求
                </label>
                <input
                  type="text"
                  value={editForm.light_needs}
                  onChange={(e) => setEditForm({...editForm, light_needs: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: borderRadiusSmall,
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                  温度要求
                </label>
                <input
                  type="text"
                  value={editForm.temperature}
                  onChange={(e) => setEditForm({...editForm, temperature: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: borderRadiusSmall,
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                  萌宠时刻图片
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={editForm.pet_moment}
                    onChange={(e) => setEditForm({...editForm, pet_moment: e.target.value})}
                    placeholder="输入猫咪与植物合影的图片路径..."
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: borderRadiusSmall,
                      fontSize: '1rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setPetLibraryOpen(true)}
                    style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: warmCreamDark,
                      color: '#333',
                      border: 'none',
                      borderRadius: borderRadiusSmall,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '0.875rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    🐱 选择猫咪氛围图
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: sageGreen,
                    color: 'white',
                    border: 'none',
                    borderRadius: borderRadiusSmall,
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: editSubmitting ? 'not-allowed' : 'pointer',
                    opacity: editSubmitting ? 0.7 : 1,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {editSubmitting ? '保存中...' : '保存更改'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: '#ccc',
                    color: '#333',
                    border: 'none',
                    borderRadius: borderRadiusSmall,
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Library Modal for Add Plant */}
      {mediaLibraryOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: borderRadius,
            padding: '2rem',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 16px 48px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ color: sageGreen, marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>
              从媒体库选择图片
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {images.filter(img => img.includes('/uploads/')).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => handleMediaLibrarySelect(img, false)}
                  style={{
                    cursor: 'pointer',
                    borderRadius: borderRadiusSmall,
                    overflow: 'hidden',
                    border: selectedMediaImage === img ? `3px solid ${sageGreen}` : '2px solid #e0e0e0',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <img
                    src={img}
                    alt={`媒体库图片 ${idx}`}
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    padding: '0.5rem',
                    backgroundColor: warmCream,
                    fontSize: '0.75rem',
                    color: '#666',
                    wordBreak: 'break-all'
                  }}>
                    {img.split('/').pop()}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setMediaLibraryOpen(false)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor: '#ccc',
                  color: '#333',
                  border: 'none',
                  borderRadius: borderRadiusSmall,
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Library Modal for Edit Plant */}
      {editMediaLibraryOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: borderRadius,
            padding: '2rem',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 16px 48px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ color: sageGreen, marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>
              从媒体库选择图片
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {images.filter(img => img.includes('/uploads/')).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => handleMediaLibrarySelect(img, true)}
                  style={{
                    cursor: 'pointer',
                    borderRadius: borderRadiusSmall,
                    overflow: 'hidden',
                    border: editSelectedMediaImage === img ? `3px solid ${sageGreen}` : '2px solid #e0e0e0',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <img
                    src={img}
                    alt={`媒体库图片 ${idx}`}
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    padding: '0.5rem',
                    backgroundColor: warmCream,
                    fontSize: '0.75rem',
                    color: '#666',
                    wordBreak: 'break-all'
                  }}>
                    {img.split('/').pop()}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setEditMediaLibraryOpen(false)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor: '#ccc',
                  color: '#333',
                  border: 'none',
                  borderRadius: borderRadiusSmall,
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pet Image Library Modal */}
      {petLibraryOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: borderRadius,
            padding: '2rem',
            width: '90%',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 16px 48px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ color: sageGreen, marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>
              🐱 选择猫咪氛围图
            </h3>
            {petImages.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                backgroundColor: warmCream,
                borderRadius: borderRadiusSmall,
                color: '#666'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
                <p>还没有上传猫咪图片哦！</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  请将猫咪与植物的合影图片上传到 <code>/public/images/pets/</code> 目录
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                {petImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => handlePetImageSelect(img)}
                    style={{
                      cursor: 'pointer',
                      borderRadius: borderRadiusSmall,
                      overflow: 'hidden',
                      border: editForm.pet_moment === img ? `3px solid ${sageGreen}` : '2px solid #e0e0e0',
                      transition: 'all 0.3s ease',
                      transform: editForm.pet_moment === img ? 'scale(1.05)' : 'scale(1)'
                    }}
                  >
                    <img
                      src={img}
                      alt={`猫咪图片 ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '140px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      padding: '0.75rem',
                      backgroundColor: warmCream,
                      fontSize: '0.75rem',
                      color: '#666',
                      wordBreak: 'break-all',
                      textAlign: 'center'
                    }}>
                      {img.split('/').pop()}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setPetLibraryOpen(false)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor: '#ccc',
                  color: '#333',
                  border: 'none',
                  borderRadius: borderRadiusSmall,
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .waterfall-grid {
          column-count: 4;
          column-gap: 1rem;
        }
        
        @media (max-width: 1200px) {
          .waterfall-grid {
            column-count: 3;
          }
        }
        
        @media (max-width: 768px) {
          .waterfall-grid {
            column-count: 2;
          }
        }
        
        @media (max-width: 480px) {
          .waterfall-grid {
            column-count: 1;
          }
        }
      `}</style>
    </div>
  );
}
