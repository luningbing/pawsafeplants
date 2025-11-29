import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

function parseDataUrl(s) {
  const m = String(s || '').match(/^data:(.+?);base64,(.+)$/)
  if (!m) return { mime: '', buf: Buffer.from([]) }
  const mime = m[1]
  const buf = Buffer.from(m[2], 'base64')
  return { mime, buf }
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    let body = req.body
    if (typeof body === 'string') { try { body = JSON.parse(body) } catch {} }
    const filename = String((body || {}).filename || '').trim().replace(/[^a-zA-Z0-9._-]/g, '_')
    const data = String((body || {}).data || '')
    const { mime, buf } = parseDataUrl(data)
    const ext = path.extname(filename) || (mime.includes('png') ? '.png' : mime.includes('svg') ? '.svg' : mime.includes('webp') ? '.webp' : '.jpg')
    const name = (filename ? filename.replace(/\.[^.]+$/, '') : ('upload-' + Date.now())) + ext
    const supabaseUrl = process.env.SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
    if (supabaseUrl && supabaseKey) {
      const client = createClient(supabaseUrl, supabaseKey)
      try { await client.storage.createBucket('uploads', { public: true }) } catch {}
      const { error } = await client.storage.from('uploads').upload(name, buf, { contentType: mime || 'application/octet-stream', upsert: true })
      if (error) return res.status(500).json({ error: String(error.message || error) })
      const origin = process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl
      return res.status(200).json({ path: origin.replace(/\/$/, '') + '/storage/v1/object/public/uploads/' + name })
    }
    const dir = path.join(process.cwd(), 'public', 'uploads')
    try { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }) } catch {}
    fs.writeFileSync(path.join(dir, name), buf)
    return res.status(200).json({ path: '/uploads/' + name })
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) })
  }
}
