-- Valentine's Day Atmosphere Images Database Entries
-- High-quality images for blog post and marketing materials

-- Insert Valentine's Day atmosphere images into media_metadata
INSERT INTO media_metadata (
    display_name,
    file_path,
    category,
    is_flower,
    safety_status,
    toxicity_level,
    gifting_occasions,
    search_intent,
    seo_slug,
    priority_rank,
    created_at,
    updated_at
) VALUES
-- 1. 温馨特写：猫咪与玫瑰花束 (强调安全)
(
    'valentines-cat-roses-cozy',
    'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=800&h=600&fit=crop&auto=format',
    'atmosphere',
    TRUE,
    'Safe',
    'Safe – Generally non-toxic to cats',
    ARRAY['Valentine''s Day', 'Romantic', 'Cozy'],
    ARRAY['cat with roses', 'valentine cat safe flowers', 'cozy pet photography', 'romantic cat home'],
    'valentines-cat-roses-cozy-atmosphere',
    1,
    NOW(),
    NOW()
),
-- 2. 情人节氛围：情侣与猫咪、向日葵 (家庭幸福感)
(
    'valentines-couple-cat-sunflowers-happy',
    'https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=800&h=600&fit=crop&auto=format',
    'atmosphere',
    TRUE,
    'Safe',
    'Safe – Generally non-toxic to cats',
    ARRAY['Valentine''s Day', 'Happy', 'Family', 'Sunflower'],
    ARRAY['valentine couple with cat', 'happy cat family', 'sunflower cat safe', 'valentine day atmosphere'],
    'valentines-couple-cat-sunflowers-happy-atmosphere',
    2,
    NOW(),
    NOW()
),
-- 3. 优雅特写：猫咪与盆栽兰花 (高雅安全)
(
    'valentines-cat-orchid-elegant',
    'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&h=600&fit=crop&auto=format',
    'atmosphere',
    TRUE,
    'Safe',
    'Safe – Generally non-toxic to cats',
    ARRAY['Valentine''s Day', 'Elegant', 'Orchid', 'Minimalist'],
    ARRAY['cat with orchid', 'elegant pet photography', 'valentine orchid safe', 'minimalist cat home'],
    'valentines-cat-orchid-elegant-atmosphere',
    3,
    NOW(),
    NOW()
),
-- 4. 对比图：警示：百合 vs 安全花 (信息图示)
(
    'valentines-lily-vs-safe-flowers-comparison',
    'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=800&h=400&fit=crop&auto=format',
    'atmosphere',
    TRUE,
    'Mixed',
    'Mixed – Contains both toxic and safe flowers',
    ARRAY['Valentine''s Day', 'Safety', 'Comparison', 'Educational'],
    ARRAY['lily toxicity cats', 'valentine flower safety', 'cat safe vs toxic flowers', 'flower safety guide'],
    'valentines-lily-vs-safe-flowers-comparison',
    4,
    NOW(),
    NOW()
),
-- 5. 温馨特写：猫咪与混合安全花束 (综合展示)
(
    'valentines-cat-mixed-safe-bouquet',
    'https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=800&h=600&fit=crop&auto=format',
    'atmosphere',
    TRUE,
    'Safe',
    'Safe – All flowers are non-toxic to cats',
    ARRAY['Valentine''s Day', 'Mixed Bouquet', 'Colorful', 'Happy'],
    ARRAY['valentine mixed flowers', 'cat safe bouquet', 'colorful valentine flowers', 'pet safe valentine'],
    'valentines-cat-mixed-safe-bouquet-atmosphere',
    5,
    NOW(),
    NOW()
)
ON CONFLICT (display_name) DO NOTHING;

-- Create view for Valentine's Day atmosphere images
CREATE OR REPLACE VIEW valentines_atmosphere_images AS
SELECT 
    id,
    display_name,
    file_path,
    category,
    is_flower,
    safety_status,
    toxicity_level,
    gifting_occasions,
    search_intent,
    seo_slug,
    priority_rank,
    created_at,
    updated_at
FROM media_metadata 
WHERE display_name LIKE 'valentines-%'
  AND category = 'atmosphere'
ORDER BY priority_rank ASC;

-- Create function to get Valentine's atmosphere images
CREATE OR REPLACE FUNCTION get_valentines_atmosphere_images() RETURNS TABLE (
    id INTEGER,
    display_name VARCHAR(200),
    file_path TEXT,
    safety_status VARCHAR(20),
    gifting_occasions TEXT[],
    search_intent TEXT[],
    seo_slug VARCHAR(200),
    priority_rank INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        id,
        display_name,
        file_path,
        safety_status,
        gifting_occasions,
        search_intent,
        seo_slug,
        priority_rank
    FROM media_metadata 
    WHERE display_name LIKE 'valentines-%'
      AND category = 'atmosphere'
    ORDER BY priority_rank ASC;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON VIEW valentines_atmosphere_images IS 'Valentine''s Day atmosphere images for blog posts and marketing materials';
COMMENT ON FUNCTION get_valentines_atmosphere_images() IS 'Retrieve all Valentine''s Day atmosphere images ordered by priority';

-- Create API endpoint data structure for blog integration
-- This will be used by the blog post to dynamically load images
