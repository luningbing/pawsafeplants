import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    let body = req.body
    if (typeof body === 'string') { try { body = JSON.parse(body) } catch {} }
    const url = String(body?.url || '').trim()
    let filename = String(body?.filename || '').trim().replace(/[^a-zA-Z0-9._-]/g, '_')
    if (!/^https?:\/\//.test(url)) return res.status(400).json({ error: 'url required (http/https)' })
    const r = await fetch(url)
    if (!r.ok) return res.status(500).json({ error: `fetch failed: ${r.status}` })
    const ct = r.headers.get('content-type') || ''
    const buf = Buffer.from(await r.arrayBuffer())
    const ext = filename && path.extname(filename) ? '' : (ct.includes('png') ? '.png' : ct.includes('svg') ? '.svg' : ct.includes('webp') ? '.webp' : '.jpg')
    if (!filename) filename = 'hero-' + Date.now() + ext
    const supabaseUrl = process.env.SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
    if (supabaseUrl && supabaseKey) {
      const client = createClient(supabaseUrl, supabaseKey)
      try { await client.storage.createBucket('uploads', { public: true }) } catch {}
      const { error } = await client.storage.from('uploads').upload(filename, buf, { contentType: ct || 'application/octet-stream', upsert: true })
      if (error) return res.status(500).json({ error: String(error.message || error) })
      const origin = process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl
      return res.status(200).json({ path: origin.replace(/\/$/, '') + '/storage/v1/object/public/uploads/' + filename })
    }
    const pub = path.join(process.cwd(), 'public', 'uploads')
    try { if (!fs.existsSync(pub)) fs.mkdirSync(pub, { recursive: true }) } catch {}
    const fp = path.join(pub, filename)
    fs.writeFileSync(fp, buf)
    const rel = '/uploads/' + filename
    return res.status(200).json({ path: rel })
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) })
  }
}
