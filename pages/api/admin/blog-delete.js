import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'DELETE') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // 验证管理员权限
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
      if (!decoded.username) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Blog ID is required' });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // 先获取博客信息，包括封面图片URL
    const { data: blogData, error: fetchError } = await supabase
      .from('blog_posts')
      .select('cover_image_url')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('❌ 获取博客信息失败:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch blog' });
    }

    // 删除博客记录
    const { error: deleteError } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('❌ 删除博客失败:', deleteError);
      return res.status(500).json({ error: 'Failed to delete blog' });
    }

    // 如果有封面图片，尝试删除media_metadata中的记录
    if (blogData?.cover_image_url) {
      try {
        const { error: metaDeleteError } = await supabase
          .from('media_metadata')
          .delete()
          .eq('file_path', blogData.cover_image_url);

        if (metaDeleteError) {
          console.warn('⚠️ 删除media_metadata记录失败:', metaDeleteError.message);
        } else {
          console.log('✅ media_metadata记录删除成功');
        }
      } catch (error) {
        console.warn('⚠️ 删除media_metadata记录异常:', error.message);
      }

      // 可选：删除Storage中的图片文件
      try {
        const fileName = blogData.cover_image_url.split('/').pop();
        const { error: storageDeleteError } = await supabase.storage
          .from('blog-images')
          .remove([fileName]);

        if (storageDeleteError) {
          console.warn('⚠️ 删除Storage图片失败:', storageDeleteError.message);
        } else {
          console.log('✅ Storage图片删除成功');
        }
      } catch (error) {
        console.warn('⚠️ 删除Storage图片异常:', error.message);
      }
    }

    console.log('✅ 博客删除成功:', id);

    return res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });

  } catch (error) {
    console.error('🚨 Blog delete API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
