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
  const caution = all.filter(p => {
    const t = String(p.toxicity_level || '').toLowerCase()
    const safe = t.includes('safe')
    const danger = t.includes('danger') || t.includes('extreme') || t.includes('toxic') || t.includes('fatal')
    return !safe && !danger
  })
  return { props: { plants: caution } }
}

export default function CautionPlants({ plants }) {
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
      <h1>⚠️ Plants of Moderate Risk</h1>
      <div style={{ color: '#8a6d3b', marginBottom: 8 }}>🟡 Low to moderate toxicity, typically causes mouth irritation, drooling, vomiting, diarrhea, generally not fatal but should be avoided</div>
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
            <tr><td style={{ padding: '6px 8px' }}><Link href="/plants/aloe-vera">Aloe Vera</Link></td><td style={{ padding: '6px 8px' }}>Aloe</td><td style={{ padding: '6px 8px' }}>Laxative components, cause diarrhea, electrolyte imbalance</td></tr>
            <tr><td style={{ padding: '6px 8px' }}><Link href="/plants/carnations">Carnations</Link></td><td style={{ padding: '6px 8px' }}>Carnation</td><td style={{ padding: '6px 8px' }}>Causes mild gastrointestinal irritation</td></tr>
            <tr><td style={{ padding: '6px 8px' }}><Link href="/plants/chrysanthemums">Chrysanthemums</Link></td><td style={{ padding: '6px 8px' }}>Mum</td><td style={{ padding: '6px 8px' }}>Contains pyrethrins, may cause drooling, loss of coordination</td></tr>
            <tr><td style={{ padding: '6px 8px' }}><Link href="/plants/monstera">Monstera</Link></td><td style={{ padding: '6px 8px' }}>Swiss Cheese Plant</td><td style={{ padding: '6px 8px' }}>Calcium oxalate crystals, irritates mouth and digestive tract</td></tr>
            <tr><td style={{ padding: '6px 8px' }}><Link href="/plants/peace-lily">Peace Lily</Link></td><td style={{ padding: '6px 8px' }}>Peace Lily</td><td style={{ padding: '6px 8px' }}>Same as above (note: not true lily, but still irritating)</td></tr>
            <tr><td style={{ padding: '6px 8px' }}><Link href="/plants/philodendron">Philodendron</Link></td><td style={{ padding: '6px 8px' }}>Philodendron</td><td style={{ padding: '6px 8px' }}>Calcium oxalate crystals, cause oral swelling</td></tr>
            <tr><td style={{ padding: '6px 8px' }}><Link href="/plants/pothos">Pothos (Devil's Ivy)</Link></td><td style={{ padding: '6px 8px' }}>Pothos</td><td style={{ padding: '6px 8px' }}>Most common toxic houseplant, symptoms similar to above</td></tr>
            <tr><td style={{ padding: '6px 8px' }}><Link href="/plants/snake-plant">Snake Plant</Link></td><td style={{ padding: '6px 8px' }}>Snake Plant</td><td style={{ padding: '6px 8px' }}>Mild toxicity, causes nausea, vomiting</td></tr>
            <tr><td style={{ padding: '6px 8px' }}><Link href="/plants/daffodils">Daffodils</Link></td><td style={{ padding: '6px 8px' }}>Daffodil</td><td style={{ padding: '6px 8px' }}>Bulbs are highly toxic, similar to tulips</td></tr>
            <tr><td style={{ padding: '6px 8px' }}><Link href="/plants/zz-plant">ZZ Plant</Link></td><td style={{ padding: '6px 8px' }}>ZZ Plant</td><td style={{ padding: '6px 8px' }}>Calcium oxalate, irritates mouth and digestive tract</td></tr>
          </tbody>
        </table>
        <div style={{ marginTop: 6, color: '#8a6d3b' }}>💡 These plants can be kept at home, but should be placed where cats can't reach them (like high shelves or hanging planters).</div>
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
