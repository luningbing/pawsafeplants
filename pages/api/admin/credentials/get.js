import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const ok = (req.cookies && req.cookies.psp_admin === '1') || (req.headers.cookie || '').includes('psp_admin=1')
  if (!ok) return res.status(401).json({ error: 'unauthorized' })
  try {
    const supabaseUrl = process.env.SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
    if (supabaseUrl && supabaseKey) {
      const client = createClient(supabaseUrl, supabaseKey)
      const { data, error } = await client
        .from('admin_credentials')
        .select('username')
        .limit(1)
      if (error) return res.status(500).json({ error: String(error.message || error) })
      const row = Array.isArray(data) && data[0] ? data[0] : {}
      return res.status(200).json({ username: String(row.username || '') })
    }
    const fp = path.join(process.cwd(), 'content', 'admin.json')
    let u = ''
    try {
      const raw = fs.readFileSync(fp, 'utf8')
      const j = JSON.parse(raw)
      u = String(j.username || '')
    } catch {}
    return res.status(200).json({ username: u })
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) })
  }
}