import { createClient } from '@supabase/supabase-js';
import { getSupabaseClient } from '../../lib/supabase';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const supabase = getSupabaseClient();

    if (req.method === 'GET') {
      // Fetch hero carousel slides
      const { data, error } = await supabase
        .from('hero_carousel')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching hero carousel:', error);
        return res.status(500).json({ error: 'Failed to fetch hero carousel data' });
      }

      return res.status(200).json({ slides: data || [] });
    }

    if (req.method === 'POST') {
      // Save hero carousel slides
      const { slides } = req.body;

      if (!slides || !Array.isArray(slides)) {
        return res.status(400).json({ error: 'Invalid slides data' });
      }

      // Validate image URLs before saving
      const validatedSlides = slides.map((slide, index) => {
        if (!slide.imageUrl) {
          throw new Error(`Slide ${index + 1}: imageUrl is required`);
        }
        
        // Allow both local paths (/images/...) and full URLs
        if (!slide.imageUrl.startsWith('/images/') && !slide.imageUrl.startsWith('http')) {
          throw new Error(`Slide ${index + 1}: Invalid image URL format`);
        }

        return {
          ...slide,
          sort_order: index + 1,
          updated_at: new Date().toISOString()
        };
      });

      console.log('Saving hero carousel slides:', validatedSlides.length);

      // Use upsert to update existing slides or insert new ones
      const results = [];
      for (const slide of validatedSlides) {
        const { data, error } = await supabase
          .from('hero_carousel')
          .upsert({
            id: slide.id,
            title: slide.title,
            subtitle: slide.subtitle,
            imageUrl: slide.imageUrl,
            cta_text: slide.cta_text,
            cta_link: slide.cta_link,
            sort_order: slide.sort_order,
            updated_at: slide.updated_at
          }, {
            onConflict: 'id'
          });

        if (error) {
          console.error('Error upserting slide:', error);
          throw new Error(`Failed to save slide: ${error.message}`);
        }

        results.push(data[0]);
      }

      console.log('Hero carousel saved successfully:', results.length, 'slides');
      return res.status(200).json({ 
        success: true, 
        slides: results,
        message: `Successfully saved ${results.length} hero carousel slides`
      });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });

  } catch (error) {
    console.error('Hero carousel API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
