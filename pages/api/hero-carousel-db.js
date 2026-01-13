import { supabaseAdmin } from '../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('🎠 Hero Carousel API request:', { method: req.method, timestamp: new Date().toISOString() });

    if (req.method === 'GET') {
      // Get current hero carousel data
      console.log('📋 Fetching hero carousel data...');
      const { data, error } = await supabaseAdmin
        .from('hero_carousel')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) {
        console.error('❌ Database error:', error)
        return res.status(500).json({ error: 'Failed to fetch hero data', details: error })
      }

      console.log('✅ Hero data fetched:', { hasData: !!data?.[0], contentKeys: data?.[0] ? Object.keys(data[0].content || {}) : [] });
      
      // Field mapping: database image_url -> frontend imageUrl
      const heroData = data?.[0];
      if (heroData && heroData.content && heroData.content.slides) {
        // Map database fields back to frontend format
        const mappedSlides = heroData.content.slides.map(slide => ({
          imageUrl: slide.image_url || slide.imageUrl, // Prefer image_url, fallback to imageUrl
          title: slide.title || '',
          subtitle: slide.subtitle || '',
          link: slide.link || ''
        }));
        
        const mappedData = {
          ...heroData,
          content: {
            slides: mappedSlides
          }
        };
        
        console.log('🔄 Mapped slides for frontend:', { 
          originalCount: heroData.content.slides.length,
          mappedCount: mappedSlides.length,
          sample: mappedSlides[0] 
        });
        
        return res.status(200).json({ 
          success: true, 
          data: mappedData
        });
      }
      
      return res.status(200).json({ 
        success: true, 
        data: heroData || null
      });
    }

    if (req.method === 'POST') {
      // Update hero carousel data
      const { slides } = req.body
      console.log('📝 Received slides data:', { count: slides?.length || 0, slides });

      if (!slides || !Array.isArray(slides)) {
        console.error('❌ Invalid slides data:', { slides, isArray: Array.isArray(slides) });
        return res.status(400).json({ error: 'Invalid slides data' })
      }

      // Validate each slide - only imageUrl is required
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i]
        if (!slide.imageUrl) {
          console.error('❌ Slide missing imageUrl:', { index: i, slide });
          return res.status(400).json({ 
            error: `Slide ${i + 1} missing required imageUrl field` 
          })
        }
      }

      console.log('✅ All slides validated, preparing to save...');

      // Field mapping: frontend imageUrl -> database image_url
      const dataToSave = slides.map(s => ({
        image_url: s.imageUrl,
        title: s.title || '',
        subtitle: s.subtitle || '',
        link: s.link || ''
      }))

      console.log('💾 Mapped data for database:', { 
        originalCount: slides.length, 
        mappedCount: dataToSave.length,
        sample: dataToSave[0] 
      });

      // Update or insert hero carousel data
      console.log('💾 Saving to hero_carousel table...');
      const { data, error } = await supabaseAdmin
        .from('hero_carousel')
        .upsert({
          content: { slides: dataToSave },
          updated_at: new Date().toISOString()
        })
        .select()

      if (error) {
        console.error('❌ Database error:', error)
        return res.status(500).json({ error: 'Failed to save hero data', details: error })
      }

      console.log('✅ Hero carousel saved successfully:', { 
        recordId: data?.[0]?.id,
        slidesCount: dataToSave.length 
      });

      return res.status(200).json({ 
        success: true, 
        message: 'Hero carousel updated successfully',
        data: data?.[0]
      })
    }
  } catch (error) {
    console.error('💥 Hero Carousel API critical error:', error)
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message || error 
    })
  }
}
