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
      <h1>🚫 Oops! Keep Away (猫猫不能碰的花花)</h1>
      <div style={{ background: '#fdecea', color: '#b71c1c', border: '1px solid #f44336', borderRadius: 8, padding: '10px 12px', margin: '8px 0 12px' }}>
        ⚠️ 如果您的猫咪接触了这些植物，请立即就医！
      </div>
      <div style={{ color: '#b71c1c', marginBottom: 8 }}>❌ 高毒性！ 即使少量接触或舔舐也可能导致呕吐、肾衰竭甚至死亡</div>
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
            <tr>
              <td style={{ padding: '6px 8px' }}><Link href="/plants/lily">Lilies</Link></td>
              <td style={{ padding: '6px 8px' }}>百合 / 萱草</td>
              <td style={{ padding: '6px 8px' }}>⚠️ 对猫极度危险！ 所有部分（花、叶、花粉、水）都可能导致急性肾衰竭</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 8px' }}><Link href="/plants/oleander">Oleander</Link></td>
              <td style={{ padding: '6px 8px' }}>夹竹桃</td>
              <td style={{ padding: '6px 8px' }}>心脏毒素，极少量即可致命</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 8px' }}><Link href="/plants/sago-palm">Sago Palm</Link></td>
              <td style={{ padding: '6px 8px' }}>苏铁</td>
              <td style={{ padding: '6px 8px' }}>种子毒性最强，可致肝衰竭</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 8px' }}><Link href="/plants/tulips">Tulips</Link></td>
              <td style={{ padding: '6px 8px' }}>郁金香</td>
              <td style={{ padding: '6px 8px' }}>鳞茎毒性最强，会引起流涎、抽搐、心律不齐</td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: 6, color: '#b71c1c' }}>🚨 紧急提示：如果猫咪接触了以上任何植物，请立即联系兽医或宠物毒物控制中心！</div>
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
