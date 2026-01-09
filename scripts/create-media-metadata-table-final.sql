-- 创建 media_metadata 表
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 创建 media_metadata 表
CREATE TABLE IF NOT EXISTS media_metadata (
  id SERIAL PRIMARY KEY,
  file_path TEXT UNIQUE NOT NULL,           -- 文件路径（唯一标识）
  display_name TEXT NOT NULL,               -- 显示名称（用户友好的名称）
  file_size BIGINT DEFAULT 0,              -- 文件大小（字节）
  file_type TEXT DEFAULT 'unknown',        -- 文件类型（MIME类型）
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_media_metadata_file_path ON media_metadata(file_path);
CREATE INDEX IF NOT EXISTS idx_media_metadata_created_at ON media_metadata(created_at);

-- 3. 启用行级安全策略（RLS）
ALTER TABLE media_metadata ENABLE ROW LEVEL SECURITY;

-- 4. 创建策略（允许认证用户访问）
CREATE POLICY IF NOT EXISTS "Users can view media_metadata" ON media_metadata
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Users can insert media_metadata" ON media_metadata
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Users can update media_metadata" ON media_metadata
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Users can delete media_metadata" ON media_metadata
  FOR DELETE USING (auth.role() = 'authenticated');

-- 5. 创建自动更新 updated_at 的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_media_metadata_updated_at
  BEFORE UPDATE ON media_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. 为现有图片创建默认元数据记录
-- 这会为所有已上传的图片创建元数据
INSERT INTO media_metadata (file_path, display_name, file_type, created_at, updated_at)
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
    WHEN path LIKE '%.svg' THEN 'image/svg+xml'
    ELSE 'image/unknown'
  END as file_type,
  NOW() as created_at,
  NOW() as updated_at
FROM (
  -- 这里需要根据你的实际图片路径调整
  -- 假设你的图片在 /uploads/ 目录下
  SELECT '/uploads/' || filename as path
  FROM (
    VALUES 
      ('example1.jpg'),
      ('example2.png'),
      ('example3.gif')
    ) AS filenames(filename)
  UNION ALL
  -- 如果你有其他图片，可以在这里添加
  SELECT '/uploads/' || filename as path
  FROM (
    VALUES 
      ('cat-photo.jpg'),
      ('plant-image.png')
    ) AS filenames(filename)
) existing_files
WHERE NOT EXISTS (
  SELECT 1 FROM media_metadata WHERE file_path = existing_files.path
);

-- 7. 验证表创建成功
SELECT '✅ media_metadata table created successfully' as status;

-- 8. 显示表结构
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'media_metadata' 
ORDER BY ordinal_position;
