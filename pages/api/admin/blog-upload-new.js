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

    const { file, title, content, tags, slotName, blogId } = req.body;

    if (!file) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['file']
      });
    }

    // 解析base64图片数据
    const base64Data = file.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // 生成文件名
    const timestamp = Date.now();
    const filename = slotName ? 
      `slot-${slotName}-${timestamp}.jpg` : 
      `blog-${timestamp}.jpg`;
    
    console.log('📤 上传图片到blog-images桶...');

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
          display_name: slotName ? `博客槽位 - ${slotName}` : `博客封面 - ${title}`,
          file_type: slotName ? 'blog_slot' : 'blog_cover',
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

    // 如果是槽位图片，更新博客的image_slots字段
    if (slotName && blogId) {
      try {
        // 先获取现有的image_slots
        const { data: existingBlog, error: fetchError } = await supabase
          .from('blog_posts')
          .select('image_slots')
          .eq('id', blogId)
          .single();

        if (fetchError) {
          console.error('❌ 获取现有博客失败:', fetchError);
          return res.status(500).json({ error: 'Failed to fetch existing blog' });
        }

        const currentSlots = existingBlog.image_slots || {};
        const updatedSlots = {
          ...currentSlots,
          [slotName]: imageUrl
        };

        // 更新博客的image_slots字段
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({
            image_slots: updatedSlots,
            updated_at: new Date().toISOString()
          })
          .eq('id', blogId);

        if (updateError) {
          console.error('❌ 更新image_slots失败:', updateError);
          return res.status(500).json({ 
            error: 'Failed to update image slots',
            details: updateError.message 
          });
        }

        console.log('✅ image_slots更新成功');

        return res.status(200).json({
          success: true,
          data: {
            image_url: imageUrl,
            slot_name: slotName,
            image_slots: updatedSlots
          }
        });
      } catch (error) {
        console.error('❌ 更新image_slots异常:', error);
        return res.status(500).json({ 
          error: 'Failed to update image slots',
          details: error.message 
        });
      }
    }

    // 如果是封面图片，创建新博客
    if (!slotName && title && content) {
      try {
        const tagsArray = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [];
        
        const { data: blogData, error: blogError } = await supabase
          .from('blog_posts')
          .insert({
            title: title.trim(),
            slug: title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
            content: content.trim(),
            excerpt: content.trim().substring(0, 200) + '...',
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
    }

    // 默认返回上传成功
    return res.status(200).json({
      success: true,
      data: {
        image_url: imageUrl
      }
    });

  } catch (error) {
    console.error('🚨 Blog upload API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
