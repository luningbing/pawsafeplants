import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

function genId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    let body = req.body
    if (typeof body === 'string') { try { body = JSON.parse(body) } catch {} }
    const slug = String((body || {}).slug || '').trim().slice(0, 120)
    const user_name = String((body || {}).user_name || '').trim().slice(0, 80)
    const content = String((body || {}).content || '').trim().slice(0, 2000)
    if (!slug || !content) return res.status(400).json({ error: 'slug and content required' })
    const supabaseUrl = process.env.SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
    if (supabaseUrl && supabaseKey) {
      const client = createClient(supabaseUrl, supabaseKey)
      const { error } = await client.from('comments').insert({ slug, author: user_name || 'Anonymous', content, status: 'pending' })
      if (error) return res.status(500).json({ error: String(error.message || error) })
      return res.status(200).json({ ok: true })
    }
    const fp = path.join(process.cwd(), 'content', 'comments.json')
    let j = { comments: [] }
    try { j = JSON.parse(fs.readFileSync(fp, 'utf8')) } catch {}
    const arr = Array.isArray(j.comments) ? j.comments : []
    const row = { id: genId(), slug, author: user_name || 'Anonymous', content, is_approved: false, created_at: new Date().toISOString() }
    arr.push(row)
    try { fs.mkdirSync(path.dirname(fp), { recursive: true }) } catch {}
    fs.writeFileSync(fp, JSON.stringify({ comments: arr }, null, 2))
    return res.status(200).json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) })
  }
}
