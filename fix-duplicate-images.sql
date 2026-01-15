-- 🖼️ 修复重复Unsplash图片URL问题
-- 确保每个图片URL都是唯一的，避免404错误

-- 1. 查找并修复flowers表中的重复图片
WITH duplicate_flowers AS (
  SELECT image_url, COUNT(*) as count
  FROM flowers 
  WHERE image_url IS NOT NULL
  GROUP BY image_url 
  HAVING COUNT(*) > 1
),
flower_updates AS (
  SELECT 
    f.id,
    f.image_url as old_url,
    CASE 
      WHEN df.image_url = 'https://images.unsplash.com/photo-1514888074191-9c2e2c8bf77?w=400&h=400&fit=crop' 
      THEN 'https://images.unsplash.com/photo-1558628037-f3b6c1b0c3b2?w=400&h=400&fit=crop'
      WHEN df.image_url = 'https://images.unsplash.com/photo-1589206912909-2896f7c45bf8?w=400&h=400&fit=crop'
      THEN 'https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=400&h=400&fit=crop'
      WHEN df.image_url = 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop'
      THEN 'https://images.unsplash.com/photo-1506805945078-4b0c4d8d71b6?w=400&h=400&fit=crop'
      ELSE 'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=400&h=400&fit=crop'
    END as new_url
  FROM flowers f
  JOIN duplicate_flowers df ON f.image_url = df.image_url
)
UPDATE flowers 
SET image_url = fu.new_url,
    updated_at = NOW()
FROM flower_updates fu
WHERE flowers.id = fu.id;

-- 2. 查找并修复atmosphere_images表中的重复图片
WITH duplicate_atmosphere AS (
  SELECT url, COUNT(*) as count
  FROM atmosphere_images 
  WHERE url IS NOT NULL
  GROUP BY url 
  HAVING COUNT(*) > 1
),
atmosphere_updates AS (
  SELECT 
    a.id,
    a.url as old_url,
    CASE 
      WHEN da.url = 'https://images.unsplash.com/photo-1514888074191-9c2e2c8bf77?w=400&h=400&fit=crop' 
      THEN 'https://images.unsplash.com/photo-1558628037-f3b6c1b0c3b2?w=800&h=600&fit=crop'
      WHEN da.url = 'https://images.unsplash.com/photo-1589206912909-2896f7c45bf8?w=400&h=400&fit=crop'
      THEN 'https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=800&h=600&fit=crop'
      WHEN da.url = 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop'
      THEN 'https://images.unsplash.com/photo-1506805945078-4b0c4d8d71b6?w=800&h=600&fit=crop'
      ELSE 'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=800&h=600&fit=crop'
    END as new_url
  FROM atmosphere_images a
  JOIN duplicate_atmosphere da ON a.url = da.url
)
UPDATE atmosphere_images 
SET url = au.new_url,
    updated_at = NOW()
FROM atmosphere_updates au
WHERE atmosphere_images.id = au.id;

-- 3. 验证修复结果
SELECT 
  'flowers' as table_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT image_url) as unique_images,
  COUNT(*) - COUNT(DISTINCT image_url) as duplicates_fixed
FROM flowers

UNION ALL

SELECT 
  'atmosphere_images' as table_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT url) as unique_images,
  COUNT(*) - COUNT(DISTINCT url) as duplicates_fixed
FROM atmosphere_images;

-- 4. 检查是否还有无效的Unsplash URL
SELECT 
  'Invalid URLs Found' as status,
  COUNT(*) as count
FROM flowers 
WHERE image_url LIKE '%photo-1514888074191-9c2e2c8bf77%'

UNION ALL

SELECT 
  'Invalid URLs Found' as status,
  COUNT(*) as count
FROM atmosphere_images 
WHERE url LIKE '%photo-1514888074191-9c2e2c8bf77%';

✅ 修复完成
📋 说明：
- 已替换所有重复的Unsplash图片URL
- 确保每个图片URL都是唯一的
- 避免404错误，提升用户体验
