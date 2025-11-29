import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { Client as PgClient } from 'pg'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const ok = (req.cookies && req.cookies.psp_admin === '1') || (req.headers.cookie || '').includes('psp_admin=1')
  if (!ok) return res.status(401).json({ error: 'unauthorized' })
  try {
    let body = req.body
    if (typeof body === 'string') { try { body = JSON.parse(body) } catch {} }
    const username = String(body?.username || '').trim().slice(0, 60)
    const password = String(body?.password || '').trim()
    if (!username || !password) return res.status(400).json({ error: 'username and password required' })
    const salt = crypto.randomBytes(16).toString('hex')
    const iterations = 120000
    const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256').toString('hex')
    const supabaseUrl = process.env.SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
    const validSupa = /^https?:\/\//.test(supabaseUrl) && Boolean(supabaseKey)
    if (validSupa) {
      const client = createClient(supabaseUrl, supabaseKey)
      const now = new Date().toISOString()
      const { error } = await client
        .from('admin_credentials')
        .upsert({ username, hash, salt, iterations, algo: 'pbkdf2-sha256', updated_at: now })
      if (error) return res.status(500).json({ error: String(error.message || error) })
      return res.status(200).json({ ok: true })
    }
    const connCandidates = [
      process.env.SUPABASE_DB_URL,
      process.env.SUPABASE_POOLER_URL,
      process.env.PGBOUNCER_URL,
      process.env.DATABASE_URL,
      process.env.POSTGRES_URL,
      process.env.POSTGRES_PRISMA_URL
    ].filter(Boolean)
    const conn = connCandidates[0] || ''
    if (conn) {
      const client = new PgClient({ connectionString: conn, ssl: { rejectUnauthorized: false } })
      await client.connect()
      const now = new Date().toISOString()
      const sql = `
        create table if not exists public.admin_credentials (
          username text primary key,
          hash text not null,
          salt text not null,
          iterations integer not null default 120000,
          algo text not null default 'pbkdf2-sha256',
          updated_at timestamptz
        );
        insert into public.admin_credentials (username, hash, salt, iterations, algo, updated_at)
        values ($1, $2, $3, $4, $5, $6)
        on conflict (username)
        do update set hash = excluded.hash, salt = excluded.salt, iterations = excluded.iterations, algo = excluded.algo, updated_at = excluded.updated_at;
      `
      await client.query(sql, [username, hash, salt, iterations, 'pbkdf2-sha256', now])
      await client.end()
      return res.status(200).json({ ok: true })
    }
    const fp = path.join(process.cwd(), 'content', 'admin.json')
    const data = { username, hash, salt, iterations, algo: 'pbkdf2-sha256' }
    try { if (!fs.existsSync(path.dirname(fp))) fs.mkdirSync(path.dirname(fp), { recursive: true }) } catch {}
    fs.writeFileSync(fp, JSON.stringify(data, null, 2))
    return res.status(200).json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) })
  }
}
