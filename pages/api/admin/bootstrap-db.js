import { Client } from 'pg'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const ok = (req.cookies && req.cookies.psp_admin === '1') || (req.headers.cookie || '').includes('psp_admin=1')
  if (!ok) return res.status(401).json({ error: 'unauthorized' })
  try {
    const conn = process.env.SUPABASE_DB_URL || ''
    if (!conn) return res.status(500).json({ error: 'SUPABASE_DB_URL missing' })
    const client = new Client({ connectionString: conn, ssl: { rejectUnauthorized: false } })
    await client.connect()
    const sql = `
      create table if not exists public.admin_credentials (
        username text primary key,
        hash text not null,
        salt text not null,
        iterations integer not null default 120000,
        algo text not null default 'pbkdf2-sha256',
        updated_at timestamptz
      );
      create table if not exists public.comments (
        id bigserial primary key,
        slug text not null,
        author text,
        content text not null,
        status text not null default 'pending',
        created_at timestamptz not null default now()
      );
      create table if not exists public.analytics (
        path text not null,
        date date not null,
        created_at timestamptz not null default now()
      );
    `
    await client.query(sql)
    await client.end()
    return res.status(200).json({ ok: true })
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) })
  }
}
