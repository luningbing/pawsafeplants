import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function getServerSideProps(context) {
  const plantsDir = path.join(process.cwd(), 'content/plants');
  let plants = [];
  try {
    const filenames = fs.readdirSync(plantsDir).filter((f) => f.endsWith('.md'));
    plants = filenames.map(filename => {
      const slug = filename.replace(/\.md$/, '');
      const fullPath = path.join(plantsDir, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return { slug, ...data };
    });
  } catch {}
  if (!plants.length) {
    plants = [
      {
        slug: 'lily',
        title: 'Lily (百合)',
        toxicity_level: 'DANGER – Highly toxic to cats',
        summary: 'Even small ingestions can cause acute kidney failure in cats.'
      },
      {
        slug: 'rose',
        title: 'Rose (玫瑰)',
        toxicity_level: 'Safe – generally non-toxic',
        summary: 'Thorns can cause injury but the plant is generally non-toxic.'
      }
    ];
  }
  let heroImage = '/images/hero-default.svg';
  try {
    const origin = (process.env.VERCEL_URL ? ('https://' + process.env.VERCEL_URL) : (`${context.req.headers['x-forwarded-proto'] || 'http'}://${context.req.headers.host}`))
    const r = await fetch(origin + '/api/site-config')
    const j = await r.json()
    heroImage = String((j || {}).heroImage || heroImage)
  } catch {}
  return { props: { plants, site: { heroImage } } };
}

export default function Home({ plants, site }) {
  const featured = [
    { title: 'Sunflowers (向日葵)', level: 'Safe', desc: 'Bright and cat-safe', slug: 'sunflowers', icon: '✅' },
    { title: 'Spider Plant (吊兰)', level: 'Safe', desc: 'Generally safe; mild GI upset possible', slug: 'spider-plant', icon: '✅' },
    { title: 'Aloe Vera (芦荟)', level: 'Caution', desc: 'May cause gastrointestinal upset', slug: 'aloe-vera', icon: '⚠️' }
  ]
  useEffect(() => {
    try {
      const body = { page_path: window.location.pathname, referrer: document.referrer }
      fetch('/api/analytics/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => {})
    } catch {}
  }, [])
  const sorted = useMemo(() => {
    return plants.slice().sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')))
  }, [plants])
  const tagStyle = (level) => {
    const L = String(level || '').toLowerCase()
    const safe = L.includes('safe')
    const danger = L.includes('danger') || L.includes('toxic') || L.includes('extreme')
    const caution = !safe && !danger
    const bg = safe ? '#4CAF50' : caution ? '#FFEB3B' : '#F44336'
    const color = safe ? '#fff' : caution ? '#333' : '#fff'
    return { display: 'inline-block', padding: '2px 8px', borderRadius: 6, background: bg, color }
  }
  return (
    <div style={{ fontFamily: 'Inter, Roboto, Segoe UI, PingFang SC, system-ui' }}>
      
      {site?.heroImage ? (
        <div style={{ margin: '8px 0' }}>
          <img src={site.heroImage} alt="homepage hero" style={{ width: '100%', height: 400, objectFit: 'cover', objectPosition: 'center', borderRadius: 12 }} />
        </div>
      ) : (
        <div style={{ margin: '16px 0', padding: 20, background: 'linear-gradient(90deg,#A8E6CF,#FFD3B6,#DCBFFF)', borderRadius: 12, color: '#333' }}>
          <div style={{ fontWeight: 600 }}>Hero image not set</div>
          <div style={{ fontSize: 13 }}>Set it in Admin: <Link href="/admin">Admin → Homepage Hero</Link></div>
        </div>
      )}
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginTop: 16 }}>
        <div style={{ border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Latest Tips</div>
          <div style={{ display: 'grid', gap: 8 }}>
            <a href="#" style={{ color: '#0ea5e9', textDecoration: 'none' }}>How to choose cat‑safe indoor plants</a>
            <a href="#" style={{ color: '#0ea5e9', textDecoration: 'none' }}>Tips to identify toxic plants</a>
            <a href="#" style={{ color: '#0ea5e9', textDecoration: 'none' }}>Emergency steps after ingestion</a>
          </div>
        </div>
        <div style={{ border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>Top 3 Popular Plants</div>
          <div style={{ display: 'grid', gap: 10 }}>
            {featured.map((f, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: '#555' }}>{f.desc}</div>
                </div>
                <span style={{ ...tagStyle(f.level) }}>{f.icon} {f.level}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>You Might Like</div>
          <div style={{ display: 'grid', gap: 8 }}>
            <a href="#" style={{ color: '#0ea5e9', textDecoration: 'none' }}>ASPCA toxicity database</a>
            <a href="#" style={{ color: '#0ea5e9', textDecoration: 'none' }}>Local animal hospitals</a>
            <a href="#" style={{ color: '#0ea5e9', textDecoration: 'none' }}>Cat care basics</a>
          </div>
        </div>
      </div>
      <div id="all-plants" style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 24, color: '#333' }}>All Plants</h2>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          {sorted.map(plant => (
            <div key={plant.slug} style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, margin: 6, background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 80px 1fr', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {plant.thumbPlant ? <img src={plant.thumbPlant} alt="plant" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : plant.image ? <img src={plant.image} alt="plant" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 28 }}>🌿</span>}
                </div>
                <div style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {plant.thumbCat ? <img src={plant.thumbCat} alt="cat" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 28 }}>🐱</span>}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}><Link href={`/plants/${plant.slug}`}>{plant.title}</Link></div>
                  <div style={{ marginTop: 6 }}>
                    {String(plant.toxicity_level || 'Unknown').includes('DANGER')
                      ? <span>❌</span>
                      : String(plant.toxicity_level || '').toLowerCase().includes('safe')
                        ? <span>✅</span>
                        : <span>⚠️</span>}
                  </div>
                </div>
              </div>
              <div style={{ color: '#555', marginTop: 8, minHeight: 40 }}>{plant.summary}</div>
              <div style={{ marginTop: 8 }}><Link href={`/plants/${plant.slug}`}>Explore →</Link></div>
            </div>
          ))}
        </div>
        
      </div>
      <footer style={{ marginTop: 32, fontSize: '0.9em', color: '#666', padding: 16 }}>
        <p>⚠️ If your cat ate a plant, contact your vet immediately.</p>
        <Link href="/about">About & Disclaimer</Link>
      </footer>
    </div>
  );
}
