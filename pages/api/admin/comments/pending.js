import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    const ok = (req.cookies && req.cookies.psp_admin === '1') || (req.headers.cookie || '').includes('psp_admin=1')
    if (!ok) return res.status(401).json({ error: 'unauthorized' })
    const supabaseUrl = process.env.SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
    if (supabaseUrl && supabaseKey) {
      const client = createClient(supabaseUrl, supabaseKey)
      const { data, error } = await client.from('comments').select('id,slug,author,content,status,created_at').eq('status', 'pending').order('created_at', { ascending: true }).limit(200)
      if (error) return res.status(500).json({ error: String(error.message || error) })
      const list = (data || []).map(r => ({ id: r.id, slug: r.slug, author: r.author || 'Anonymous', content: r.content, is_approved: false, created_at: r.created_at }))
      return res.status(200).json({ comments: list })
    }
    const fp = path.join(process.cwd(), 'content', 'comments.json')
    let j = { comments: [] }
    try { j = JSON.parse(fs.readFileSync(fp, 'utf8')) } catch {}
    const pending = (j.comments || []).filter(c => !c.is_approved)
    return res.status(200).json({ comments: pending })
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) })
  }
}
