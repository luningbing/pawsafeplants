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
  const danger = all.filter(p => {
    const t = String(p.toxicity_level || '').toLowerCase()
    return t.includes('danger') || t.includes('extreme') || t.includes('toxic') || t.includes('fatal') || t.includes('☠️'.toLowerCase())
  })
  return { props: { plants: danger } }
}

export default function ToxicPlants({ plants }) {
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
      <h1>🚫 Toxic Plants for Cats</h1>
      <div style={{ background: '#fdecea', color: '#b71c1c', border: '1px solid #f44336', borderRadius: 8, padding: '10px 12px', margin: '8px 0 12px' }}>
        ⚠️ If your cat comes into contact with these plants, seek veterinary care immediately!
      </div>
      <div style={{ color: '#b71c1c', marginBottom: 8 }}>❌ Highly toxic! Even small amounts can cause vomiting, kidney failure, or death</div>
      <div style={{ margin: '10px 0 16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '6px 8px' }}>Plant Name</th>
              <th style={{ textAlign: 'left', padding: '6px 8px' }}>Common Name</th>
              <th style={{ textAlign: 'left', padding: '6px 8px' }}>Risk Level</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '6px 8px' }}>Lily</td>
              <td style={{ padding: '6px 8px' }}>Lily</td>
              <td style={{ padding: '6px 8px' }}>⚠️ Extremely dangerous to cats! All parts (flowers, leaves, pollen, water) can cause acute kidney failure</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 8px' }}>Oleander</td>
              <td style={{ padding: '6px 8px' }}>Oleander</td>
              <td style={{ padding: '6px 8px' }}>Cardiac toxin, even tiny amounts can be fatal</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 8px' }}>Sago Palm</td>
              <td style={{ padding: '6px 8px' }}>Sago Palm</td>
              <td style={{ padding: '6px 8px' }}>Seeds are most toxic, can cause liver failure</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 8px' }}>Tulips</td>
              <td style={{ padding: '6px 8px' }}>Tulips</td>
              <td style={{ padding: '6px 8px' }}>Bulbs are most toxic, cause drooling, seizures, irregular heartbeat</td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: 6, color: '#b71c1c' }}>🚨 Emergency: If your cat contacts any of these plants, contact your veterinarian or pet poison control immediately!</div>
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
