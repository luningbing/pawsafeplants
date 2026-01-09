-- Create media_metadata table for managing uploaded files
-- This table stores display names and metadata for uploaded images

-- Create the table
CREATE TABLE IF NOT EXISTS media_metadata (
  id SERIAL PRIMARY KEY,
  file_path TEXT UNIQUE NOT NULL, -- The actual file path (URL)
  display_name TEXT NOT NULL,     -- Human-readable name
  file_size BIGINT DEFAULT 0,     -- File size in bytes
  file_type TEXT DEFAULT 'unknown', -- MIME type
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_metadata_file_path ON media_metadata(file_path);
CREATE INDEX IF NOT EXISTS idx_media_metadata_created_at ON media_metadata(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE media_metadata ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access (you may need to adjust based on your auth system)
-- This allows all operations for authenticated users
CREATE POLICY IF NOT EXISTS "Admin full access to media_metadata" ON media_metadata
  FOR ALL USING (auth.role() = 'authenticated');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER IF NOT EXISTS update_media_metadata_updated_at
  BEFORE UPDATE ON media_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert existing files from uploads into metadata table
-- This is a one-time migration for existing files
INSERT INTO media_metadata (file_path, display_name, file_type)
SELECT 
  path as file_path,
  CASE 
    WHEN path LIKE '%/%' THEN SUBSTRING(path FROM POSITION('/' IN path) + 1)
    ELSE path
  END as display_name,
  CASE 
    WHEN path LIKE '%.jpg' OR path LIKE '%.jpeg' THEN 'image/jpeg'
    WHEN path LIKE '%.png' THEN 'image/png'
    WHEN path LIKE '%.gif' THEN 'image/gif'
    WHEN path LIKE '%.webp' THEN 'image/webp'
    ELSE 'image/unknown'
  END as file_type
FROM (
  -- This would need to be adapted based on your actual file storage
  SELECT '/uploads/example.jpg' as path
  UNION ALL
  SELECT '/uploads/example2.png' as path
) as existing_files
WHERE NOT EXISTS (
  SELECT 1 FROM media_metadata WHERE file_path = existing_files.path
);

-- Verify table creation
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'media_metadata' 
ORDER BY ordinal_position;
