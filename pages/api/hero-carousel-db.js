import fs from 'fs'
import path from 'path'
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
          
          // Convert image paths to new format
          if (heroData.slides && Array.isArray(heroData.slides)) {
            heroData.slides = heroData.slides.map(slide => ({
              ...slide,
              imageUrl: validateImagePath(convertImagePath(slide.imageUrl))
            }));
          }
          
          console.log('Converted hero data:', heroData);
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
    ]
  };
}

// Function to convert old image paths to new paths
function convertImagePath(imageUrl) {
  if (!imageUrl) return imageUrl;
  
  // Convert /images/plants/ to /uploads/
  if (imageUrl.startsWith('/images/plants/')) {
    const filename = imageUrl.split('/').pop();
    return `/uploads/${filename}`;
  }
  
  // Convert /images/ to /uploads/
  if (imageUrl.startsWith('/images/') && !imageUrl.startsWith('/images/plants/')) {
    const filename = imageUrl.split('/').pop();
    return `/uploads/${filename}`;
  }
  
  return imageUrl; // Keep /uploads/ unchanged
}

// Function to check if file exists and return fallback if needed
function validateImagePath(imageUrl) {
  if (!imageUrl) return '/images/hero-1.jpg';
  
  // For production, we can't check filesystem, so use known good images
  const knownValidImages = [
    '/uploads/20250530-190020.jpg',
    '/uploads/_247026d4-f09b-4307-9d55-65b40bd2813c.jpg',
    '/uploads/7ae0aff1-4b60-4c05-aa34-fcd6a9ea3dd2_7930717a90c33c714f1ae8d742554593_ComfyUI_033fc57d_00001_.png'
  ];
  
  // Handle Supabase storage URLs
  if (imageUrl.includes('supabase.co/storage/v1/object/public/uploads/')) {
    console.log('Found Supabase URL, keeping as is:', imageUrl);
    return imageUrl; // Keep Supabase URLs as they are
  }
  
  if (knownValidImages.includes(imageUrl)) {
    return imageUrl;
  }
  
  // For any other path, return a default image
  console.log('Invalid image path, using fallback:', imageUrl);
  return '/images/hero-1.jpg';
}
