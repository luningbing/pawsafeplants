import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import formidable from 'formidable'

// Disable body parser for this API to handle large files
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  try {
    console.log('Chunked upload request received');
    
    if (req.method !== 'POST') {
      console.log('Method not allowed:', req.method);
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
    
    console.log('Processing chunked upload:', filename, 'Size:', file?.size);
    
    if (!file) {
      console.error('No file received');
      return res.status(400).json({ error: 'No file received' })
    }
    
    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      console.error('File too large:', file.size);
      return res.status(413).json({ error: 'File size exceeds 50MB limit' })
    }
    
    // Read file content
    const fileBuffer = fs.readFileSync(file.filepath);
    
    const supabaseUrl = process.env.SUPABASE_URL || ''
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
    
    if (supabaseUrl && supabaseKey) {
      console.log('Using Supabase storage');
      const client = createClient(supabaseUrl, supabaseKey)
      try { 
        await client.storage.createBucket('uploads', { public: true }) 
        console.log('Bucket created or exists');
      } catch (e) {
        console.log('Bucket creation error (may already exist):', e.message);
      }
      
      const { error } = await client.storage.from('uploads').upload(filename, fileBuffer, { 
        contentType: file.mimetype || 'application/octet-stream', 
        upsert: true 
      })
      
      if (error) {
        console.error('Supabase upload error:', error);
        return res.status(500).json({ error: String(error.message || error) })
      }
      
      const origin = process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl
      const publicUrl = origin.replace(/\/$/, '') + '/storage/v1/object/public/uploads/' + filename
      console.log('Upload successful:', publicUrl);
      
      // Clean up temp file
      fs.unlinkSync(file.filepath);
      
      return res.status(200).json({ path: publicUrl })
    }
    
    console.log('Using local filesystem storage');
    const dir = path.join(process.cwd(), 'public', 'uploads')
    try { 
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
        console.log('Created uploads directory:', dir);
      }
    } catch (e) {
      console.error('Directory creation error:', e);
    }
    
    const finalPath = path.join(dir, filename);
    fs.copyFileSync(file.filepath, finalPath)
    
    // Clean up temp file
    fs.unlinkSync(file.filepath);
    
    console.log('File saved locally:', finalPath);
    
    return res.status(200).json({ path: '/uploads/' + filename })
  } catch (e) {
    console.error('Chunked upload handler error:', e);
    res.status(500).json({ error: String(e?.message || e) })
  }
}
