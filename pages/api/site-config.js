import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    const fp = path.join(process.cwd(), 'content', 'site.json')
    if (req.method === 'GET') {
      const supabaseUrl = process.env.SUPABASE_URL || ''
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
      if (supabaseUrl && supabaseKey) {
        const client = createClient(supabaseUrl, supabaseKey)
        const { data, error } = await client.from('site_config').select('key,value').in('key', ['heroImage','logo'])
        if (!error) {
          const map = Object.create(null)
          (data || []).forEach(r => { map[r.key] = r.value })
          return res.status(200).json({ heroImage: String((map.heroImage || '')).trim(), logo: String((map.logo || '')).trim() })
        }
      }
      try {
        const j = JSON.parse(fs.readFileSync(fp, 'utf8'))
        return res.status(200).json(j)
      } catch {
        return res.status(200).json({ heroImage: '', logo: '' })
      }
    }
    if (req.method === 'POST') {
      const ok = (req.cookies && req.cookies.psp_admin === '1') || (req.headers.cookie || '').includes('psp_admin=1')
      if (!ok) return res.status(401).json({ error: 'unauthorized' })
      let body = req.body
      if (typeof body === 'string') { try { body = JSON.parse(body) } catch {} }
      const supabaseUrl = process.env.SUPABASE_URL || ''
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
      if (supabaseUrl && supabaseKey) {
        const client = createClient(supabaseUrl, supabaseKey)
        const items = []
        if (Object.prototype.hasOwnProperty.call(body || {}, 'heroImage')) items.push({ key: 'heroImage', value: String((body || {}).heroImage || '').trim() })
        if (Object.prototype.hasOwnProperty.call(body || {}, 'logo')) items.push({ key: 'logo', value: String((body || {}).logo || '').trim() })
        if (items.length) {
          const { error } = await client.from('site_config').upsert(items, { onConflict: 'key' })
          if (error) return res.status(500).json({ error: String(error.message || error) })
        }
        const { data } = await client.from('site_config').select('key,value').in('key', ['heroImage','logo'])
        const map = Object.create(null)
        (data || []).forEach(r => { map[r.key] = r.value })
        return res.status(200).json({ heroImage: String((map.heroImage || '')).trim(), logo: String((map.logo || '')).trim() })
      }
      let prev = { heroImage: '', logo: '' }
      try {
        prev = JSON.parse(fs.readFileSync(fp, 'utf8'))
      } catch {}
      const hasHero = Object.prototype.hasOwnProperty.call(body || {}, 'heroImage')
      const hasLogo = Object.prototype.hasOwnProperty.call(body || {}, 'logo')
      const heroImage = hasHero ? String((body || {}).heroImage || '').trim() : String(prev.heroImage || '')
      const logo = hasLogo ? String((body || {}).logo || '').trim() : String(prev.logo || '')
      const next = { heroImage, logo }
      try { fs.mkdirSync(path.dirname(fp), { recursive: true }) } catch {}
      fs.writeFileSync(fp, JSON.stringify(next, null, 2))
      return res.status(200).json(next)
    }
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) })
  }
}
