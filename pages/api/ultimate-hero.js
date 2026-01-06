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
      
      // 默认数据 - 3张高质量猫咪/植物图片
      let heroData = {
        slides: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1920&h=1080&fit=crop&crop=entropy&auto=format',
            title: '给猫咪一个森林',
            subtitle: '创造安全、绿色的猫咪生活空间，让它们自由探索自然之美',
            link: '/plants/safe'
          },
          {
            imageUrl: 'https://images.unsplash.com/photo-1552728089-a57bddab0c2f?w=1920&h=1080&fit=crop&crop=entropy&auto=format',
            title: '避开这些致命红线',
            subtitle: '识别对猫咪有毒的植物，保护爱宠远离潜在危险',
            link: '/plants/toxic'
          },
          {
            imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&h=1080&fit=crop&crop=entropy&auto=format',
            title: '植物养护指南',
            subtitle: '学习如何照顾绿色伴侣，打造人宠和谐的美好家园',
            link: '/plants/caution'
          }
        ],
        updatedAt: new Date().toISOString()
      };
      
      try {
        if (fs.existsSync(heroFile)) {
          console.log('Hero file exists, reading:', heroFile);
          const data = fs.readFileSync(heroFile, 'utf8');
          const savedData = JSON.parse(data);
          
          // 验证数据结构
          if (savedData.slides && Array.isArray(savedData.slides) && savedData.slides.length === 3) {
            heroData = savedData;
            console.log('Using saved hero data:', heroData);
          } else {
            console.log('Invalid saved data, using default');
          }
        }
      } catch (error) {
        console.error('Error reading hero file:', error);
      }
      
      return res.status(200).json(heroData);
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
