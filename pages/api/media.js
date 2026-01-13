import { createClient } from '@supabase/supabase-js'
import formidable from 'formidable'

// Emergency Hardcoded Fallback for Production
const HARDCODED_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjemZiZ3pnaHdpcXB4aWhsZXhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk5NDUwMSwiZXhwIjoyMDc1NTcwNTAxfQ.uF3IofVn0ZkFSM6aSYsWCmOWHl26ybxv_bwMST3Zsio'

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rczfbgzghwiqpxihlexs.supabase.co',
      HARDCODED_SERVICE_ROLE_KEY
    )

    if (req.method === 'GET') {
      // List all media files
      const { data, error } = await supabase
        .from('media_metadata')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Database error:', error)
        return res.status(500).json({ error: 'Failed to fetch media files' })
      }

      return res.status(200).json({ 
        success: true, 
        media: data || []
      })
    }

    if (req.method === 'POST') {
      // Handle file upload
      const form = formidable({ multiples: true })
      
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Form parse error:', err)
          return res.status(500).json({ error: 'Failed to parse form data' })
        }

        try {
          const file = files.file
          if (!file) {
            return res.status(400).json({ error: 'No file uploaded' })
          }

          // Upload to Supabase Storage
          const fileName = `${Date.now()}-${file.originalFilename}`
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('images')
            .upload(fileName, file.filepath, {
              cacheControl: '3600',
              upsert: false
            })

          if (uploadError) {
            console.error('Upload error:', uploadError)
            return res.status(500).json({ error: 'Failed to upload file' })
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(fileName)

          // Save metadata to database
          const { data: metadataData, error: metadataError } = await supabase
            .from('media_metadata')
            .insert({
              file_name: fileName,
              original_name: file.originalFilename,
              file_path: publicUrl,
              file_size: file.size,
              content_type: file.type,
              created_at: new Date().toISOString()
            })

          if (metadataError) {
            console.error('Metadata error:', metadataError)
            return res.status(500).json({ error: 'Failed to save metadata' })
          }

          return res.status(200).json({ 
            success: true, 
            message: 'File uploaded successfully',
            data: {
              fileName,
              originalName: file.originalFilename,
              publicUrl,
              metadata: metadataData
            }
          })
        } catch (error) {
          console.error('Upload error:', error)
          return res.status(500).json({ error: 'Upload failed' })
        }
      })
    }
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
