import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    // 禁用缓存，确保获取最新数据
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    console.log('🔧 site-config API 开始处理请求...');
    console.log('📋 环境变量检查:', {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    });
    
    const fp = path.join(process.cwd(), 'content', 'site.json')
    if (req.method === 'GET') {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      
      console.log('🔧 获取site-config配置...');
      console.log('📋 Supabase配置:', { 
        url: supabaseUrl ? '已配置' : '未配置',
        key: supabaseKey ? '已配置' : '未配置'
      });
      
      if (supabaseUrl && supabaseKey) {
        try {
          const client = createClient(supabaseUrl, supabaseKey, {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          })
          
          console.log('🔗 尝试连接数据库...');
          
          const { data, error } = await client.from('site_config').select('key,value').in('key', ['heroImage','logo'])
          
          if (error) {
            console.error('❌ 数据库查询错误:', {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            });
            
            // 检查是否是权限问题
            if (error.message?.includes('permission denied') || error.code === '42501') {
              console.error('🚨 权限拒绝: 需要检查RLS策略');
              // 不返回错误，而是使用本地文件作为fallback
            }
            
            // 检查是否是表不存在
            if (error.message?.includes('does not exist') || error.code === '42P01') {
              console.error('🚨 表不存在: site_config表需要创建');
              // 不返回错误，而是使用本地文件作为fallback
            }
            
            // 其他数据库错误也使用本地文件作为fallback
            console.warn('⚠️ 数据库查询失败，使用本地文件作为fallback:', error?.message);
          } else {
            const map = Object.create(null)
            ;(data || []).forEach(r => { map[r.key] = r.value })
            console.log('✅ 从数据库获取配置:', { heroImage: map.heroImage, logo: map.logo });
            return res.status(200).json({ 
              heroImage: String((map.heroImage || '')).trim(), 
              logo: String((map.logo || '')).trim(),
              data_source: 'database'
            })
          }
        } catch (dbError) {
          console.error('❌ 数据库连接失败:', {
            message: dbError.message,
            stack: dbError.stack
          });
          
          // 检查是否是环境变量问题
          if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error('🚨 环境变量缺失: SUPABASE_URL或SUPABASE_SERVICE_ROLE_KEY未配置');
            // 使用本地文件作为fallback
          }
          
          // 任何数据库连接错误都使用本地文件作为fallback
          console.warn('⚠️ 数据库连接失败，使用本地文件作为fallback:', dbError?.message);
        }
      } else {
        console.error('🚨 Supabase配置缺失: URL或Key未配置');
      }
      
      // 读取本地配置文件作为fallback
      try {
        const j = JSON.parse(fs.readFileSync(fp, 'utf8'))
        console.log('📁 使用本地配置文件:', j);
        return res.status(200).json({
          ...j,
          data_source: 'local_file'
        })
      } catch (fileError) {
        console.warn('⚠️ 本地配置文件读取失败，使用默认值:', fileError?.message);
        return res.status(200).json({ 
          heroImage: '', 
          logo: '',
          data_source: 'default'
        })
      }
    }
    if (req.method === 'POST') {
      const ok = (req.cookies && req.cookies.psp_admin === '1') || (req.headers.cookie || '').includes('psp_admin=1')
      if (!ok) return res.status(401).json({ error: 'unauthorized' })
      let body = req.body
      if (typeof body === 'string') { try { body = JSON.parse(body) } catch {} }
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      if (supabaseUrl && supabaseKey) {
        try {
          const client = createClient(supabaseUrl, supabaseKey, {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          })
          
          const items = []
          if (Object.prototype.hasOwnProperty.call(body || {}, 'heroImage')) items.push({ key: 'heroImage', value: String((body || {}).heroImage || '').trim() })
          if (Object.prototype.hasOwnProperty.call(body || {}, 'logo')) items.push({ key: 'logo', value: String((body || {}).logo || '').trim() })
          
          if (items.length) {
            const { error } = await client.from('site_config').upsert(items, { onConflict: 'key' })
            if (error) {
              console.error('❌ 更新site_config失败:', error);
              return res.status(500).json({ error: String(error.message || error) })
            }
            console.log('✅ site_config更新成功')
          }
          
          const { data } = await client.from('site_config').select('key,value').in('key', ['heroImage','logo'])
          const map = Object.create(null)
          ;(data || []).forEach(r => { map[r.key] = r.value })
          return res.status(200).json({ heroImage: String((map.heroImage || '')).trim(), logo: String((map.logo || '')).trim() })
        } catch (dbError) {
          console.error('❌ POST数据库操作失败:', dbError);
          return res.status(500).json({ error: 'Database operation failed' })
        }
      }
      let prev = { heroImage: '', logo: '' }
      try {
        prev = JSON.parse(fs.readFileSync(fp, 'utf8'))
      } catch {}
      const hasHero = Object.prototype.hasOwnProperty.call(body || {}, 'heroImage')
      const hasLogo = Object.prototype.hasOwnProperty.call(body || {}, 'logo')
      const heroImage = hasHero ? String((body || {}).heroImage || '').trim() : String(prev.heroImage || '')
      const logo = hasLogo ? String((body || {}).logo || '').trim() : String(prev.logo || '')
      const next = { heroImage, logo }
      try { fs.mkdirSync(path.dirname(fp), { recursive: true }) } catch {}
      fs.writeFileSync(fp, JSON.stringify(next, null, 2))
      return res.status(200).json(next)
    }
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    console.error('site-config API error:', e);
    return res.status(200).json({ 
      heroImage: '', 
      logo: '',
      error_fallback: true,
      error_message: String(e?.message || e)
    });
  }
}
