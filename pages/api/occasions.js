import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase credentials for occasion API')
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
      const { occasion, market = 'US', limit = 20, offset = 0 } = req.query

      if (!occasion) {
        // Return all available occasions
        const occasions = [
          {
            id: 'birthday',
            name: 'Birthday',
            slug: 'birthday',
            description: 'Cat-safe flowers perfect for birthday celebrations and gifts.',
            metaTitle: 'Cat Safe Birthday Flowers - Pet Friendly Birthday Bouquets | PawSafePlants',
            metaDescription: 'Discover beautiful cat-safe flowers for birthday celebrations. Perfect for pet-friendly birthday bouquets and gifts.',
            keywords: 'cat safe birthday flowers, pet friendly birthday bouquets, cat safe birthday gifts',
            season: 'year-round',
            targetMarkets: ['US', 'CA', 'UK', 'DE', 'EU']
          },
          {
            id: 'valentines-day',
            name: "Valentine's Day",
            slug: 'valentines-day',
            description: 'Romantic cat-safe flowers for Valentine\'s Day.',
            metaTitle: "Cat Safe Valentine's Day Flowers - Romantic Pet-Friendly Bouquets | PawSafePlants",
            metaDescription: 'Find romantic cat-safe flowers for Valentine\'s Day. Beautiful pet-friendly bouquets that express your love.',
            keywords: 'cat safe valentine flowers, pet friendly valentine bouquets, cat safe valentine arrangements',
            season: 'winter',
            targetMarkets: ['US', 'CA', 'UK', 'DE', 'EU']
          },
          {
            id: 'mothers-day',
            name: "Mother's Day",
            slug: 'mothers-day',
            description: 'Beautiful cat-safe flowers for Mother\'s Day.',
            metaTitle: "Cat Safe Mother's Day Flowers - Pet Friendly Mom Bouquets | PawSafePlants",
            metaDescription: 'Choose beautiful cat-safe flowers for Mother\'s Day. Pet-friendly bouquets that celebrate mom.',
            keywords: 'cat safe mothers day flowers, pet friendly mothers day bouquets, cat safe mothers day gifts',
            season: 'spring',
            targetMarkets: ['US', 'CA', 'UK', 'DE', 'EU']
          },
          {
            id: 'anniversary',
            name: 'Anniversary',
            slug: 'anniversary',
            description: 'Celebrate your love with cat-safe anniversary flowers.',
            metaTitle: 'Cat Safe Anniversary Flowers - Romantic Pet-Friendly Bouquets | PawSafePlants',
            metaDescription: 'Find romantic cat-safe flowers for anniversaries. Beautiful pet-friendly bouquets that celebrate your love.',
            keywords: 'cat safe anniversary flowers, pet friendly anniversary bouquets, cat safe anniversary arrangements',
            season: 'year-round',
            targetMarkets: ['US', 'CA', 'UK', 'DE', 'EU']
          },
          {
            id: 'wedding',
            name: 'Wedding',
            slug: 'wedding',
            description: 'Stunning cat-safe flowers for weddings and bridal bouquets.',
            metaTitle: 'Cat Safe Wedding Flowers - Pet Friendly Bridal Bouquets | PawSafePlants',
            metaDescription: 'Discover beautiful cat-safe flowers for weddings. Perfect for bridal bouquets and centerpieces.',
            keywords: 'cat safe wedding flowers, pet friendly wedding bouquets, cat safe bridal flowers',
            season: 'spring',
            targetMarkets: ['US', 'CA', 'UK', 'DE', 'EU']
          },
          {
            id: 'get-well-soon',
            name: 'Get Well Soon',
            slug: 'get-well-soon',
            description: 'Cheerful cat-safe flowers for get well soon wishes.',
            metaTitle: 'Cat Safe Get Well Flowers - Pet Friendly Recovery Bouquets | PawSafePlants',
            metaDescription: 'Send cheerful cat-safe get well flowers. Bright pet-friendly bouquets that speed recovery.',
            keywords: 'cat safe get well flowers, pet friendly get well bouquets, cat safe recovery flowers',
            season: 'year-round',
            targetMarkets: ['US', 'CA', 'UK', 'DE', 'EU']
          },
          {
            id: 'sympathy',
            name: 'Sympathy',
            slug: 'sympathy',
            description: 'Thoughtful cat-safe flowers for sympathy and condolences.',
            metaTitle: 'Cat Safe Sympathy Flowers - Pet Friendly Condolence Bouquets | PawSafePlants',
            metaDescription: 'Choose thoughtful cat-safe sympathy flowers. Gentle pet-friendly bouquets that offer comfort.',
            keywords: 'cat safe sympathy flowers, pet friendly sympathy bouquets, cat safe condolence flowers',
            season: 'year-round',
            targetMarkets: ['US', 'CA', 'UK', 'DE', 'EU']
          }
        ]

        return res.status(200).json({
          success: true,
          occasions,
          total: occasions.length,
          market,
          last_updated: new Date().toISOString()
        })
      }

      // Get flowers for specific occasion
      try {
        let flowers = []
        
        if (supabase) {
          // Try to use the custom function first
          const { data: functionData, error: functionError } = await supabase
            .rpc('get_flowers_by_occasion', {
              occasion_slug: occasion,
              market_code: market,
              limit_count: parseInt(limit),
              offset_count: parseInt(offset)
            })

          if (!functionError && functionData) {
            flowers = functionData
          } else {
            // Fallback to manual query
            const { data, error } = await supabase
              .from('media_metadata')
              .select('*')
              .or('is_flower.eq.true,category.eq.flower')
              .order('created_at', { ascending: false })
              .limit(parseInt(limit))

            if (!error && data) {
              flowers = data.map(item => ({
                ...item,
                occasion_name: occasion.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                occasion_slug: occasion,
                relevance_score: 8,
                season: getSeasonForOccasion(occasion)
              }))
            }
          }
        }

        // If no data from database, return sample data
        if (flowers.length === 0) {
          flowers = getSampleFlowersForOccasion(occasion, market)
        }

        // Get occasion metadata
        const occasionMetadata = getOccasionMetadata(occasion)

        return res.status(200).json({
          success: true,
          flowers,
          occasion: occasionMetadata,
          market,
          pagination: {
            limit: parseInt(limit),
            offset: parseInt(offset),
            total: flowers.length
          },
          seo: {
            title: occasionMetadata.metaTitle,
            description: occasionMetadata.metaDescription,
            keywords: occasionMetadata.keywords,
            canonical: `https://www.pawsafeplants.com/occasions/${occasion}`
          },
          last_updated: new Date().toISOString()
        })

      } catch (error) {
        console.error('Error fetching occasion flowers:', error)
        
        // Return sample data as fallback
        const flowers = getSampleFlowersForOccasion(occasion, market)
        const occasionMetadata = getOccasionMetadata(occasion)

        return res.status(200).json({
          success: true,
          flowers,
          occasion: occasionMetadata,
          market,
          pagination: {
            limit: parseInt(limit),
            offset: parseInt(offset),
            total: flowers.length
          },
          seo: occasionMetadata,
          last_updated: new Date().toISOString()
        })
      }
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })

  } catch (error) {
    console.error('Unexpected error in occasion API:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    })
  }
}

// Helper functions
function getSeasonForOccasion(occasion) {
  const seasonMap = {
    'valentines-day': 'winter',
    'mothers-day': 'spring',
    'wedding': 'spring',
    'birthday': 'year-round',
    'anniversary': 'year-round',
    'get-well-soon': 'year-round',
    'sympathy': 'year-round'
  }
  return seasonMap[occasion] || 'year-round'
}

function getOccasionMetadata(occasion) {
  const metadataMap = {
    'birthday': {
      name: 'Birthday',
      slug: 'birthday',
      metaTitle: 'Cat Safe Birthday Flowers - Pet Friendly Birthday Bouquets | PawSafePlants',
      metaDescription: 'Discover beautiful cat-safe flowers for birthday celebrations. Perfect for pet-friendly birthday bouquets and gifts.',
      keywords: 'cat safe birthday flowers, pet friendly birthday bouquets, cat safe birthday gifts'
    },
    'valentines-day': {
      name: "Valentine's Day",
      slug: 'valentines-day',
      metaTitle: "Cat Safe Valentine's Day Flowers - Romantic Pet-Friendly Bouquets | PawSafePlants",
      metaDescription: 'Find romantic cat-safe flowers for Valentine\'s Day. Beautiful pet-friendly bouquets that express your love.',
      keywords: 'cat safe valentine flowers, pet friendly valentine bouquets, cat safe valentine arrangements'
    },
    'mothers-day': {
      name: "Mother's Day",
      slug: 'mothers-day',
      metaTitle: "Cat Safe Mother's Day Flowers - Pet Friendly Mom Bouquets | PawSafePlants",
      metaDescription: 'Choose beautiful cat-safe flowers for Mother\'s Day. Pet-friendly bouquets that celebrate mom.',
      keywords: 'cat safe mothers day flowers, pet friendly mothers day bouquets, cat safe mothers day gifts'
    }
  }
  return metadataMap[occasion] || metadataMap['birthday']
}

function getSampleFlowersForOccasion(occasion, market) {
  const baseFlowers = [
    {
      id: 1,
      name: 'Rose',
      file_path: 'https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=400&h=400&fit=crop',
      category: 'flower',
      is_flower: true,
      toxicity_level: 'Safe – generally non-toxic to cats',
      summary: 'Classic roses are safe for cats. Perfect for romantic occasions.',
      relevance_score: 10
    },
    {
      id: 2,
      name: 'Sunflower',
      file_path: 'https://images.unsplash.com/photo-1506805945078-4b0c4d8d71b6?w=400&h=400&fit=crop',
      category: 'flower',
      is_flower: true,
      toxicity_level: 'Safe – generally non-toxic to cats',
      summary: 'Bright and cheerful sunflowers bring joy to any celebration.',
      relevance_score: 9
    },
    {
      id: 3,
      name: 'Orchid',
      file_path: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop',
      category: 'flower',
      is_flower: true,
      toxicity_level: 'Safe – generally non-toxic to cats',
      summary: 'Elegant orchids add sophistication to special occasions.',
      relevance_score: 8
    }
  ]

  // Customize based on occasion
  const occasionCustomization = {
    'valentines-day': {
      summary: 'Perfect romantic choice for expressing love while keeping cats safe.',
      keywords: ['romantic', 'love', 'hearts', 'passion']
    },
    'mothers-day': {
      summary: 'Beautiful choice to show appreciation for mom while protecting her cats.',
      keywords: ['appreciation', 'love', 'gratitude', 'family']
    },
    'birthday': {
      summary: 'Cheerful and bright, perfect for celebrating special moments.',
      keywords: ['celebration', 'joy', 'festive', 'happy']
    }
  }

  const customization = occasionCustomization[occasion] || {}
  
  return baseFlowers.map((flower, index) => ({
    ...flower,
    occasion_name: occasion.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    occasion_slug: occasion,
    season: getSeasonForOccasion(occasion),
    summary: customization.summary || flower.summary,
    keywords: customization.keywords || [],
    created_at: new Date().toISOString()
  }))
}
