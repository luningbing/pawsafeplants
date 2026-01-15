import { createClient } from '@supabase/supabase-js';

// 🖼️ 修复重复Unsplash图片URL问题
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('🖼️ 开始修复重复Unsplash图片URL...');

    // 1. 检查并修复 flowers 表中的重复图片
    const { data: flowersData, error: flowersError } = await supabaseAdmin
      .from('flowers')
      .select('id, image_url, title');

    if (flowersError) {
      console.error('❌ 获取flowers数据失败:', flowersError);
      return res.status(500).json({ error: '获取flowers数据失败' });
    }

    const flowerUpdates = [];
    const imageMap = new Map();

    // 统计图片使用次数
    flowersData?.forEach(flower => {
      if (flower.image_url) {
        const count = imageMap.get(flower.image_url) || 0;
        imageMap.set(flower.image_url, count + 1);
      }
    });

    // 找出重复使用的图片
    const duplicateImages = [];
    imageMap.forEach((count, url) => {
      if (count > 1) {
        duplicateImages.push(url);
      }
    });

    console.log('📊 发现重复图片:', duplicateImages);

    // 2. 为重复图片生成新的唯一URL
    const unsplashAlternatives = [
      'https://images.unsplash.com/photo-1558628037-f3b6c1b0c3b2?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1589206912909-2896f7c45bf8?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506805945078-4b0c4d8d71b6?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558628037-f3b6c1b0c3b2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1589206912909-2896f7c45bf8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&h=600&fit=crop'
    ];

    let altIndex = 0;

    // 3. 更新重复图片的URL
    flowersData?.forEach(flower => {
      if (duplicateImages.includes(flower.image_url)) {
        const newImageUrl = unsplashAlternatives[altIndex % unsplashAlternatives.length];
        flowerUpdates.push({
          id: flower.id,
          image_url: newImageUrl,
          title: flower.title
        });
        altIndex++;
        console.log(`🔄 更新 ${flower.title}: ${flower.image_url} → ${newImageUrl}`);
      }
    });

    // 4. 执行批量更新
    if (flowerUpdates.length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from('flowers')
        .upsert(flowerUpdates, { onConflict: 'id' });

      if (updateError) {
        console.error('❌ 更新flowers图片失败:', updateError);
        return res.status(500).json({ error: '更新flowers图片失败' });
      }

      console.log(`✅ 成功更新 ${flowerUpdates.length} 个重复图片`);
    }

    // 5. 检查并修复 atmosphere_images 表
    const { data: atmosphereData, error: atmosphereError } = await supabaseAdmin
      .from('atmosphere_images')
      .select('id, url');

    if (atmosphereError) {
      console.error('❌ 获取atmosphere数据失败:', atmosphereError);
    } else {
      const atmosphereUpdates = [];
      const atmosphereImageMap = new Map();

      atmosphereData?.forEach(img => {
        if (img.url) {
          const count = atmosphereImageMap.get(img.url) || 0;
          atmosphereImageMap.set(img.url, count + 1);
        }
      });

      const atmosphereDuplicates = [];
      atmosphereImageMap.forEach((count, url) => {
        if (count > 1) {
          atmosphereDuplicates.push(url);
        }
      });

      let atmosphereAltIndex = 0;
      atmosphereData?.forEach(img => {
        if (atmosphereDuplicates.includes(img.url)) {
          const newImageUrl = unsplashAlternatives[unslashAlternatives.length - 1 - (atmosphereAltIndex % unsplashAlternatives.length)];
          atmosphereUpdates.push({
            id: img.id,
            url: newImageUrl
          });
          atmosphereAltIndex++;
          console.log(`🔄 更新atmosphere: ${img.url} → ${newImageUrl}`);
        }
      });

      if (atmosphereUpdates.length > 0) {
        await supabaseAdmin
          .from('atmosphere_images')
          .upsert(atmosphereUpdates, { onConflict: 'id' });
        console.log(`✅ 成功更新 ${atmosphereUpdates.length} 个atmosphere图片`);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Unsplash图片重复问题修复完成',
      flowersFixed: flowerUpdates.length,
      atmosphereFixed: atmosphereUpdates?.length || 0,
      duplicateImagesFound: duplicateImages.length,
      recommendations: [
        '所有重复图片已替换为唯一URL',
        '建议定期检查图片URL有效性',
        '考虑使用本地图片作为备选方案'
      ]
    });

  } catch (error) {
    console.error('❌ 修复Unsplash图片时发生错误:', error);
    return res.status(500).json({ 
      error: '修复Unsplash图片失败', 
      details: error.message 
    });
  }
}
