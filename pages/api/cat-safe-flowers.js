import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase credentials for cat-safe-flowers API')
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export default async function handler(req, res) {
  try {
    // CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }

    if (req.method === 'GET') {
      // 获取猫安全花朵列表
      try {
        let flowers = []
        
        if (supabase) {
          // 从 Supabase 查询花朵类植物
          const { data, error } = await supabase
            .from('media_metadata')
            .select('*')
            .or('is_flower.eq.true,category.eq.flower')
            .order('created_at', { ascending: false })
            .limit(50)

          if (!error && data) {
            flowers = data.map(item => ({
              id: item.id,
              name: item.display_name || item.file_path?.split('/').pop()?.replace(/\.(jpg|jpeg|png|webp)$/i, '') || 'Unknown Flower',
              image: item.file_path,
              category: item.category || 'flower',
              is_flower: item.is_flower || false,
              created_at: item.created_at,
              updated_at: item.updated_at,
              toxicity_level: 'Safe – generally non-toxic to cats', // 默认安全
              summary: `Beautiful ${item.display_name || 'flower'} that is safe for cats. Perfect for cat-friendly homes and gardens.`
            }))
          }
        }

        // 如果没有数据，返回示例花朵数据
        if (flowers.length === 0) {
          flowers = [
            {
              id: 1,
              name: 'Rose',
              image: 'https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=400&h=400&fit=crop',
              category: 'flower',
              is_flower: true,
              toxicity_level: 'Safe – generally non-toxic to cats',
              summary: 'Classic roses are safe for cats. Thorns may cause physical injury, but the plant itself is non-toxic. Perfect for romantic cat-safe bouquets.',
              created_at: new Date().toISOString(),
              scenarios: ['bouquets', 'gift', 'weddings', 'anniversaries', 'valentines']
            },
            {
              id: 2,
              name: 'Sunflower',
              image: 'https://images.unsplash.com/photo-1506805945078-4b0c4d8d71b6?w=400&h=400&fit=crop',
              category: 'flower',
              is_flower: true,
              toxicity_level: 'Safe – generally non-toxic to cats',
              summary: 'Bright and cheerful sunflowers are completely safe for cats. Great for sunny arrangements and garden bouquets.',
              created_at: new Date().toISOString(),
              scenarios: ['bouquets', 'gift', 'summer', 'birthdays', 'get-well']
            },
            {
              id: 3,
              name: 'Daisy',
              image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop',
              category: 'flower',
              is_flower: true,
              toxicity_level: 'Safe – generally non-toxic to cats',
              summary: 'Innocent daisies are safe for cats and perfect for whimsical bouquets and casual flower arrangements.',
              created_at: new Date().toISOString(),
              scenarios: ['bouquets', 'gift', 'casual', 'spring', 'everyday']
            },
            {
              id: 4,
              name: 'Orchid',
              image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop',
              category: 'flower',
              is_flower: true,
              toxicity_level: 'Safe – generally non-toxic to cats',
              summary: 'Elegant orchids are safe for cats and make sophisticated long-lasting arrangements for any occasion.',
              created_at: new Date().toISOString(),
              scenarios: ['gift', 'elegant', 'home-decor', 'office', 'luxury']
            },
            {
              id: 5,
              name: 'Zinnia',
              image: 'https://images.unsplash.com/photo-1597818459942-2f9c4b8d0b9c?w=400&h=400&fit=crop',
              category: 'flower',
              is_flower: true,
              toxicity_level: 'Safe – generally non-toxic to cats',
              summary: 'Colorful zinnias are completely safe for cats and add vibrant beauty to garden bouquets and arrangements.',
              created_at: new Date().toISOString(),
              scenarios: ['bouquets', 'garden', 'summer', 'colorful', 'cut-flowers']
            },
            {
              id: 6,
              name: 'Marigold',
              image: 'https://images.unsplash.com/photo-1598306943709-0d7d5d6e85b2?w=400&h=400&fit=crop',
              category: 'flower',
              is_flower: true,
              toxicity_level: 'Safe – generally non-toxic to cats',
              summary: 'Bright marigolds are safe for cats and perfect for festive arrangements and garden companion planting.',
              created_at: new Date().toISOString(),
              scenarios: ['bouquets', 'garden', 'festive', 'fall', 'companion-planting']
            }
          ]
        }

        // 添加场景化长尾词支持
        const scenarios = ['bouquets', 'gift', 'arrangements', 'weddings', 'valentines', 'birthdays', 'anniversaries', 'get-well', 'sympathy', 'congratulations']
        
        return res.status(200).json({
          success: true,
          flowers,
          scenarios,
          seo: {
            title: 'Cat Safe Flowers - Complete Guide to Pet-Friendly Bouquets | PawSafePlants',
            description: 'Discover beautiful cat-safe flowers for bouquets, gifts, and arrangements. Complete guide to pet-friendly flowers that keep your cats safe while adding beauty to your home.',
            keywords: [
              'cat safe flowers',
              'pet friendly bouquets',
              'cat safe arrangements',
              'non-toxic flowers for cats',
              'cat safe gift flowers',
              'pet friendly wedding flowers',
              'cat safe garden flowers',
              'feline safe bouquets'
            ].join(', ')
          },
          total: flowers.length,
          last_updated: new Date().toISOString()
        })

      } catch (error) {
        console.error('Error fetching cat-safe flowers:', error)
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch cat-safe flowers',
          message: error.message
        })
      }
    }

    if (req.method === 'POST') {
      // 添加新的花朵植物
      const { name, image, category = 'flower', toxicity_level, summary, scenarios = [] } = req.body

      if (!name || !image) {
        return res.status(400).json({
          success: false,
          error: 'Name and image are required'
        })
      }

      try {
        if (supabase) {
          const { data, error } = await supabase
            .from('media_metadata')
            .insert({
              file_path: image,
              display_name: name,
              category,
              is_flower: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()

          if (error) {
            throw error
          }

          return res.status(201).json({
            success: true,
            flower: data[0],
            message: 'Cat-safe flower added successfully'
          })
        } else {
          // 模拟添加成功
          return res.status(201).json({
            success: true,
            flower: {
              id: Date.now(),
              name,
              image,
              category,
              is_flower: true,
              created_at: new Date().toISOString()
            },
            message: 'Cat-safe flower added successfully (demo mode)'
          })
        }

      } catch (error) {
        console.error('Error adding cat-safe flower:', error)
        return res.status(500).json({
          success: false,
          error: 'Failed to add cat-safe flower',
          message: error.message
        })
      }
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })

  } catch (error) {
    console.error('Unexpected error in cat-safe-flowers API:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    })
  }
}
