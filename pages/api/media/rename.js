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

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { fileId, displayName } = req.body;

    if (!fileId || !displayName) {
      return res.status(400).json({ error: 'fileId and displayName are required' });
    }

    if (displayName.trim().length === 0) {
      return res.status(400).json({ error: 'Display name cannot be empty' });
    }

    const supabase = createSupabaseClient();

    console.log('🔄 Renaming media:', { fileId, displayName });

    // Update display_name in media_metadata table
    const { data, error } = await supabase
      .from('media_metadata')
      .update({
        display_name: displayName.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', fileId)
      .select()
      .single();

    if (error) {
      console.error('❌ Database update error:', error);
      return res.status(500).json({ 
        error: 'Failed to update display name',
        details: error.message 
      });
    }

    if (!data) {
      console.error('❌ No media found with ID:', fileId);
      return res.status(404).json({ error: 'Media not found' });
    }

    console.log('✅ Successfully renamed media:', data);

    return res.status(200).json({
      success: true,
      message: 'Display name updated successfully',
      media: data
    });

  } catch (error) {
    console.error('❌ Rename API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
