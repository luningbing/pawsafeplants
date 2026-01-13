import { supabaseAdmin } from '../../lib/supabaseAdmin'
import formidable from 'formidable'

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('📸 Media API request:', { method: req.method, timestamp: new Date().toISOString() });

    if (req.method === 'GET') {
      // List all media files
      console.log('📋 Fetching media files from database...');
      const { data, error } = await supabaseAdmin
        .from('media_metadata')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Database error:', error)
        return res.status(500).json({ error: 'Failed to fetch media files', details: error })
      }

      console.log('✅ Media files fetched:', { count: data?.length || 0 });
      return res.status(200).json({ 
        success: true, 
        media: data || []
      })
    }

    if (req.method === 'POST') {
      // Handle file upload
      console.log('📤 Starting file upload process...');
      const form = formidable({ multiples: true })
      
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('❌ Form parse error:', err)
          return res.status(500).json({ error: 'Failed to parse form data', details: err.message })
        }

        try {
          const file = files.file
          if (!file) {
            console.error('❌ No file received in upload')
            return res.status(400).json({ error: 'No file uploaded' })
          }

          console.log('📁 Processing file:', { 
            name: file.originalFilename, 
            size: file.size, 
            type: file.type 
          });

          // Upload to Supabase Storage
          const fileName = `${Date.now()}-${file.originalFilename}`
          console.log('🚀 Uploading to Supabase Storage:', fileName);
          
          const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('images')
            .upload(fileName, file.filepath, {
              cacheControl: '3600',
              upsert: false
            })

          if (uploadError) {
            console.error('❌ Supabase upload error:', uploadError)
            return res.status(500).json({ 
              error: 'Failed to upload file to storage', 
              details: uploadError.message || uploadError 
            })
          }

          console.log('✅ Upload successful, getting public URL...');

          // Get public URL
          const { data: { publicUrl } } = supabaseAdmin.storage
            .from('images')
            .getPublicUrl(fileName)

          console.log('🔗 Public URL generated:', publicUrl);

          // Save metadata to database
          console.log('💾 Saving metadata to database...');
          const { data: metadataData, error: metadataError } = await supabaseAdmin
            .from('media_metadata')
            .insert({
              file_name: fileName,
              original_name: file.originalFilename,
              file_path: publicUrl,
              file_size: file.size,
              content_type: file.type,
              created_at: new Date().toISOString()
            })
            .select()

          if (metadataError) {
            console.error('❌ Metadata error:', metadataError)
            return res.status(500).json({ 
              error: 'Failed to save metadata', 
              details: metadataError.message || metadataError 
            })
          }

          console.log('✅ Complete upload success:', { 
            fileName, 
            originalName: file.originalFilename,
            publicUrl,
            metadataId: metadataData?.[0]?.id 
          });

          return res.status(200).json({ 
            success: true, 
            message: 'File uploaded successfully',
            data: {
              fileName,
              originalName: file.originalFilename,
              publicUrl,
              metadata: metadataData?.[0]
            }
          })
        } catch (error) {
          console.error('❌ Upload process error:', error)
          return res.status(500).json({ 
            error: 'Upload failed', 
            details: error.message || error 
          })
        }
      })
    }
  } catch (error) {
    console.error('💥 Media API critical error:', error)
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message || error 
    })
  }
}
