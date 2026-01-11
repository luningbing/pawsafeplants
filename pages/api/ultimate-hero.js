import fs from 'fs'
import path from 'path'
import { supabaseAdmin } from '../../lib/supabaseAdmin'

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
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      
      // 直接从Supabase数据库读取你的配置
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        
        if (supabaseUrl && supabaseKey) {
          console.log('Reading from Supabase database with admin client');
          const { data, error } = await supabaseAdmin
            .from('hero_carousel')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1);
          
          console.log('Supabase response:', { data, error });
          
          if (error) {
            console.error('Database read error:', error);
          } else if (data && data.length > 0) {
    
    if (req.method === 'POST') {
      console.log('Saving ultimate hero carousel data');
      
      const { slides } = req.body;
      console.log('Received slides:', slides);
      
      if (!slides || !Array.isArray(slides) || slides.length !== 3) {
        console.error('Invalid slides data - must have exactly 3 slides');
        return res.status(400).json({ error: 'Must provide exactly 3 slides' });
      }
      
      // 验证每张slide的必需字段
      for (let i = 0; i < 3; i++) {
        const slide = slides[i];
        if (!slide.imageUrl || !slide.title || !slide.subtitle) {
          return res.status(400).json({ 
            error: `Slide ${i + 1} missing required fields (imageUrl, title, subtitle)` 
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
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Ultimate Hero API error:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}
