import '../styles/globals.css';
import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }) {
  const [q, setQ] = useState('')
  const [allPlants, setAllPlants] = useState([])
  const [safeList, setSafeList] = useState([])
  const [toxicList, setToxicList] = useState([])
  const [cautionList, setCautionList] = useState([])
  const [openMenu, setOpenMenu] = useState({ safe: false, toxic: false, caution: false })
  const [isMobile, setIsMobile] = useState(false)
  const [siteLogo, setSiteLogo] = useState('')
  const onSearch = async () => {
    try {
      const r = await fetch('/api/plants')
      const j = await r.json()
      const list = (j.plants || []).map(p => ({ slug: p.slug, title: String(p.title || ''), scientific_name: String(p.scientific_name || ''), toxicity_level: String(p.toxicity_level || '') }))
      const qq = q.trim().toLowerCase()
      if (!qq) return
      const candidates = list.filter(p => p.title.toLowerCase().includes(qq) || p.scientific_name.toLowerCase().includes(qq) || p.slug.toLowerCase().includes(qq))
      const target = candidates[0]
      if (target) window.location.href = '/plants/' + target.slug
    } catch {}
  }
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Enter' && document.activeElement && document.activeElement.id === 'global-search-input') onSearch() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [q])
  useEffect(() => {
    // Startup logging
    console.log('🚀 PawSafePlants 启动中...');
    console.log('📁 环境配置检查:');
    console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 已配置' : '❌ 缺失'}`);
    console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ 已配置' : '❌ 缺失'}`);
    
    const load = async () => {
      try {
        console.log('🌿 加载植物数据...');
        const j = await (await fetch('/api/plants')).json()
        const list = j.plants || []
        console.log(`✅ 成功加载 ${list.length} 个植物数据`);
        setAllPlants(list)
        const lower = (t) => String(t || '').toLowerCase()
        setSafeList(list.filter(p => lower(p.toxicity_level).includes('safe')))
        setToxicList(list.filter(p => {
          const t = lower(p.toxicity_level)
          return t.includes('danger') || t.includes('extreme') || t.includes('toxic') || t.includes('fatal')
        }))
        setCautionList(list.filter(p => {
          const t = lower(p.toxicity_level)
          const s = t.includes('safe')
          const d = t.includes('danger') || t.includes('extreme') || t.includes('toxic') || t.includes('fatal')
          return !s && !d
        }))
        
        // Test database connectivity
        console.log('🔍 测试数据库连接...');
        const siteRes = await fetch('/api/site-config');
        if (siteRes.ok) {
          console.log('✅ 数据库连接正常');
        } else {
          console.log('❌ 数据库连接异常');
        }
      } catch (error) {
        console.error('❌ 数据加载失败:', error.message);
      }
    }
    
    load()
    
    const loadSite = async () => {
      try {
        const s = await (await fetch('/api/site-config')).json()
        const logo = String((s || {}).logo || '')
        setSiteLogo(logo)
        console.log('🎨 网站配置加载完成');
      } catch {}
    }
    loadSite()
    
    const onResize = () => { try { setIsMobile(window.innerWidth <= 767) } catch {} }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const toggleMenu = (key) => {
    setOpenMenu(prev => ({ ...prev, [key]: !prev[key] }))
  }
  return (
    <div className="app-container">
      <Head>
        <title>PawSafePlants - Cat-Safe Plants Guide</title>
        <meta name="description" content="Complete guide to cat-safe plants. Keep your feline friends safe with our comprehensive plant toxicity database." />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <header className="header">
        <div className="header-inner">
          {siteLogo ? (
            <Link href="/" className="logo">
              <img src={siteLogo} alt="PawSafePlants" style={{ height: 72, width: 'auto', display: 'block', mixBlendMode: 'screen', position: 'relative', zIndex: 2 }} />
              <span style={{ marginLeft: -14, fontWeight: 800, fontSize: 22, color: '#fff', position: 'relative', zIndex: 1, textShadow: '0 1px 2px rgba(0,0,0,0.35)' }}>PawSafePlants</span>
            </Link>
          ) : (
            <Link href="/" className="logo" style={{ fontWeight: 700, fontSize: 20 }}>🐾 PawSafePlants</Link>
          )}
          <div className="search-box">
            <input id="global-search-input" type="text" placeholder="Search plants by name or scientific name..." value={q} onChange={(e) => setQ(e.target.value)} />
            <button type="button" onClick={onSearch} aria-label="Search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2" />
                <path d="M20 20l-3-3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
        <nav className="nav-menu">
          <div className="nav-item-wrapper" onMouseEnter={() => { if (!isMobile) setOpenMenu(prev => ({ ...prev, safe: true })) }} onMouseLeave={() => { if (!isMobile) setOpenMenu(prev => ({ ...prev, safe: false })) }}>
            <Link href="/plants/safe" className="nav-item" onClick={(e) => { if (isMobile) { e.preventDefault(); toggleMenu('safe') } }}>
              Cat-Safe Plants 🌸
            </Link>
            {openMenu.safe && (
              <div className="dropdown">
                {safeList.map(p => (
                  <Link key={p.slug} href={`/plants/${p.slug}`} className="dropdown-item">{p.title || p.slug}</Link>
                ))}
              </div>
            )}
          </div>
          <div className="nav-item-wrapper" onMouseEnter={() => { if (!isMobile) setOpenMenu(prev => ({ ...prev, toxic: true })) }} onMouseLeave={() => { if (!isMobile) setOpenMenu(prev => ({ ...prev, toxic: false })) }}>
            <Link href="/plants/toxic" className="nav-item" onClick={(e) => { if (isMobile) { e.preventDefault(); toggleMenu('toxic') } }}>
              Toxic Plants 🚫
            </Link>
            {openMenu.toxic && (
              <div className="dropdown">
                {toxicList.map(p => (
                  <Link key={p.slug} href={`/plants/${p.slug}`} className="dropdown-item">{p.title || p.slug}</Link>
                ))}
              </div>
            )}
          </div>
          <div className="nav-item-wrapper" onMouseEnter={() => { if (!isMobile) setOpenMenu(prev => ({ ...prev, caution: true })) }} onMouseLeave={() => { if (!isMobile) setOpenMenu(prev => ({ ...prev, caution: false })) }}>
            <Link href="/plants/caution" className="nav-item" onClick={(e) => { if (isMobile) { e.preventDefault(); toggleMenu('caution') } }}>
              Moderate Risk ⚠️
            </Link>
            {openMenu.caution && (
              <div className="dropdown">
                {cautionList.map(p => (
                  <Link key={p.slug} href={`/plants/${p.slug}`} className="dropdown-item">{p.title || p.slug}</Link>
                ))}
              </div>
            )}
          </div>
          {/* 强制Blog入口 - 确保显示 */}
          <Link href="/blog/valentines-day-cat-safe-flowers-guide" className="nav-item" style={{ fontWeight: 600, color: '#e91e63' }}>Latest Stories 💕</Link>
          <Link href="/cat-safe-flowers" className="nav-item" style={{ fontWeight: 600, color: '#10B981' }}>Safe Bouquets 🌸</Link>
          <Link href="/blog/valentines-day-cat-safe-flowers-guide" className="nav-item">Blog 📝</Link>
          <Link href="/items" className="nav-item">More Products 🎀</Link>
        </nav>
      </header>
      <Component {...pageProps} />
    </div>
  );
}
