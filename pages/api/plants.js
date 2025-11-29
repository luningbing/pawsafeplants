import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { createClient } from '@supabase/supabase-js'

function readPlant(fp) {
  const raw = fs.readFileSync(fp, 'utf8')
  const { data } = matter(raw)
  const slug = path.basename(fp).replace(/\.md$/, '')
  return { slug, title: data.title || slug, summary: data.summary || '', toxicity_level: data.toxicity_level || '', image: data.image || '', image2: data.image2 || '', image3: data.image3 || '', thumbPlant: data.thumbPlant || '', thumbCat: data.thumbCat || '' }
}

export default async function handler(req, res) {
  try {
    const dir = path.join(process.cwd(), 'content', 'plants')
    let files = []
    try { files = fs.readdirSync(dir).filter(f => f.endsWith('.md')) } catch {}
    let list = files.map(f => readPlant(path.join(dir, f)))
    const supabaseUrl = process.env.SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
    if (supabaseUrl && supabaseKey) {
      const client = createClient(supabaseUrl, supabaseKey)
      const { data, error } = await client.from('plant_images').select('slug,image,image2,image3,thumbPlant,thumbCat')
      if (!error && Array.isArray(data)) {
        const map = Object.create(null)
        data.forEach(row => { map[row.slug] = row })
        list = list.map(p => {
          const m = map[p.slug] || {}
          return {
            ...p,
            image: String(m.image || p.image || ''),
            image2: String(m.image2 || p.image2 || ''),
            image3: String(m.image3 || p.image3 || ''),
            thumbPlant: String(m.thumbPlant || p.thumbPlant || ''),
            thumbCat: String(m.thumbCat || p.thumbCat || '')
          }
        })
      }
    }
    if (!list.length) {
      const fallback = [
        { slug: 'lily', title: 'Lily (百合)', toxicity_level: 'DANGER – Highly toxic to cats', summary: 'Even small ingestions can cause acute kidney failure in cats.', image: '', image2: '', image3: '', thumbPlant: '', thumbCat: '' },
        { slug: 'rose', title: 'Rose (玫瑰)', toxicity_level: 'Safe – generally non-toxic', summary: 'Thorns can cause injury but the plant is generally non-toxic.', image: '', image2: '', image3: '', thumbPlant: '', thumbCat: '' }
      ]
      return res.status(200).json({ plants: fallback })
    }
    return res.status(200).json({ plants: list })
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) })
  }
}
