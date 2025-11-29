import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    const ok = (req.cookies && req.cookies.psp_admin === '1') || (req.headers.cookie || '').includes('psp_admin=1')
    if (!ok) return res.status(401).json({ error: 'unauthorized' })
    let body = req.body
    if (typeof body === 'string') { try { body = JSON.parse(body) } catch {} }
    const id = String((body || {}).id || '').trim()
    const action = String((body || {}).action || '').trim()
    if (!id || !action) return res.status(400).json({ error: 'id and action required' })
    const supabaseUrl = process.env.SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
    if (supabaseUrl && supabaseKey) {
      const client = createClient(supabaseUrl, supabaseKey)
      if (action === 'approve') {
        const { error } = await client.from('comments').update({ status: 'approved' }).eq('id', Number(id))
        if (error) return res.status(500).json({ error: String(error.message || error) })
      } else if (action === 'delete') {
        const { error } = await client.from('comments').delete().eq('id', Number(id))
        if (error) return res.status(500).json({ error: String(error.message || error) })
      }
      return res.status(200).json({ ok: true })
    }
    const fp = path.join(process.cwd(), 'content', 'comments.json')
    let j = { comments: [] }
    try { j = JSON.parse(fs.readFileSync(fp, 'utf8')) } catch {}
    const arr = Array.isArray(j.comments) ? j.comments : []
    const idx = arr.findIndex(c => String(c.id || '') === id)
    if (idx === -1) return res.status(404).json({ error: 'not found' })
    if (action === 'approve') { arr[idx].is_approved = true }
    if (action === 'delete') { arr.splice(idx, 1) }
    try { fs.mkdirSync(path.dirname(fp), { recursive: true }) } catch {}
    fs.writeFileSync(fp, JSON.stringify({ comments: arr }, null, 2))
    return res.status(200).json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) })
  }
}
