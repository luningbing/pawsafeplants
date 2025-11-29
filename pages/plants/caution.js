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
      <h1>⚠️ Moderate Risk (猫猫警惕的植物)</h1>
      <div style={{ color: '#8a6d3b', marginBottom: 8 }}>🟡 低至中度毒性，通常引起口炎、流涎、呕吐、腹泻，一般不会致命，但仍需避免</div>
      <div style={{ margin: '10px 0 16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '6px 8px' }}>植物名称（英文）</th>
              <th style={{ textAlign: 'left', padding: '6px 8px' }}>中文名</th>
              <th style={{ textAlign: 'left', padding: '6px 8px' }}>风险说明</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '6px 8px' }}><Link href="/plants/aloe-vera">Aloe Vera</Link></td><td style={{ padding: '6px 8px' }}>芦荟</td><td style={{ padding: '6px 8px' }}>泻药成分，导致腹泻、电解质失衡</td></tr>
            <tr><td style={{ padding: '6px 8px' }}><Link href="/plants/carnations">Carnations</Link></td><td style={{ padding: '6px 8px' }}>康乃馨</td><td style={{ padding: '6px 8px' }}>引起轻度肠胃炎</td></tr>
            <tr><td style={{ padding: '6px 8px' }}><Link href="/plants/chrysanthemums">Chrysanthemums</Link></td><td style={{ padding: '6px 8px' }}>菊花</td><td style={{ padding: '6px 8px' }}>含除虫菊酯，可能引发流涎、共济失调</td></tr>
            <tr><td style={{ padding: '6px 8px' }}><Link href="/plants/monstera">Monstera</Link></td><td style={{ padding: '6px 8px' }}>龟背竹</td><td style={{ padding: '6px 8px' }}>草酸钙针晶，刺激口腔和消化道</td></tr>
            <tr><td style={{ padding: '6px 8px' }}><Link href="/plants/peace-lily">Peace Lily</Link></td><td style={{ padding: '6px 8px' }}>白鹤芋</td><td style={{ padding: '6px 8px' }}>同上（注意：不是真百合，但仍有刺激性）</td></tr>
            <tr><td style={{ padding: '6px 8px' }}><Link href="/plants/philodendron">Philodendron</Link></td><td style={{ padding: '6px 8px' }}>喜林芋</td><td style={{ padding: '6px 8px' }}>草酸钙结晶，导致口腔肿胀</td></tr>
            <tr><td style={{ padding: '6px 8px' }}><Link href="/plants/pothos">Pothos (Devil’s Ivy)</Link></td><td style={{ padding: '6px 8px' }}>绿萝</td><td style={{ padding: '6px 8px' }}>最常见室内毒植之一，症状同上</td></tr>
            <tr><td style={{ padding: '6px 8px' }}><Link href="/plants/snake-plant">Snake Plant</Link></td><td style={{ padding: '6px 8px' }}>虎皮兰</td><td style={{ padding: '6px 8px' }}>轻微毒性，引起恶心、呕吐</td></tr>
            <tr><td style={{ padding: '6px 8px' }}><Link href="/plants/daffodils">Daffodils</Link></td><td style={{ padding: '6px 8px' }}>水仙</td><td style={{ padding: '6px 8px' }}>鳞茎毒性高，类似郁金香</td></tr>
            <tr><td style={{ padding: '6px 8px' }}><Link href="/plants/zz-plant">ZZ Plant</Link></td><td style={{ padding: '6px 8px' }}>雪铁芋</td><td style={{ padding: '6px 8px' }}>草酸钙，刺激口腔和肠胃</td></tr>
          </tbody>
        </table>
        <div style={{ marginTop: 6, color: '#8a6d3b' }}>💡 这些植物在家中可养，但建议放在猫咪够不到的地方（如高架、悬挂盆栽）。</div>
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
