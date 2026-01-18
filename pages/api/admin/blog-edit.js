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

    if (req.method === 'GET') {
      // 获取博客详情
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Blog ID is required' });
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ 获取博客详情失败:', error);
        return res.status(500).json({ error: 'Failed to fetch blog' });
      }

      return res.status(200).json({
        success: true,
        data: data
      });
    }

    if (req.method === 'POST') {
      // 上传画廊图片
      const { blogId, position, title, description, file } = req.body;

      if (!blogId || !position || !file) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          required: ['blogId', 'position', 'file']
        });
      }

      // 解析base64图片数据
      const base64Data = file.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      // 生成文件名
      const timestamp = Date.now();
      const filename = `gallery-${position}-${timestamp}.jpg`;
      
      console.log('📤 上传画廊图片到blog-images桶...');

      // 上传到Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filename, buffer, {
          contentType: 'image/jpeg',
          cacheControl: '31536000', // 1年缓存
          upsert: true
        });

      if (uploadError) {
        console.error('❌ 画廊图片上传失败:', uploadError);
        return res.status(500).json({ 
          error: 'Gallery image upload failed',
          details: uploadError.message 
        });
      }

      // 获取公共URL
      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filename);

      const imageUrl = urlData.publicUrl;
      console.log('✅ 画廊图片上传成功:', imageUrl);

      // 在media_metadata表中记录
      try {
        const { error: metaError } = await supabase
          .from('media_metadata')
          .insert({
            file_path: imageUrl,
            display_name: `博客画廊 - ${title}`,
            file_type: 'blog_gallery',
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

      // 更新博客的gallery_images字段
      try {
        // 先获取现有的gallery_images
        const { data: existingBlog, error: fetchError } = await supabase
          .from('blog_posts')
          .select('gallery_images')
          .eq('id', blogId)
          .single();

        if (fetchError) {
          console.error('❌ 获取现有博客失败:', fetchError);
          return res.status(500).json({ error: 'Failed to fetch existing blog' });
        }

        const currentGallery = existingBlog.gallery_images || [];
        const newGalleryImage = {
          position,
          title,
          description,
          url: imageUrl
        };

        // 更新或添加图片
        const updatedGallery = currentGallery.filter(img => img.position !== position);
        updatedGallery.push(newGalleryImage);

        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({
            gallery_images: updatedGallery,
            updated_at: new Date().toISOString()
          })
          .eq('id', blogId);

        if (updateError) {
          console.error('❌ 更新gallery_images失败:', updateError);
          return res.status(500).json({ 
            error: 'Failed to update gallery images',
            details: updateError.message 
          });
        }

        console.log('✅ gallery_images更新成功');

        return res.status(200).json({
          success: true,
          data: {
            image: newGalleryImage,
            gallery: updatedGallery
          }
        });

      } catch (error) {
        console.error('❌ 更新gallery_images异常:', error);
        return res.status(500).json({ 
          error: 'Failed to update gallery images',
          details: error.message 
        });
      }
    }

    if (req.method === 'PUT') {
      // 更新博客基本信息
      const { id, title, content, tags, cover_image_url } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Blog ID is required' });
      }

      const tagsArray = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [];
      
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          title: title?.trim(),
          content: content?.trim(),
          cover_image_url: cover_image_url || '',
          tags: tagsArray,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ 更新博客失败:', error);
        return res.status(500).json({ error: 'Failed to update blog' });
      }

      return res.status(200).json({
        success: true,
        data: data
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('🚨 Blog edit API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
