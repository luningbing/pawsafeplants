import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  try {
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
      
      // 首先尝试从现有的hero-carousel-db API获取数据
      try {
        const existingHeroRes = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/hero-carousel-db`);
        if (existingHeroRes.ok) {
          const existingData = await existingHeroRes.json();
          console.log('Found existing hero data:', existingData);
          
          if (existingData.slides && Array.isArray(existingData.slides) && existingData.slides.length >= 3) {
            // 使用现有的前3张轮播图数据
            const ultimateData = {
              slides: existingData.slides.slice(0, 3).map(slide => ({
                imageUrl: slide.imageUrl,
                title: slide.title,
                subtitle: slide.subtitle,
                link: slide.link || '/plants/safe'
              })),
              updatedAt: new Date().toISOString()
            };
            
            // 保存到ultimate-hero.json文件
            try {
              fs.writeFileSync(heroFile, JSON.stringify(ultimateData, null, 2));
              console.log('Saved existing data to ultimate-hero.json');
            } catch (writeError) {
              console.error('Error writing ultimate hero file:', writeError);
            }
            
            return res.status(200).json(ultimateData);
          }
        }
      } catch (fetchError) {
        console.log('Could not fetch existing data, using file or default');
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
            title: '给猫咪一个森林',
            subtitle: '创造安全、绿色的猫咪生活空间，让它们自由探索自然之美',
            link: '/plants/safe'
          },
          {
            imageUrl: '/uploads/_247026d4-f09b-4307-9d55-65b40bd2813c.jpg',
            title: '避开这些致命红线',
            subtitle: '识别对猫咪有毒的植物，保护爱宠远离潜在危险',
            link: '/plants/toxic'
          },
          {
            imageUrl: '/uploads/7ae0aff1-4b60-4c05-aa34-fcd6a9ea3dd2_7930717a90c33c714f1ae8d742554593_ComfyUI_033fc57d_00001_.png',
            title: '植物养护指南',
            subtitle: '学习如何照顾绿色伴侣，打造人宠和谐的美好家园',
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
