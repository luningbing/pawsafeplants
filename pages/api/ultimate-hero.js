import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    console.log('=== ENVIRONMENT DEBUG ===');
    console.log('DB URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('DB Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    console.log('Service Role Key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('All env vars:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
    console.log('=== END DEBUG ===');
    
    console.log('Ultimate Hero API called:', req.method);
    
    const settingsDir = path.join(process.cwd(), 'content', 'settings');
    const heroFile = path.join(settingsDir, 'hero.json');
    
    // 确保目录存在
    if (!fs.existsSync(settingsDir)) {
      console.log('Creating settings directory:', settingsDir);
      fs.mkdirSync(settingsDir, { recursive: true });
    }
    
    if (req.method === 'GET') {
      console.log('Reading ultimate hero carousel data');
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      
      // 直接从Supabase数据库读取你的配置
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        
        if (supabaseUrl && supabaseKey) {
          console.log('Reading from Supabase database');
          const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
          const client = createClient(supabaseUrl, serviceRoleKey || supabaseKey);
          
          const { data, error } = await client
            .from('hero_carousel')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1);
          
          console.log('Supabase response:', { data, error });
          
          if (error) {
            console.error('Database read error:', error);
          } else if (data && data.length > 0) {
            const heroData = data[0].content;
            console.log('Found hero data in database:', heroData);
            
            if (heroData.slides && Array.isArray(heroData.slides) && heroData.slides.length >= 3) {
              console.log('Processing slides:', heroData.slides);
              // 确保第一张是布里亚娜求婚照
              const briannaSlide = {
                imageUrl: 'https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=1920&h=1080&fit=crop&auto=format',
                title: 'A Proposal, A Kitten, and A Safe Bouquet',
                subtitle: 'Real love story: Brianna, Rigo, and their dream kitten',
                link: '/blog/valentines-day-cat-safe-flowers-guide'
              };
              
              // 使用现有的后2张轮播图数据
              const otherSlides = heroData.slides.slice(1, 3).map(slide => ({
                imageUrl: slide.imageUrl,
                title: slide.title,
                subtitle: slide.subtitle,
                link: slide.link || '/plants/safe'
              }));
              
              const ultimateData = {
                slides: [briannaSlide, ...otherSlides],
                updatedAt: new Date().toISOString()
              };
              
              console.log('Ultimate data prepared:', ultimateData);
              
              // 保存到ultimate-hero.json文件
              try {
                fs.writeFileSync(heroFile, JSON.stringify(ultimateData, null, 2));
                console.log('Saved existing data to ultimate-hero.json');
              } catch (writeError) {
                console.error('Error writing ultimate hero file:', writeError);
              }
              
              return res.status(200).json(ultimateData);
            } else {
              console.log('Invalid slides data in database');
            }
          } else {
            console.log('No data found in database');
          }
        } else {
          console.log('Missing Supabase credentials');
        }
      } catch (dbError) {
        console.error('Database connection error:', dbError);
      }
      
      // 强制从数据库拉取，不使用本地缓存
      try {
        if (fs.existsSync(heroFile)) {
          console.log('Deleting local cache to force database refresh');
          fs.unlinkSync(heroFile); // 删除本地缓存
        }
      } catch (fileError) {
        console.error('Error reading ultimate hero file:', fileError);
      }
      
      // 最后的默认数据 - 使用硬编码的高清图片URL
      const defaultData = {
        slides: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=1920&h=1080&fit=crop&auto=format',
            title: 'A Proposal, A Kitten, and A Safe Bouquet',
            subtitle: 'Real love story: Brianna, Rigo, and their dream kitten',
            link: '/blog/valentines-day-cat-safe-flowers-guide'
          },
          {
            imageUrl: 'https://images.unsplash.com/photo-1574158610182-6e2bae4e4d3b?w=1920&h=1080&fit=crop&auto=format',
            title: 'Cat-Safe Plants for Your Home',
            subtitle: 'Create a beautiful, pet-friendly living space',
            link: '/plants/safe'
          },
          {
            imageUrl: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=1920&h=1080&fit=crop&auto=format',
            title: 'Toxic Plants to Avoid',
            subtitle: 'Protect your feline friends from harmful plants',
            link: '/plants/toxic'
          }
        ],
        updatedAt: new Date().toISOString()
      };
      
      console.log('Using default data with existing image paths');
      return res.status(200).json(defaultData);
    }
    
    if (req.method === 'POST') {
      console.log('Saving ultimate hero carousel data');
      
      const { slides } = req.body;
      console.log('Received slides:', slides);
      
      if (!slides || !Array.isArray(slides) || slides.length !== 3) {
        console.error('Invalid slides data - must have exactly 3 slides');
        return res.status(400).json({ error: '必须提供3张轮播图数据' });
      }
      
      // 验证每张slide的必需字段
      for (let i = 0; i < 3; i++) {
        const slide = slides[i];
        if (!slide.imageUrl || !slide.title || !slide.subtitle) {
          return res.status(400).json({ 
            error: `第${i + 1}张轮播图缺少必需字段 (imageUrl, title, subtitle)` 
          });
        }
      }
      
      const heroData = {
        slides: slides,
        updatedAt: new Date().toISOString()
      };
      
      console.log('Writing ultimate hero data to file:', heroFile);
      
      try {
        fs.writeFileSync(heroFile, JSON.stringify(heroData, null, 2));
        console.log('Ultimate hero data saved successfully');
      } catch (writeError) {
        console.error('Error writing hero file:', writeError);
        return res.status(500).json({ error: '保存失败: ' + writeError.message });
      }
      
      return res.status(200).json(heroData);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Ultimate Hero API error:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}
