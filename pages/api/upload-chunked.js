import fs from 'fs'
import path from 'path'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import formidable from 'formidable'

// Disable body parser for this API to handle large files
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  try {
    console.log('📤 Chunked upload request received:', { timestamp: new Date().toISOString() });
    
    if (req.method !== 'POST') {
      console.log('❌ Method not allowed:', req.method);
      return res.status(405).json({ error: 'Method not allowed' })
    }
    
    // Parse form data with formidable for better handling of large files
    const form = formidable({
      maxFileSize: 50 * 1024 * 1024, // 50MB limit
      keepExtensions: true,
    });
    
    const [fields, files] = await form.parse(req);
    
    const file = files.file?.[0];
    const filename = String(fields.filename?.[0] || file?.originalFilename || '').trim().replace(/[^a-zA-Z0-9._-]/g, '_');
    
    console.log('📁 Processing chunked upload:', { filename, size: file?.size });
    
    if (!file) {
      console.error('❌ No file received');
      return res.status(400).json({ error: 'No file received' })
    }
    
    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      console.error('❌ File too large:', file.size);
      return res.status(413).json({ error: 'File size exceeds 50MB limit' })
    }
    
    // Read file content
    const fileBuffer = fs.readFileSync(file.filepath);
    
    console.log('🚀 Uploading to Supabase Storage...');
    
    // Upload to Supabase Storage using supabaseAdmin
    const { error } = await supabaseAdmin.storage.from('uploads').upload(filename, fileBuffer, { 
      contentType: file.mimetype || 'application/octet-stream', 
      upsert: true 
    })
      
    if (error) {
      console.error('❌ Supabase upload error:', error);
      return res.status(500).json({ 
        error: 'Failed to upload to storage', 
        details: error.message || error 
      })
    }
      
    const origin = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rczfbgzghwiqpxihlexs.supabase.co'
    const publicUrl = origin.replace(/\/$/, '') + '/storage/v1/object/public/uploads/' + filename
    console.log('✅ Upload successful:', publicUrl);
      
    // Clean up temp file
    fs.unlinkSync(file.filepath);
      
    return res.status(200).json({ 
      success: true,
      message: 'File uploaded successfully',
      path: publicUrl 
    })
    
  } catch (error) {
    console.error('💥 Chunked upload handler error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message || error 
    })
  }
}
