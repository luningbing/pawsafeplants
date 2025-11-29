import { Client } from 'pg'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const ok = (req.cookies && req.cookies.psp_admin === '1') || (req.headers.cookie || '').includes('psp_admin=1')
    if (!ok) return res.status(401).json({ error: 'unauthorized' })
    const supaUrl = process.env.SUPABASE_URL || ''
    const ref = (supaUrl.match(/https?:\/\/([^.]+)\.supabase\.co/) || [])[1] || ''
    const dbHost = ref ? `db.${ref}.supabase.co` : ''
    const has = {
      SUPABASE_DB_URL: Boolean(process.env.SUPABASE_DB_URL),
      DATABASE_URL: Boolean(process.env.DATABASE_URL),
      POSTGRES_URL: Boolean(process.env.POSTGRES_URL),
      POSTGRES_PRISMA_URL: Boolean(process.env.POSTGRES_PRISMA_URL),
      SUPABASE_URL: Boolean(process.env.SUPABASE_URL)
    }
    const candidates = [
      process.env.SUPABASE_DB_URL,
      process.env.SUPABASE_POOLER_URL,
      process.env.PGBOUNCER_URL,
      process.env.DATABASE_URL,
      process.env.POSTGRES_URL,
      process.env.POSTGRES_PRISMA_URL
    ].filter(Boolean)
    const chosen = candidates[0] ? (candidates[0].split('@')[1] || candidates[0]) : ''
    return res.status(200).json({ ok: true, has, example: dbHost ? `postgresql://postgres:<YOUR_PASSWORD>@${dbHost}:5432/postgres` : undefined, chosen })
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const ok = (req.cookies && req.cookies.psp_admin === '1') || (req.headers.cookie || '').includes('psp_admin=1')
  if (!ok) return res.status(401).json({ error: 'unauthorized' })
  try {
    const candidates = [
      process.env.SUPABASE_DB_URL,
      process.env.DATABASE_URL,
      process.env.POSTGRES_URL,
      process.env.POSTGRES_PRISMA_URL
    ].filter(Boolean)
    const conn = candidates[0] || ''
    if (!conn) {
      const supaUrl = process.env.SUPABASE_URL || ''
      const ref = (supaUrl.match(/https?:\/\/([^.]+)\.supabase\.co/) || [])[1] || ''
      const dbHost = ref ? `db.${ref}.supabase.co` : ''
      return res.status(500).json({
        error: 'SUPABASE_DB_URL missing',
        help: '在 Vercel 设置 SUPABASE_DB_URL=postgresql://postgres:<YOUR_PASSWORD>@<HOST>:5432/postgres',
        example: dbHost ? `postgresql://postgres:<YOUR_PASSWORD>@${dbHost}:5432/postgres` : undefined
      })
    }
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
      create table if not exists public.comment_replies (
        id bigserial primary key,
        comment_id bigint not null references public.comments(id) on delete cascade,
        author text,
        content text not null,
        created_at timestamptz not null default now()
      );
      create table if not exists public.analytics (
        path text not null,
        date date not null,
        created_at timestamptz not null default now()
      );
      create table if not exists public.site_config (
        key text primary key,
        value jsonb
      );
      create table if not exists public.plant_images (
        slug text primary key,
        image text,
        image2 text,
        image3 text,
        thumbPlant text,
        thumbCat text,
        updated_at timestamptz not null default now()
      );
    `
    await client.query(sql)
    await client.end()
    return res.status(200).json({ ok: true })
  } catch (e) {
    const msg = String(e?.message || e)
    if (msg.includes('ENOTFOUND')) {
      return res.status(500).json({
        error: msg,
        help: '无法解析数据库主机名。请在 Supabase Studio 复制官方 Connection string，或尝试 Connection pooling (端口 6543)。',
        hint_envs: ['SUPABASE_DB_URL','SUPABASE_POOLER_URL','PGBOUNCER_URL','DATABASE_URL','POSTGRES_URL','POSTGRES_PRISMA_URL']
      })
    }
    return res.status(500).json({ error: msg })
  }
}
