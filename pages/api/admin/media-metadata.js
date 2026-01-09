import { createSupabaseClient } from '../../../lib/supabase';

export default async function handler(req, res) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const supabase = createSupabaseClient();

    // Ensure media_metadata table exists
    try {
      await supabase.rpc('create_media_metadata_table', {});
    } catch (error) {
      // Table might already exist, ignore error
      console.log('Table creation check:', error.message);
    }

    if (req.method === 'GET') {
      // Get all media metadata
      const { data, error } = await supabase
        .from('media_metadata')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Database error' });
      }

      return res.status(200).json({ media: data || [] });
    }

    if (req.method === 'POST') {
      // Add new media metadata
      const { file_path, display_name, file_size, file_type } = req.body;

      if (!file_path) {
        return res.status(400).json({ error: 'File path is required' });
      }

      const { data, error } = await supabase
        .from('media_metadata')
        .insert({
          file_path,
          display_name: display_name || file_path.split('/').pop(),
          file_size: file_size || 0,
          file_type: file_type || 'unknown',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        return res.status(500).json({ error: 'Failed to save media metadata' });
      }

      return res.status(200).json({ media: data });
    }

    if (req.method === 'PUT') {
      // Update media metadata
      const { id, display_name } = req.body;

      if (!id || !display_name) {
        return res.status(400).json({ error: 'ID and display name are required' });
      }

      const { data, error } = await supabase
        .from('media_metadata')
        .update({
          display_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        return res.status(500).json({ error: 'Failed to update media metadata' });
      }

      return res.status(200).json({ media: data });
    }

    if (req.method === 'DELETE') {
      // Delete media metadata
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }

      const { error } = await supabase
        .from('media_metadata')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        return res.status(500).json({ error: 'Failed to delete media metadata' });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Media metadata API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
