import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'POST') {
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

    // 确保blog-images桶存在
    try {
      await supabase.storage.createBucket('blog-images', { 
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      });
      console.log('✅ blog-images桶创建成功');
    } catch (error) {
      console.log('📋 blog-images桶已存在或创建失败:', error.message);
    }

    const { file, title, content, tags } = req.body;

    if (!file || !title || !content) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['file', 'title', 'content']
      });
    }

    // 解析base64图片数据
    const base64Data = file.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // 生成文件名
    const timestamp = Date.now();
    const filename = `blog-${timestamp}.jpg`;
    
    console.log('📤 上传博客图片到blog-images桶...');

    // 上传到Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filename, buffer, {
        contentType: 'image/jpeg',
        cacheControl: '31536000', // 1年缓存
        upsert: true
      });

    if (uploadError) {
      console.error('❌ 图片上传失败:', uploadError);
      return res.status(500).json({ 
        error: 'Image upload failed',
        details: uploadError.message 
      });
    }

    // 获取公共URL
    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filename);

    const imageUrl = urlData.publicUrl;
    console.log('✅ 图片上传成功:', imageUrl);

    // 在media_metadata表中记录
    try {
      const { error: metaError } = await supabase
        .from('media_metadata')
        .insert({
          file_path: imageUrl,
          display_name: `博客封面 - ${title}`,
          file_type: 'blog_cover',
          created_at: new Date().toISOString()
        });

      if (metaError) {
        console.warn('⚠️ media_metadata记录失败:', metaError.message);
      } else {
        console.log('✅ media_metadata记录成功');
      }
    } catch (error) {
      console.warn('⚠️ media_metadata记录异常:', error.message);
    }

    // 创建博客文章
    try {
      const tagsArray = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [];
      
      const { data: blogData, error: blogError } = await supabase
        .from('blog_posts')
        .insert({
          title: title.trim(),
          content: content.trim(),
          cover_image_url: imageUrl,
          tags: tagsArray,
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (blogError) {
        console.error('❌ 博客创建失败:', blogError);
        return res.status(500).json({ 
          error: 'Blog creation failed',
          details: blogError.message 
        });
      }

      console.log('✅ 博客创建成功:', blogData.id);

      return res.status(200).json({
        success: true,
        data: {
          blog: blogData,
          image_url: imageUrl
        }
      });

    } catch (error) {
      console.error('❌ 博客创建异常:', error);
      return res.status(500).json({ 
        error: 'Blog creation failed',
        details: error.message 
      });
    }

  } catch (error) {
    console.error('🚨 Blog upload API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
