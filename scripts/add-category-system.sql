-- 为植物数据添加分类标签系统
-- 支持 'flower', 'herb', 'succulent', 'tree', 'shrub' 等分类

-- 1. 为 media_metadata 表添加 category 字段
ALTER TABLE media_metadata 
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'plant',
ADD COLUMN IF NOT EXISTS is_flower BOOLEAN DEFAULT FALSE;

-- 2. 为 category 字段创建索引
CREATE INDEX IF NOT EXISTS idx_media_metadata_category 
ON media_metadata(category);

-- 3. 为 is_flower 字段创建索引
CREATE INDEX IF NOT EXISTS idx_media_metadata_is_flower 
ON media_metadata(is_flower);

-- 4. 创建花朵视图 - 专门用于查询花朵类植物
CREATE OR REPLACE VIEW flower_plants AS
SELECT 
    id,
    file_path,
    display_name,
    created_at,
    updated_at,
    category,
    is_flower
FROM media_metadata 
WHERE is_flower = TRUE 
   OR category = 'flower'
ORDER BY created_at DESC;

-- 5. 创建分类统计视图
CREATE OR REPLACE VIEW plant_category_stats AS
SELECT 
    category,
    COUNT(*) as count,
    COUNT(CASE WHEN is_flower = TRUE THEN 1 END) as flower_count
FROM media_metadata 
GROUP BY category
ORDER BY count DESC;

-- 6. 插入一些示例花朵数据（如果表为空）
INSERT INTO media_metadata (file_path, display_name, category, is_flower) 
SELECT 
    'cat-safe-rose.jpg',
    'Rose - Cat Safe Flower',
    'flower',
    TRUE
WHERE NOT EXISTS (SELECT 1 FROM media_metadata WHERE display_name = 'Rose - Cat Safe Flower')
LIMIT 1;

INSERT INTO media_metadata (file_path, display_name, category, is_flower) 
SELECT 
    'cat-safe-sunflower.jpg',
    'Sunflower - Cat Safe Flower',
    'flower',
    TRUE
WHERE NOT EXISTS (SELECT 1 FROM media_metadata WHERE display_name = 'Sunflower - Cat Safe Flower')
LIMIT 1;

INSERT INTO media_metadata (file_path, display_name, category, is_flower) 
SELECT 
    'cat-safe-daisy.jpg',
    'Daisy - Cat Safe Flower',
    'flower',
    TRUE
WHERE NOT EXISTS (SELECT 1 FROM media_metadata WHERE display_name = 'Daisy - Cat Safe Flower')
LIMIT 1;

-- 7. 创建更新分类的存储过程
CREATE OR REPLACE FUNCTION update_plant_category(
    p_id INTEGER,
    p_category VARCHAR(50),
    p_is_flower BOOLEAN DEFAULT FALSE
) RETURNS BOOLEAN AS $$
BEGIN
    UPDATE media_metadata 
    SET 
        category = p_category,
        is_flower = p_is_flower,
        updated_at = NOW()
    WHERE id = p_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- 8. 创建批量更新花朵分类的函数
CREATE OR REPLACE FUNCTION mark_as_flower(p_id INTEGER) RETURNS BOOLEAN AS $$
BEGIN
    UPDATE media_metadata 
    SET 
        category = 'flower',
        is_flower = TRUE,
        updated_at = NOW()
    WHERE id = p_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- 9. 创建获取花朵植物的函数
CREATE OR REPLACE FUNCTION get_flower_plants(
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
) RETURNS TABLE (
    id INTEGER,
    file_path TEXT,
    display_name TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        id,
        file_path,
        display_name,
        created_at,
        updated_at
    FROM media_metadata 
    WHERE is_flower = TRUE 
       OR category = 'flower'
    ORDER BY created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE media_metadata IS '植物媒体库，支持分类标签系统';
COMMENT ON COLUMN media_metadata.category IS '植物分类：flower, herb, succulent, tree, shrrub 等';
COMMENT ON COLUMN media_metadata.is_flower IS '是否为花朵类植物，便于快速查询';
COMMENT ON VIEW flower_plants IS '花朵类植物视图，专门用于查询猫安全花朵';
COMMENT ON VIEW plant_category_stats IS '植物分类统计视图';
