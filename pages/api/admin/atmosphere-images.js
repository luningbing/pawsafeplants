import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    if (req.method === 'GET') {
      // 获取所有氛围图
      const { data, error } = await supabase
        .from('media_metadata')
        .select('*')
        .eq('is_atmosphere', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Database error' });
      }

      return res.status(200).json({ 
        atmosphere_images: data || [],
        count: (data || []).length 
      });
    }

    if (req.method === 'POST') {
      // 设置图片为氛围图
      const { imageIds } = req.body;

      if (!Array.isArray(imageIds) || imageIds.length === 0) {
        return res.status(400).json({ error: 'Image IDs array is required' });
      }

      // 先将所有图片设为非氛围图
      await supabase
        .from('media_metadata')
        .update({ is_atmosphere: false })
        .eq('is_atmosphere', true);

      // 然后设置指定的图片为氛围图
      const { data, error } = await supabase
        .from('media_metadata')
        .update({ 
          is_atmosphere: true,
          updated_at: new Date().toISOString()
        })
        .in('id', imageIds)
        .select();

      if (error) {
        console.error('Update error:', error);
        return res.status(500).json({ error: 'Failed to update atmosphere images' });
      }

      return res.status(200).json({ 
        message: 'Atmosphere images updated successfully',
        updated_images: data || [],
        count: (data || []).length
      });
    }

    if (req.method === 'PUT') {
      // 切换单张图片的氛围图状态
      const { imageId, isAtmosphere } = req.body;

      if (!imageId || typeof isAtmosphere !== 'boolean') {
        return res.status(400).json({ error: 'Image ID and isAtmosphere boolean are required' });
      }

      const { data, error } = await supabase
        .from('media_metadata')
        .update({ 
          is_atmosphere: isAtmosphere,
          updated_at: new Date().toISOString()
        })
        .eq('id', imageId)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        return res.status(500).json({ error: 'Failed to update image status' });
      }

      if (!data) {
        return res.status(404).json({ error: 'Image not found' });
      }

      return res.status(200).json({ 
        message: `Image ${isAtmosphere ? 'added to' : 'removed from'} atmosphere images`,
        image: data
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Atmosphere API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
