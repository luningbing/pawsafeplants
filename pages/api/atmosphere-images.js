import { createSupabaseClient } from '../../../lib/supabase';

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
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
