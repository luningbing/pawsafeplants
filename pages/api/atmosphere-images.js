import { createClient } from '@supabase/supabase-js'
import { createSupabaseClient } from '../../lib/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export default async function handler(req, res) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const supabase = createSupabaseClient();

    // 获取氛围图
    const { data, error } = await supabase
      .from('media_metadata')
      .select('file_path, display_name, created_at')
      .eq('is_atmosphere', true)
      .order('created_at', { ascending: false })
      .limit(8); // 限制最多8张氛围图

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    const atmosphereImages = (data || []).map(img => ({
      url: img.file_path,
      title: img.display_name,
      createdAt: img.created_at
    }));

    return res.status(200).json({ 
      atmosphere_images: atmosphereImages,
      count: atmosphereImages.length 
    });

  } catch (error) {
    console.error('Atmosphere images API error:', error);
    // 返回默认的英文氛围图数据
    const defaultImages = [
      {
        url: 'https://images.unsplash.com/photo-1514888074191-9c2e2c8bf77?w=400&h=400&fit=crop',
        title: 'Cozy Cat Corner',
        createdAt: new Date().toISOString()
      },
      {
        url: 'https://images.unsplash.com/photo-1574158610182-6e2bae4e4d3b?w=400&h=400&fit=crop',
        title: 'Happy Cat Home',
        createdAt: new Date().toISOString()
      },
      {
        url: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=400&h=400&fit=crop',
        title: 'Pet-Friendly Plants',
        createdAt: new Date().toISOString()
      },
      {
        url: 'https://images.unsplash.com/photo-1596854407941-7c9b1b6e9b1a?w=400&h=400&fit=crop',
        title: 'Cat Safe Garden',
        createdAt: new Date().toISOString()
      }
    ];
    
    return res.status(200).json({ 
      atmosphere_images: defaultImages,
      count: defaultImages.length 
    });
  }
}
