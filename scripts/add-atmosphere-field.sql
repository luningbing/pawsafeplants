-- 为 media_metadata 表添加 is_atmosphere 字段
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 添加 is_atmosphere 字段
ALTER TABLE media_metadata 
ADD COLUMN IF NOT EXISTS is_atmosphere BOOLEAN DEFAULT FALSE;

-- 2. 为新字段创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_media_metadata_is_atmosphere ON media_metadata(is_atmosphere);

-- 3. 创建视图方便查询氛围图
CREATE OR REPLACE VIEW atmosphere_images AS
SELECT 
  id,
  file_path,
  display_name,
  file_size,
  file_type,
  created_at,
  updated_at
FROM media_metadata 
WHERE is_atmosphere = TRUE
ORDER BY created_at DESC;

-- 4. 验证表结构
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'media_metadata' 
ORDER BY ordinal_position;

-- 5. 测试数据（可选）
-- UPDATE media_metadata 
-- SET is_atmosphere = TRUE 
-- WHERE display_name LIKE '%cat%' OR file_path LIKE '%cat%';

-- 6. 查看当前氛围图数量
SELECT 
  COUNT(*) as atmosphere_count,
  COUNT(*) FILTER (WHERE is_atmosphere = TRUE) as selected_count
FROM media_metadata;

SELECT '✅ media_metadata 表升级完成' as status;
