import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

function lastNDays(n) {
  const out = []
  for (let i = 0; i < n; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    out.push(d.toISOString().slice(0, 10))
  }
  return out.reverse()
}

export default async function handler(req, res) {
  try {
    const days = Math.max(1, Math.min(90, Number((req.query || {}).days || 30)))
    const supabaseUrl = process.env.SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
    if (supabaseUrl && supabaseKey) {
      const client = createClient(supabaseUrl, supabaseKey)
      const dates = lastNDays(days)
      const { data, error } = await client.from('analytics').select('date').gte('date', dates[0]).lte('date', dates[dates.length - 1])
      if (error) return res.status(500).json({ error: String(error.message || error) })
      const counts = Object.create(null)
      (data || []).forEach(r => { const d = String(r.date).slice(0,10); counts[d] = Number(counts[d] || 0) + 1 })
      const stats = dates.map(date => ({ date, count: Number(counts[date] || 0) }))
      return res.status(200).json({ stats })
    }
    const fp = path.join(process.cwd(), 'content', 'analytics.json')
    let j = { views: {} }
    try { j = JSON.parse(fs.readFileSync(fp, 'utf8')) } catch {}
    const dates = lastNDays(days)
    const stats = dates.map(date => ({ date, count: Number((j.views || {})[date] || 0) }))
    return res.status(200).json({ stats })
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) })
  }
}
