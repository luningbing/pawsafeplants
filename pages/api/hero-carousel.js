import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    console.log('Hero carousel API called:', req.method);
    
    const settingsDir = path.join(process.cwd(), 'content', 'settings');
    const heroFile = path.join(settingsDir, 'hero.json');
    
    // 确保目录存在
    if (!fs.existsSync(settingsDir)) {
      console.log('Creating settings directory:', settingsDir);
      fs.mkdirSync(settingsDir, { recursive: true });
    }
    
    if (req.method === 'GET') {
      console.log('Reading hero carousel data');
      // 读取轮播图配置
      let heroData = {
        slides: [
          {
            imageUrl: '/images/hero-1.jpg',
            title: 'Cat-Safe Plants for Your Home',
            subtitle: 'Create a beautiful, pet-friendly living space',
            link: '/plants/safe'
          },
          {
            imageUrl: '/images/hero-2.jpg',
            title: 'Toxic Plants to Avoid', 
            subtitle: 'Protect your feline friends from harmful plants',
            link: '/plants/toxic'
          },
          {
            imageUrl: '/images/hero-3.jpg',
            title: 'Plant Care Guide',
            subtitle: 'Learn how to care for your green companions', 
            link: '/plants/caution'
          }
        ]
      };
      
      try {
        if (fs.existsSync(heroFile)) {
          console.log('Hero file exists, reading:', heroFile);
          const data = fs.readFileSync(heroFile, 'utf8');
          const savedData = JSON.parse(data);
          // 确保总是有3个slide
          if (savedData.slides && Array.isArray(savedData.slides)) {
            // 合并保存的数据和默认数据，确保有3个slide
            const mergedSlides = [];
            for (let i = 0; i < 3; i++) {
              const savedSlide = savedData.slides[i];
              mergedSlides.push(savedSlide || {
                imageUrl: `/images/hero-${i + 1}.jpg`,
                title: `Slide ${i + 1}`,
                subtitle: 'Default subtitle',
                link: ''
              });
            }
            heroData.slides = mergedSlides;
          }
        }
      } catch (error) {
        console.error('Error reading hero file:', error);
      }
      
      console.log('Returning hero data:', heroData);
      return res.status(200).json(heroData);
    }
    
    if (req.method === 'POST') {
      console.log('Saving hero carousel data');
      // 保存轮播图配置
      const { slides } = req.body;
      
      console.log('Received slides:', slides);
      
      if (!slides || !Array.isArray(slides)) {
        console.error('Invalid slides data:', slides);
        return res.status(400).json({ error: 'Invalid slides data' });
      }
      
      // 确保总是有3个slide
      const validSlides = [];
      for (let i = 0; i < 3; i++) {
        const slide = slides[i];
        validSlides.push(slide || {
          imageUrl: `/images/hero-${i + 1}.jpg`,
          title: `Slide ${i + 1}`,
          subtitle: 'Default subtitle',
          link: ''
        });
      }
      
      const heroData = {
        slides: validSlides,
        updatedAt: new Date().toISOString()
      };
      
      console.log('Writing hero data to file:', heroFile);
      console.log('Hero data to write:', heroData);
      
      try {
        fs.writeFileSync(heroFile, JSON.stringify(heroData, null, 2));
        console.log('Hero data saved successfully');
      } catch (writeError) {
        console.error('Error writing hero file:', writeError);
        return res.status(500).json({ error: 'Failed to save hero data: ' + writeError.message });
      }
      
      return res.status(200).json(heroData);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Hero carousel API error:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}
