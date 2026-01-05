import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const settingsDir = path.join(process.cwd(), 'content', 'settings');
    const heroFile = path.join(settingsDir, 'hero.json');
    
    // 确保目录存在
    if (!fs.existsSync(settingsDir)) {
      fs.mkdirSync(settingsDir, { recursive: true });
    }
    
    if (req.method === 'GET') {
      // 读取轮播图配置
      let heroData = {
        slides: [
          { id: 1, image: '', link: '', title: 'Slide 1' },
          { id: 2, image: '', link: '', title: 'Slide 2' },
          { id: 3, image: '', link: '', title: 'Slide 3' }
        ]
      };
      
      try {
        if (fs.existsSync(heroFile)) {
          const data = fs.readFileSync(heroFile, 'utf8');
          const savedData = JSON.parse(data);
          // 确保总是有3个slide
          if (savedData.slides && Array.isArray(savedData.slides)) {
            // 合并保存的数据和默认数据，确保有3个slide
            const mergedSlides = [];
            for (let i = 1; i <= 3; i++) {
              const savedSlide = savedData.slides.find(s => s.id === i);
              mergedSlides.push(savedSlide || {
                id: i,
                image: '',
                link: '',
                title: `Slide ${i}`
              });
            }
            heroData.slides = mergedSlides;
          }
        }
      } catch (error) {
        console.error('Error reading hero file:', error);
      }
      
      return res.status(200).json(heroData);
    }
    
    if (req.method === 'POST') {
      // 保存轮播图配置
      const { slides } = req.body;
      
      if (!slides || !Array.isArray(slides)) {
        return res.status(400).json({ error: 'Invalid slides data' });
      }
      
      // 确保总是有3个slide
      const validSlides = [];
      for (let i = 1; i <= 3; i++) {
        const slide = slides.find(s => s.id === i);
        validSlides.push(slide || {
          id: i,
          image: '',
          link: '',
          title: `Slide ${i}`
        });
      }
      
      const heroData = {
        slides: validSlides,
        updatedAt: new Date().toISOString()
      };
      
      fs.writeFileSync(heroFile, JSON.stringify(heroData, null, 2));
      return res.status(200).json(heroData);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Hero carousel API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
