import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  try {
    console.log('Hero carousel API called:', req.method);
    
    if (req.method === 'GET') {
      console.log('Reading hero carousel data from environment');
      
      // Try to get data from environment variable first
      const envHeroData = process.env.HERO_CAROUSEL_DATA;
      
      if (envHeroData) {
        try {
          const heroData = JSON.parse(envHeroData);
          console.log('Found hero data in environment:', heroData);
          return res.status(200).json(heroData);
        } catch (parseError) {
          console.error('Failed to parse environment hero data:', parseError);
        }
      }
      
      // Fallback to default data
      console.log('Using default hero data');
      const defaultData = {
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
      
      return res.status(200).json(defaultData);
    }
    
    if (req.method === 'POST') {
      console.log('Hero carousel data cannot be saved to filesystem on Vercel');
      console.log('Received slides:', req.body?.slides);
      
      return res.status(200).json({ 
        message: 'Data received. Please set HERO_CAROUSEL_DATA environment variable with this value:',
        data: JSON.stringify({ slides: req.body?.slides || [], updatedAt: new Date().toISOString() }, null, 2)
      });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Hero carousel API error:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}
