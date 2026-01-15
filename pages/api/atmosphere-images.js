import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export default async function handler(req, res) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // 使用服务角色客户端确保有足够权限
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('🌫️ 获取氛围图数据...');

    // 获取氛围图
    let data, error;
    try {
      const result = await supabase
        .from('media_metadata')
        .select('file_path, display_name, created_at')
        .eq('is_atmosphere', true)
        .order('created_at', { ascending: false })
        .limit(8); // 限制最多8张氛围图
      
      data = result.data;
      error = result.error;
    } catch (dbError) {
      console.error('❌ 数据库查询失败:', dbError);
      data = null;
      error = dbError;
    }

    // 如果数据库出错，返回默认图片而不是500错误
    if (error) {
      console.warn('⚠️ 数据库查询失败，使用默认图片:', error.message);
      const defaultImages = [
        {
          url: '/images/hero/cat-main.jpg',
          title: 'Cozy Cat Corner',
          createdAt: new Date().toISOString()
        },
        {
          url: '/images/hero/cat-main.jpg',
          title: 'Happy Cat Home',
          createdAt: new Date().toISOString()
        },
        {
          url: '/images/hero/cat-main.jpg',
          title: 'Pet-Friendly Plants',
          createdAt: new Date().toISOString()
        },
        {
          url: '/images/hero/cat-main.jpg',
          title: 'Cat Safe Garden',
          createdAt: new Date().toISOString()
        },
        {
          url: '/images/hero/cat-main.jpg',
          title: 'Cozy Living Room',
          createdAt: new Date().toISOString()
        },
        {
          url: '/images/hero/cat-main.jpg',
          title: 'Happy Cat Home',
          createdAt: new Date().toISOString()
        },
        {
          url: '/images/hero/cat-main.jpg',
          title: 'Pet-Friendly Plants',
          createdAt: new Date().toISOString()
        }
      ];
      
      return res.status(200).json({ 
        atmosphere_images: defaultImages,
        count: defaultImages.length 
      });
    }

    const atmosphereImages = (data || []).map(img => ({
      url: img.file_path || img.url || '/images/hero/cat-main.jpg',
      title: img.display_name || 'Atmosphere Image',
      createdAt: img.created_at
    }));

    console.log(`✅ 成功获取 ${atmosphereImages.length} 张氛围图`);

    return res.status(200).json({ 
      atmosphere_images: atmosphereImages,
      count: atmosphereImages.length 
    });

  } catch (error) {
    console.error('🌫️ Atmosphere images API error:', error);
    // 返回空数组而不是500错误，确保页面不会白屏
    return res.status(200).json({ 
      atmosphere_images: [],
      count: 0,
      error: 'Service temporarily unavailable',
      fallback_used: true
    });
  }
}
