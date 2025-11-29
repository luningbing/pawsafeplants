import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
    if (supabaseUrl && supabaseKey) {
      const client = createClient(supabaseUrl, supabaseKey)
      // ensure bucket exists
      try { await client.storage.createBucket('uploads', { public: true }) } catch {}
      const { data, error } = await client.storage.from('uploads').list('', { limit: 1000 })
      if (error) return res.status(500).json({ error: String(error.message || error) })
      const origin = process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl
      const paths = (data || []).filter(f => !/\/$/.test(f.name)).map(f => origin.replace(/\/$/, '') + '/storage/v1/object/public/uploads/' + f.name)
      return res.status(200).json({ paths })
    }
    const dir = path.join(process.cwd(), 'public', 'uploads')
    let files = []
    try { files = fs.readdirSync(dir) } catch {}
    const paths = files.filter(f => !/\.(tmp|part)$/i.test(f)).map(f => '/uploads/' + f)
    return res.status(200).json({ paths })
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) })
  }
}
