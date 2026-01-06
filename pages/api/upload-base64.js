import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// Disable body parser for this API to handle large files
export const config = {
  api: {
    bodyParser: false,
  },
}

function parseDataUrl(s) {
  const m = String(s || '').match(/^data:(.+?);base64,(.+)$/)
  if (!m) return { mime: '', buf: Buffer.from([]) }
  const mime = m[1]
  const buf = Buffer.from(m[2], 'base64')
  return { mime, buf }
}

export default async function handler(req, res) {
  try {
    console.log('Upload request received');
    
    if (req.method !== 'POST') {
      console.log('Method not allowed:', req.method);
      return res.status(405).json({ error: 'Method not allowed' })
    }
    
    // Parse the body manually since bodyParser is disabled
    let body = '';
    for await (const chunk of req) {
      body += chunk.toString();
    }
    
    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (e) {
      console.error('JSON parse error:', e);
      return res.status(400).json({ error: 'Invalid JSON body' })
    }
    
    const filename = String((parsedBody || {}).filename || '').trim().replace(/[^a-zA-Z0-9._-]/g, '_')
    const data = String((parsedBody || {}).data || '')
    
    console.log('Processing upload:', filename, 'Data length:', data.length);
    
    if (!filename || !data) {
      console.error('Missing filename or data');
      return res.status(400).json({ error: 'Missing filename or data' })
    }
    
    const { mime, buf } = parseDataUrl(data)
    console.log('Parsed data:', { mime, bufferSize: buf.length });
    
    const ext = path.extname(filename) || (mime.includes('png') ? '.png' : mime.includes('svg') ? '.svg' : mime.includes('webp') ? '.webp' : '.jpg')
    const name = (filename ? filename.replace(/\.[^.]+$/, '') : ('upload-' + Date.now())) + ext
    
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
      
      const { error } = await client.storage.from('uploads').upload(name, buf, { 
        contentType: mime || 'application/octet-stream', 
        upsert: true 
      })
      
      if (error) {
        console.error('Supabase upload error:', error);
        return res.status(500).json({ error: String(error.message || error) })
      }
      
      const origin = process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl
      const publicUrl = origin.replace(/\/$/, '') + '/storage/v1/object/public/uploads/' + name
      console.log('Upload successful:', publicUrl);
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
    
    const filePath = path.join(dir, name);
    fs.writeFileSync(filePath, buf)
    console.log('File saved locally:', filePath);
    
    return res.status(200).json({ path: '/uploads/' + name })
  } catch (e) {
    console.error('Upload handler error:', e);
    res.status(500).json({ error: String(e?.message || e) })
  }
}
