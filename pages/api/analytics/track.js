import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

function today() {
  return new Date().toISOString().slice(0, 10)
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    let body = req.body
    if (typeof body === 'string') { try { body = JSON.parse(body) } catch {} }
    const page_path = String((body || {}).page_path || '').slice(0, 300)
    const referrer = String((body || {}).referrer || '').slice(0, 500)
    const ua = String((req.headers || {})['user-agent'] || '').slice(0, 300)
    const ip = String((req.headers || {})['x-forwarded-for'] || '').split(',')[0].trim()
    const supabaseUrl = process.env.SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
    if (supabaseUrl && supabaseKey) {
      const client = createClient(supabaseUrl, supabaseKey)
      await client.from('analytics').insert({ path: page_path || '/', date: today() })
      return res.status(200).json({ ok: true })
    }
    const fp = path.join(process.cwd(), 'content', 'analytics.json')
    let j = { views: {} }
    try { j = JSON.parse(fs.readFileSync(fp, 'utf8')) } catch {}
    const d = today()
    j.views[d] = Number(j.views[d] || 0) + 1
    try { fs.mkdirSync(path.dirname(fp), { recursive: true }) } catch {}
    fs.writeFileSync(fp, JSON.stringify(j, null, 2))
    return res.status(200).json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) })
  }
}
