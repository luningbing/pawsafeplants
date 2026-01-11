import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase credentials for flower detail API')
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export default async function handler(req, res) {
  try {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }

    if (req.method === 'GET') {
      const { slug, category, safety_status, occasion } = req.query

      if (slug) {
        // Get specific flower by slug
        try {
          let flower = null
          
          if (supabase) {
            // Try to use the custom function first
            const { data: functionData, error: functionError } = await supabase
              .rpc('get_flower_by_slug', { flower_slug: slug })

            if (!functionError && functionData && functionData.length > 0) {
              flower = functionData[0]
            } else {
              // Fallback to manual query
              const { data, error } = await supabase
                .from('media_metadata')
                .select('*')
                .eq('seo_slug', slug)
                .eq('category', 'flower')
                .single()

              if (!error && data) {
                flower = data
              }
            }
          }

          if (flower) {
            return res.status(200).json({
              success: true,
              flower,
              seo: {
                title: `${flower.display_name} - Is it a Cat Safe Flower? | PawSafePlants`,
                description: `${flower.display_name} ${flower.safety_status === 'Safe' ? 'is completely safe for cats' : 'may be harmful to cats'}. ${flower.toxicity_level}. ${flower.search_intent?.join(', ') || 'Cat safety information'}.`,
                keywords: `${flower.common_name}, ${flower.scientific_name}, ${flower.search_intent?.join(', ') || ''}, cat safe flowers, pet friendly flowers, ${flower.safety_status.toLowerCase()} flowers for cats`,
                canonical: `https://www.pawsafeplants.com/plants/${flower.seo_slug}`
              }
            })
          } else {
            return res.status(404).json({
              success: false,
              error: 'Flower not found'
            })
          }

        } catch (error) {
          console.error('Error fetching flower:', error)
          
          // Return mock data as fallback
          const mockFlowers = {
            'peony-toxicity-cats': {
              id: 1,
              common_name: 'Peony',
              scientific_name: 'Paeonia lactiflora',
              family: 'Paeoniaceae',
              display_name: 'Peony',
              safety_status: 'Toxic',
              toxicity_level: 'Toxic – Can cause gastrointestinal upset',
              toxicity_symptoms: 'Vomiting, diarrhea, drooling, abdominal pain',
              gifting_occasions: ['Wedding', 'Anniversary', 'Birthday'],
              search_intent: ['Peony bouquet delivery', 'Are peonies safe?'],
              seo_slug: 'peony-toxicity-cats',
              file_path: 'https://images.unsplash.com/photo-1558628037-f3b6c1b0c3b2?w=400&h=400&fit=crop'
            },
            'cat-safe-roses': {
              id: 3,
              common_name: 'Rose',
              scientific_name: 'Rosa rubiginosa',
              family: 'Rosaceae',
              display_name: 'Rose',
              safety_status: 'Safe',
              toxicity_level: 'Safe – Generally non-toxic to cats',
              toxicity_symptoms: 'None (thorns may cause physical injury)',
              gifting_occasions: ['Valentine\'s Day', 'Anniversary', 'Birthday', 'Wedding'],
              search_intent: ['Classic romance', 'Cat safe roses'],
              seo_slug: 'cat-safe-roses',
              file_path: 'https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=400&h=400&fit=crop'
            },
            'lily-deadly-toxicity-cats': {
              id: 11,
              common_name: 'Lily',
              scientific_name: 'Lilium longiflorum',
              family: 'Liliaceae',
              display_name: 'Lily',
              safety_status: 'Deadly',
              toxicity_level: 'Deadly – Extremely toxic, can cause acute kidney failure',
              toxicity_symptoms: 'Vomiting, lethargy, loss of appetite, kidney failure, death',
              gifting_occasions: ['Easter', 'Wedding', 'Funeral'],
              search_intent: ['Easter Lily danger', 'Lily pollen cat death'],
              seo_slug: 'lily-deadly-toxicity-cats',
              file_path: 'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=400&h=400&fit=crop'
            }
          }

          const flower = mockFlowers[slug] || null

          if (flower) {
            return res.status(200).json({
              success: true,
              flower,
              seo: {
                title: `${flower.display_name} - Is it a Cat Safe Flower? | PawSafePlants`,
                description: `${flower.display_name} ${flower.safety_status === 'Safe' ? 'is completely safe for cats' : 'may be harmful to cats'}. ${flower.toxicity_level}. ${flower.search_intent?.join(', ') || 'Cat safety information'}.`,
                keywords: `${flower.common_name}, ${flower.scientific_name}, ${flower.search_intent?.join(', ') || ''}, cat safe flowers, pet friendly flowers, ${flower.safety_status.toLowerCase()} flowers for cats`,
                canonical: `https://www.pawsafeplants.com/plants/${flower.seo_slug}`
              }
            })
          } else {
            return res.status(404).json({
              success: false,
              error: 'Flower not found'
            })
          }
        }
      } else if (category === 'flower') {
        // Get flowers by category
        try {
          let flowers = []
          
          if (supabase) {
            const { data, error } = await supabase
              .from('media_metadata')
              .select('*')
              .eq('category', 'flower')
              .order('priority_rank', { ascending: true })

            if (!error && data) {
              flowers = data
            }
          }

          return res.status(200).json({
            success: true,
            flowers,
            total: flowers.length,
            category: 'flower'
          })

        } catch (error) {
          console.error('Error fetching flowers by category:', error)
          return res.status(500).json({
            success: false,
            error: 'Failed to fetch flowers'
          })
        }
      } else if (safety_status) {
        // Get flowers by safety status
        try {
          let flowers = []
          
          if (supabase) {
            const { data, error } = await supabase
              .from('media_metadata')
              .select('*')
              .eq('category', 'flower')
              .eq('safety_status', safety_status)
              .order('priority_rank', { ascending: true })

            if (!error && data) {
              flowers = data
            }
          }

          return res.status(200).json({
            success: true,
            flowers,
            safety_status,
            total: flowers.length
          })

        } catch (error) {
          console.error('Error fetching flowers by safety status:', error)
          return res.status(500).json({
            success: false,
            error: 'Failed to fetch flowers'
          })
        }
      } else if (occasion) {
        // Get flowers by gifting occasion
        try {
          let flowers = []
          
          if (supabase) {
            const { data, error } = await supabase
              .from('media_metadata')
              .select('*')
              .eq('category', 'flower')
              .contains('gifting_occasions', occasion)
              .order('priority_rank', { ascending: true })

            if (!error && data) {
              flowers = data
            }
          }

          return res.status(200).json({
            success: true,
            flowers,
            occasion,
            total: flowers.length
          })

        } catch (error) {
          console.error('Error fetching flowers by occasion:', error)
          return res.status(500).json({
            success: false,
            error: 'Failed to fetch flowers'
          })
        }
      } else {
        // Get all flowers
        try {
          let flowers = []
          
          if (supabase) {
            const { data, error } = await supabase
              .from('media_metadata')
              .select('*')
              .eq('category', 'flower')
              .order('priority_rank', { ascending: true })

            if (!error && data) {
              flowers = data
            }
          }

          return res.status(200).json({
            success: true,
            flowers,
            total: flowers.length
          })

        } catch (error) {
          console.error('Error fetching all flowers:', error)
          return res.status(500).json({
            success: false,
            error: 'Failed to fetch flowers'
          })
        }
      }
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })

  } catch (error) {
    console.error('Unexpected error in flower detail API:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    })
  }
}
