import { createClient } from '@supabase/supabase-js'

// Emergency Hardcoded Fallback for Production
const HARDCODED_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjemZiZ3pnaHdpcXB4aWhsZXhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk5NDUwMSwiZXhwIjoyMDc1NTcwNTAxfQ.uF3IofVn0ZkFSM6aSYsWCmOWHl26ybxv_bwMST3Zsio'

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rczfbgzghwiqpxihlexs.supabase.co',
      HARDCODED_SERVICE_ROLE_KEY
    )

    if (req.method === 'GET') {
      // Get current hero carousel data
      const { data, error } = await supabase
        .from('hero_carousel')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) {
        console.error('Database error:', error)
        return res.status(500).json({ error: 'Failed to fetch hero data' })
      }

      return res.status(200).json({ 
        success: true, 
        data: data?.[0] || null
      })
    }

    if (req.method === 'POST') {
      // Update hero carousel data
      const { slides } = req.body

      if (!slides || !Array.isArray(slides)) {
        return res.status(400).json({ error: 'Invalid slides data' })
      }

      // Validate each slide
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i]
        if (!slide.imageUrl || !slide.title || !slide.subtitle) {
          return res.status(400).json({ 
            error: `Slide ${i + 1} missing required fields` 
          })
        }
      }

      // Update or insert hero carousel data
      const { data, error } = await supabase
        .from('hero_carousel')
        .upsert({
          content: { slides },
          updated_at: new Date().toISOString()
        })
        .select()

      if (error) {
        console.error('Database error:', error)
        return res.status(500).json({ error: 'Failed to save hero data' })
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Hero carousel updated successfully',
        data: data?.[0]
      })
    }
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
