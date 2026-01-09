-- 步骤1：创建 media_metadata 表
CREATE TABLE media_metadata (
  id SERIAL PRIMARY KEY,
  file_path TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  file_size BIGINT DEFAULT 0,
  file_type TEXT DEFAULT 'unknown',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 步骤2：创建索引
CREATE INDEX idx_media_metadata_file_path ON media_metadata(file_path);
CREATE INDEX idx_media_metadata_created_at ON media_metadata(created_at);

-- 步骤3：创建触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 步骤4：创建触发器
CREATE TRIGGER update_media_metadata_updated_at
  BEFORE UPDATE ON media_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 步骤5：验证表创建
SELECT '✅ Table created successfully' as status;
