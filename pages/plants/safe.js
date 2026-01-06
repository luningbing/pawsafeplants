import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'

export async function getStaticProps() {
  const dir = path.join(process.cwd(), 'content', 'plants')
  let files = []
  try { files = fs.readdirSync(dir).filter(f => f.endsWith('.md')) } catch {}
  const all = files.map(f => {
    const slug = f.replace(/\.md$/, '')
    const raw = fs.readFileSync(path.join(dir, f), 'utf8')
    const { data } = matter(raw)
    return { slug, title: data.title || slug, summary: data.summary || '', toxicity_level: data.toxicity_level || '', image: data.image || '', thumbPlant: data.thumbPlant || '', thumbCat: data.thumbCat || '' }
  })
  const list = all.filter(p => String(p.toxicity_level || '').toLowerCase().includes('safe'))
  return { props: { plants: list } }
}

export default function SafePlants({ plants }) {
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
    <div>
      <h1>🌸 Cat-Safe Plants</h1>
      <div style={{ color: '#2e7d32', marginBottom: 8 }}>✅ Safe for cats, perfect for your home</div>
      <div style={{ margin: '10px 0 16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '6px 8px' }}>Plant Name</th>
              <th style={{ textAlign: 'left', padding: '6px 8px' }}>Common Name</th>
              <th style={{ textAlign: 'left', padding: '6px 8px' }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '6px 8px' }}><Link href="/plants/spider-plant">Spider Plant</Link></td>
              <td style={{ padding: '6px 8px' }}>Spider Plant</td>
              <td style={{ padding: '6px 8px' }}>Air purifying, cats love playing with leaves</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 8px' }}><Link href="/plants/sunflowers">Sunflowers</Link></td>
              <td style={{ padding: '6px 8px' }}>Sunflowers</td>
              <td style={{ padding: '6px 8px' }}>Flowers and stems are non-toxic</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 8px' }}><Link href="/plants/roses">Roses</Link></td>
              <td style={{ padding: '6px 8px' }}>Roses</td>
              <td style={{ padding: '6px 8px' }}>Thorns can cause injury, but plant is non-toxic (avoid eating large amounts of petals)</td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: 6, color: '#555' }}>💡 Tip: Even "safe" plants shouldn't be eaten in large quantities by cats, as they may cause mild digestive upset.</div>
      </div>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {plants.map(p => (
          <div key={p.slug} className="card" style={{ padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 80px 1fr', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {p.thumbPlant ? <img src={p.thumbPlant} alt="plant" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : p.image ? <img src={p.image} alt="plant" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 28 }}>🌿</span>}
              </div>
              <div style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {p.thumbCat ? <img src={p.thumbCat} alt="cat" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 28 }}>🐱</span>}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}><Link href={`/plants/${p.slug}`}>{p.title}</Link></div>
                <div style={{ marginTop: 6 }}>
                  {String(p.toxicity_level || 'Unknown').includes('DANGER')
                    ? <span>❌</span>
                    : String(p.toxicity_level || '').toLowerCase().includes('safe')
                      ? <span>✅</span>
                      : <span>⚠️</span>}
                </div>
              </div>
            </div>
            <div style={{ color: '#555', marginTop: 8, minHeight: 40 }}>{p.summary}</div>
            <div style={{ marginTop: 8 }}><Link href={`/plants/${p.slug}`}>Explore →</Link></div>
          </div>
        ))}
      </div>
    </div>
  )
}
