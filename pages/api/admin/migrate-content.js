import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    const ok = (req.cookies && req.cookies.psp_admin === '1') || (req.headers.cookie || '').includes('psp_admin=1')
    if (!ok) return res.status(401).json({ error: 'unauthorized' })
    const supabaseUrl = process.env.SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Supabase env missing', hint: ['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY'] })
    }
    const client = createClient(supabaseUrl, supabaseKey)
    let siteKeys = 0
    try {
      const fp = path.join(process.cwd(), 'content', 'site.json')
      let j = { heroImage: '', logo: '' }
      try { j = JSON.parse(fs.readFileSync(fp, 'utf8')) } catch {}
      const items = []
      if (Object.prototype.hasOwnProperty.call(j, 'heroImage')) items.push({ key: 'heroImage', value: String(j.heroImage || '') })
      if (Object.prototype.hasOwnProperty.call(j, 'logo')) items.push({ key: 'logo', value: String(j.logo || '') })
      if (items.length) {
        const { error } = await client.from('site_config').upsert(items, { onConflict: 'key' })
        if (error) throw error
        siteKeys = items.length
      }
    } catch (e) {
      // continue
    }
    let plantsUpserted = 0
    try {
      const dir = path.join(process.cwd(), 'content', 'plants')
      let files = []
      try { files = fs.readdirSync(dir).filter(f => f.endsWith('.md')) } catch {}
      for (const f of files) {
        const fp = path.join(dir, f)
        try {
          const raw = fs.readFileSync(fp, 'utf8')
          const { data } = matter(raw)
          const slug = path.basename(fp).replace(/\.md$/, '')
          const row = {
            slug,
            image: String(data.image || ''),
            image2: String(data.image2 || ''),
            image3: String(data.image3 || ''),
            thumbPlant: String(data.thumbPlant || ''),
            thumbCat: String(data.thumbCat || '')
          }
          const { error } = await client.from('plant_images').upsert(row, { onConflict: 'slug' })
          if (error) throw error
          plantsUpserted++
        } catch {}
      }
    } catch (e) {
      // continue
    }
    return res.status(200).json({ ok: true, site_keys: siteKeys, plants_upserted: plantsUpserted })
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) })
  }
}

