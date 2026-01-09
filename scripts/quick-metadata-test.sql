-- Quick test for media_metadata table
-- Run this in Supabase SQL Editor to verify the table exists and works

-- 1. Check if table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'media_metadata'
) as table_exists;

-- 2. Show table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'media_metadata' 
ORDER BY ordinal_position;

-- 3. Insert a test record (if table is empty)
INSERT INTO media_metadata (file_path, display_name, file_type, created_at, updated_at)
VALUES (
  '/uploads/test-image.jpg',
  '测试图片',
  'image/jpeg',
  NOW(),
  NOW()
) ON CONFLICT (file_path) DO NOTHING;

-- 4. Verify the test record
SELECT * FROM media_metadata WHERE file_path = '/uploads/test-image.jpg';

-- 5. Test update operation
UPDATE media_metadata 
SET display_name = '更新后的测试图片', updated_at = NOW()
WHERE file_path = '/uploads/test-image.jpg';

-- 6. Verify the update
SELECT * FROM media_metadata WHERE file_path = '/uploads/test-image.jpg';
