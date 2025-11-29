import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    const slug = String((req.query || {}).slug || '').trim()
    const supabaseUrl = process.env.SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
    if (supabaseUrl && supabaseKey) {
      const client = createClient(supabaseUrl, supabaseKey)
      let q = client.from('comments').select('id,slug,author,content,status,created_at').eq('status', 'approved').order('created_at', { ascending: true }).limit(100)
      if (slug) q = q.eq('slug', slug)
      const { data: rows, error } = await q
      if (error) return res.status(500).json({ error: String(error.message || error) })
      const ids = (rows || []).map(r => r.id)
      let replies = []
      if (ids.length) {
        const { data: rep, error: err2 } = await client.from('comment_replies').select('id,comment_id,author,content,created_at').in('comment_id', ids).order('created_at', { ascending: false })
        if (!err2) replies = rep || []
      }
      const grouped = Object.create(null)
      replies.forEach(r => {
        const k = r.comment_id
        if (!grouped[k]) grouped[k] = []
        grouped[k].push({ id: r.id, author: r.author || 'Admin', content: r.content, created_at: r.created_at })
      })
      const list = (rows || []).map(r => ({ id: r.id, slug: r.slug, author: r.author || 'Anonymous', content: r.content, is_approved: true, created_at: r.created_at, replies: grouped[r.id] || [] }))
      return res.status(200).json({ comments: list })
    }
    const fp = path.join(process.cwd(), 'content', 'comments.json')
    let j = { comments: [] }
    try { j = JSON.parse(fs.readFileSync(fp, 'utf8')) } catch {}
    let list = Array.isArray(j.comments) ? j.comments : []
    if (slug) list = list.filter(c => String(c.slug || '') === slug)
    list = list.filter(c => !!c.is_approved)
    list = list.slice(-100)
    return res.status(200).json({ comments: list })
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) })
  }
}
