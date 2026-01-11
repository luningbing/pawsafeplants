import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    console.log('=== ENVIRONMENT DEBUG ===');
    console.log('DB URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('DB Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
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
          const client = createClient(supabaseUrl, supabaseKey);
          
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
              // 使用现有的前3张轮播图数据
              const ultimateData = {
                slides: heroData.slides.slice(0, 3).map(slide => ({
                  imageUrl: slide.imageUrl,
                  title: slide.title,
                  subtitle: slide.subtitle,
                  link: slide.link || '/plants/safe'
                })),
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
      
      // 如果无法获取现有数据，尝试从文件读取
      try {
        if (fs.existsSync(heroFile)) {
          console.log('Reading from ultimate hero file:', heroFile);
          const data = fs.readFileSync(heroFile, 'utf8');
          const savedData = JSON.parse(data);
          
          if (savedData.slides && Array.isArray(savedData.slides) && savedData.slides.length === 3) {
            console.log('Using saved ultimate hero data:', savedData);
            return res.status(200).json(savedData);
          }
        }
      } catch (fileError) {
        console.error('Error reading ultimate hero file:', fileError);
      }
      
      // 最后的默认数据 - 使用你现有的图片路径
      const defaultData = {
        slides: [
          {
            imageUrl: '/uploads/20250530-190020.jpg',
            title: 'Cat-Safe Plants for Your Home',
            subtitle: 'Create a beautiful, pet-friendly living space',
            link: '/plants/safe'
          },
          {
            imageUrl: '/uploads/_247026d4-f09b-4307-9d55-65b40bd2813c.jpg',
            title: 'Toxic Plants to Avoid',
            subtitle: 'Protect your feline friends from harmful plants',
            link: '/plants/toxic'
          },
          {
            imageUrl: '/uploads/7ae0aff1-4b60-4c05-aa34-fcd6a9ea3dd2_7930717a90c33c714f1ae8d742554593_ComfyUI_033fc57d_00001_.png',
            title: 'Plant Care Guide',
            subtitle: 'Learn how to care for your green companions',
            link: '/plants/caution'
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
