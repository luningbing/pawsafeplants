import '../styles/globals.css';
import Link from 'next/link';
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
    const load = async () => {
      try {
        const j = await (await fetch('/api/plants')).json()
        const list = j.plants || []
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
      } catch {}
    }
    load()
    const loadSite = async () => {
      try {
        const s = await (await fetch('/api/site-config')).json()
        const logo = String((s || {}).logo || '')
        setSiteLogo(logo)
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
    <div>
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
            <input id="global-search-input" type="text" placeholder="Search by name, scientific name..." value={q} onChange={(e) => setQ(e.target.value)} />
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
              Purr-fect Picks 🌸 (猫猫友好花花)
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
              Oops! Keep Away 🚫 (猫猫不能碰的花花)
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
              Moderate Risk (猫猫警惕的植物)
            </Link>
            {openMenu.caution && (
              <div className="dropdown">
                {cautionList.map(p => (
                  <Link key={p.slug} href={`/plants/${p.slug}`} className="dropdown-item">{p.title || p.slug}</Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/items" className="nav-item">More Fun Stuff 🎀 (其他物品)</Link>
        </nav>
      </header>
      <Component {...pageProps} />
    </div>
  );
}
