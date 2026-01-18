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

    console.log('🌫️ atmosphere-images API 开始处理请求...');
    console.log('📋 环境变量检查:', {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    });

    // 使用服务角色客户端确保有足够权限
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    
    console.log('📋 Supabase配置:', { 
      url: supabaseUrl ? '已配置' : '未配置',
      key: supabaseKey ? '已配置' : '未配置'
    });

    if (!supabaseUrl || !supabaseKey) {
      console.error('🚨 Supabase配置缺失: URL或Key未配置');
      return res.status(200).json({ 
        atmosphere_images: [],
        count: 0,
        error_type: 'environment_missing',
        error_message: 'Supabase环境变量缺失，请检查NEXT_PUBLIC_SUPABASE_URL和SUPABASE_SERVICE_ROLE_KEY'
      });
    }

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
      console.log('🔗 尝试连接数据库...');
      
      const result = await supabase
        .from('media_metadata')
        .select('file_path, display_name, created_at')
        .eq('is_atmosphere', true)
        .order('created_at', { ascending: false })
        .limit(8); // 限制最多8张氛围图
      
      data = result.data;
      error = result.error;
      
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
          return res.status(200).json({ 
            atmosphere_images: [],
            count: 0,
            error_type: 'permission_denied',
            error_message: 'RLS权限问题，需要配置匿名访问策略',
            error_details: error.message
          });
        }
        
        // 检查是否是表不存在
        if (error.message?.includes('does not exist') || error.code === '42P01') {
          console.error('🚨 表不存在: media_metadata表需要创建');
          return res.status(200).json({ 
            atmosphere_images: [],
            count: 0,
            error_type: 'table_not_found',
            error_message: 'media_metadata表不存在，需要创建表和RLS策略',
            error_details: error.message
          });
        }
      }
      
    } catch (dbError) {
      console.error('❌ 数据库连接失败:', {
        message: dbError.message,
        stack: dbError.stack
      });
      
      // 检查是否是环境变量问题
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('🚨 环境变量缺失: SUPABASE_URL或SUPABASE_SERVICE_ROLE_KEY未配置');
        return res.status(200).json({ 
          atmosphere_images: [],
          count: 0,
          error_type: 'environment_missing',
          error_message: '环境变量缺失，请检查SUPABASE_URL和SUPABASE_SERVICE_ROLE_KEY',
          error_details: dbError.message
        });
      }
      
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
        count: defaultImages.length,
        data_source: 'default_images',
        error_type: 'database_error',
        error_message: '数据库查询失败，使用默认图片',
        error_details: error.message
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
      count: atmosphereImages.length,
      data_source: 'database'
    });

  } catch (error) {
    console.error('🌫️ Atmosphere images API error:', {
      message: error.message,
      stack: error.stack
    });
    // 返回空数组而不是500错误，确保页面不会白屏
    return res.status(200).json({ 
      atmosphere_images: [],
      count: 0,
      error_type: 'api_error',
      error_message: 'API服务异常',
      error_details: error.message,
      fallback_used: true
    });
  }
}
