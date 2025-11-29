import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    const ok = (req.cookies && req.cookies.psp_admin === '1') || (req.headers.cookie || '').includes('psp_admin=1')
    if (!ok) return res.status(401).json({ error: 'unauthorized' })
    let body = req.body
    if (typeof body === 'string') { try { body = JSON.parse(body) } catch {} }
    const slug = String((body || {}).slug || '').trim()
    if (!slug) return res.status(400).json({ error: 'slug required' })
    const supabaseUrl = process.env.SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
    if (supabaseUrl && supabaseKey) {
      const client = createClient(supabaseUrl, supabaseKey)
      const row = { slug }
      if (body.imagePath) row.image = String(body.imagePath || '')
      if (body.image2) row.image2 = String(body.image2 || '')
      if (body.image3) row.image3 = String(body.image3 || '')
      if (body.thumbPlant) row.thumbPlant = String(body.thumbPlant || '')
      if (body.thumbCat) row.thumbCat = String(body.thumbCat || '')
      const { error } = await client.from('plant_images').upsert(row, { onConflict: 'slug' })
      if (error) return res.status(500).json({ error: String(error.message || error) })
      return res.status(200).json({ ok: true })
    }
    const fp = path.join(process.cwd(), 'content', 'plants', `${slug}.md`)
    let data = {}
    let content = ''
    if (fs.existsSync(fp)) {
      const raw = fs.readFileSync(fp, 'utf8')
      const parsed = matter(raw)
      data = parsed.data || {}
      content = parsed.content || ''
    } else {
      data = { title: slug, summary: '', toxicity_level: '' }
      content = ''
    }
    if (body.imagePath) data.image = String(body.imagePath || '')
    if (body.image2) data.image2 = String(body.image2 || '')
    if (body.image3) data.image3 = String(body.image3 || '')
    if (body.thumbPlant) data.thumbPlant = String(body.thumbPlant || '')
    if (body.thumbCat) data.thumbCat = String(body.thumbCat || '')
    const nextRaw = matter.stringify(content, data)
    try { fs.mkdirSync(path.dirname(fp), { recursive: true }) } catch {}
    fs.writeFileSync(fp, nextRaw)
    return res.status(200).json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) })
  }
}
