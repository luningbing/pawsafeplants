import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  try {
    console.log('Hero carousel API called:', req.method);
    
    if (req.method === 'GET') {
      console.log('Reading hero carousel data from database');
      
      try {
        const { data, error } = await supabase
          .from('hero_carousel')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (error) {
          console.error('Database read error:', error);
          // Fallback to default data
          return res.status(200).json(getDefaultHeroData());
        }
        
        if (data && data.length > 0) {
          const heroData = data[0].content;
          console.log('Found hero data in database:', heroData);
          return res.status(200).json(heroData);
        } else {
          console.log('No hero data found, using default');
          return res.status(200).json(getDefaultHeroData());
        }
      } catch (dbError) {
        console.error('Database connection error:', dbError);
        return res.status(200).json(getDefaultHeroData());
      }
    }
    
    if (req.method === 'POST') {
      console.log('Saving hero carousel data to database');
      
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
      
      console.log('Hero data to save:', heroData);
      
      try {
        // First, try to update existing record
        const { data: existingData, error: fetchError } = await supabase
          .from('hero_carousel')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (fetchError) {
          console.error('Fetch error:', fetchError);
          return res.status(500).json({ error: 'Database fetch error: ' + fetchError.message });
        }
        
        if (existingData && existingData.length > 0) {
          // Update existing record
          const { data: updateData, error: updateError } = await supabase
            .from('hero_carousel')
            .update({ content: heroData })
            .eq('id', existingData[0].id);
          
          if (updateError) {
            console.error('Update error:', updateError);
            return res.status(500).json({ error: 'Database update error: ' + updateError.message });
          }
          
          console.log('Hero data updated successfully');
        } else {
          // Insert new record
          const { data: insertData, error: insertError } = await supabase
            .from('hero_carousel')
            .insert({ content: heroData });
          
          if (insertError) {
            console.error('Insert error:', insertError);
            return res.status(500).json({ error: 'Database insert error: ' + insertError.message });
          }
          
          console.log('Hero data inserted successfully');
        }
        
        return res.status(200).json(heroData);
      } catch (dbError) {
        console.error('Database operation error:', dbError);
        return res.status(500).json({ error: 'Database operation error: ' + dbError.message });
      }
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Hero carousel API error:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}

function getDefaultHeroData() {
  return {
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
}
