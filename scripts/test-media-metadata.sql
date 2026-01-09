-- Test script to verify media_metadata table structure
-- Run this in Supabase SQL Editor to check if everything is set up correctly

-- 1. Check if table exists and show structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'media_metadata' 
ORDER BY ordinal_position;

-- 2. Check if table has any data
SELECT COUNT(*) as total_records FROM media_metadata;

-- 3. Show sample data (if any)
SELECT id, file_path, display_name, created_at 
FROM media_metadata 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. Test update operation (you can run this to test)
-- First find a record to update
SELECT id, file_path, display_name FROM media_metadata LIMIT 1;

-- Then update it (replace ID with actual ID from above)
-- UPDATE media_metadata 
-- SET display_name = '测试重命名', updated_at = NOW()
-- WHERE id = 1;

-- Verify the update
-- SELECT id, file_path, display_name, updated_at FROM media_metadata WHERE id = 1;
