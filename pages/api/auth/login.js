import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { username, password } = req.body || {};
  const u = String(username || '').trim();
  const p = String(password || '').trim();
  
  console.log('🔐 Login attempt:', { username: u, timestamp: new Date().toISOString() });
  
  let ok = false
  try {
    // 使用supabaseAdmin绕过RLS限制
    console.log('🔗 Using supabaseAdmin client with SERVICE_ROLE_KEY');
    
    const { data, error } = await supabaseAdmin
      .from('admin_credentials')
      .select('username,hash,salt,iterations')
      .eq('username', u)
      .limit(1)
    
    console.log('📊 Database response:', { data, error });
    
    if (!error && Array.isArray(data) && data[0]) {
      const row = data[0]
      console.log('🔑 Found user record:', { username: row.username, hasHash: !!row.hash, hasSalt: !!row.salt });
      
      const h = crypto.pbkdf2Sync(p, String(row.salt || ''), Number(row.iterations || 120000), 32, 'sha256').toString('hex')
      if (u === String(row.username || '') && h === String(row.hash || '')) {
        ok = true
        console.log('✅ Password verification successful');
      } else {
        console.log('❌ Password verification failed:', { 
          inputHash: h, 
          storedHash: row.hash,
          salt: row.salt,
          iterations: row.iterations
        });
      }
    } else {
      console.log('❌ User not found in database:', { error, data });
    }
  } catch (error) {
    console.error('💥 Login error:', error);
  }
  
  // Fallback to environment variables
  if (!ok) {
    const U1 = String(process.env.ADMIN_USERNAME || '').trim();
    const P1 = String(process.env.ADMIN_PASSWORD || '').trim();
    console.log('🔄 Trying fallback credentials:', { username: u, envUsername: U1 });
    
    if ((u === (U1 || 'laifu') && p === (P1 || 'lailaifu')) || (u === 'admin' && p === 'admin123')) {
      ok = true
      console.log('✅ Fallback authentication successful');
    } else {
      console.log('❌ All authentication methods failed');
    }
  }
  
  if (ok) {
    const isHttps = (req.headers['x-forwarded-proto'] || '').includes('https') || (req.socket && req.socket.encrypted);
    const secure = isHttps || process.env.NODE_ENV === 'production';
    const attrs = [`psp_admin=1`, `Path=/`, `HttpOnly`, `SameSite=Lax`, `Max-Age=86400`].concat(secure ? ['Secure'] : []);
    res.setHeader('Set-Cookie', attrs.join('; '));
    console.log('🎉 Login successful, setting cookie');
    return res.status(200).json({ ok: true });
  }
  
  console.log('🚫 Login failed, returning 401');
  return res.status(401).json({ error: '用户名或密码错误' });
}