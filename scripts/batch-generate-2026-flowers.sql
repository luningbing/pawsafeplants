-- 2026 North American & European Popular Flowers Batch Generation
-- Create comprehensive plant entities for all 20 flowers with safety levels, SEO data, and gifting occasions

-- First, ensure we have the necessary columns
ALTER TABLE media_metadata 
ADD COLUMN IF NOT EXISTS common_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS scientific_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS family VARCHAR(100),
ADD COLUMN IF NOT EXISTS safety_status VARCHAR(20) CHECK (safety_status IN ('Safe', 'Mild', 'Toxic', 'Deadly')),
ADD COLUMN IF NOT EXISTS toxicity_symptoms TEXT,
ADD COLUMN IF NOT EXISTS gifting_occasions TEXT[],
ADD COLUMN IF NOT EXISTS search_intent TEXT[],
ADD COLUMN IF NOT EXISTS seo_slug VARCHAR(200),
ADD COLUMN IF NOT EXISTS priority_rank INTEGER DEFAULT 0;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_media_common_name ON media_metadata(common_name);
CREATE INDEX IF NOT EXISTS idx_media_scientific_name ON media_metadata(scientific_name);
CREATE INDEX IF NOT EXISTS idx_media_safety_status ON media_metadata(safety_status);
CREATE INDEX IF NOT EXISTS idx_media_gifting_occasions ON media_metadata USING GIN(gifting_occasions);
CREATE INDEX IF NOT EXISTS idx_media_priority_rank ON media_metadata(priority_rank);

-- Insert all 20 flowers with comprehensive data
INSERT INTO media_metadata (
    common_name,
    scientific_name,
    family,
    display_name,
    category,
    is_flower,
    safety_status,
    toxicity_level,
    toxicity_symptoms,
    gifting_occasions,
    search_intent,
    seo_slug,
    priority_rank,
    file_path,
    created_at,
    updated_at
) VALUES
-- 1. Peony (牡丹/芍药) - Toxic
(
    'Peony',
    'Paeonia lactiflora',
    'Paeoniaceae',
    'Peony',
    'flower',
    TRUE,
    'Toxic',
    'Toxic – Can cause gastrointestinal upset',
    'Vomiting, diarrhea, drooling, abdominal pain',
    ARRAY['Wedding', 'Anniversary', 'Birthday'],
    ARRAY['Peony bouquet delivery', 'Are peonies safe?'],
    'peony-toxicity-cats',
    1,
    'https://images.unsplash.com/photo-1558628037-f3b6c1b0c3b2?w=400&h=400&fit=crop',
    NOW(),
    NOW()
),
-- 2. Tulip (郁金香) - Toxic
(
    'Tulip',
    'Tulipa gesneriana',
    'Liliaceae',
    'Tulip',
    'flower',
    TRUE,
    'Toxic',
    'Toxic – Bulbs are highly toxic',
    'Intense gastrointestinal irritation, drooling, vomiting, diarrhea, depression',
    ARRAY['Spring', 'Birthday', 'Get Well'],
    ARRAY['Spring flower decor', 'Tulip toxicity cats'],
    'tulip-toxicity-cats',
    2,
    'https://images.unsplash.com/photo-1589206912909-2896f7c45bf8?w=400&h=400&fit=crop',
    NOW(),
    NOW()
),
-- 3. Rose (玫瑰) - Safe
(
    'Rose',
    'Rosa rubiginosa',
    'Rosaceae',
    'Rose',
    'flower',
    TRUE,
    'Safe',
    'Safe – Generally non-toxic to cats',
    'None (thorns may cause physical injury)',
    ARRAY['Valentine''s Day', 'Anniversary', 'Birthday', 'Wedding'],
    ARRAY['Classic romance', 'Cat safe roses'],
    'cat-safe-roses',
    3,
    'https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=400&h=400&fit=crop',
    NOW(),
    NOW()
),
-- 4. Snapdragon (金鱼草) - Safe
(
    'Snapdragon',
    'Antirrhinum majus',
    'Plantaginaceae',
    'Snapdragon',
    'flower',
    TRUE,
    'Safe',
    'Safe – Generally non-toxic to cats',
    'None',
    ARRAY['Birthday', 'Get Well', 'Anniversary'],
    ARRAY['Cottagecore flowers', 'Are snapdragons toxic?'],
    'cat-safe-snapdragons',
    4,
    'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=400&h=400&fit=crop',
    NOW(),
    NOW()
),
-- 5. Ranunculus (花毛茛) - Toxic
(
    'Ranunculus',
    'Ranunculus asiaticus',
    'Ranunculaceae',
    'Ranunculus',
    'flower',
    TRUE,
    'Toxic',
    'Toxic – All parts contain protoanemonin',
    'Drooling, vomiting, diarrhea, abdominal pain, skin irritation',
    ARRAY['Wedding', 'Birthday', 'Spring'],
    ARRAY['Wedding bouquet trends 2026', 'Ranunculus safety'],
    'ranunculus-toxicity-cats',
    5,
    'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=400&h=400&fit=crop',
    NOW(),
    NOW()
),
-- 6. Hydrangea (绣球花) - Toxic
(
    'Hydrangea',
    'Hydrangea macrophylla',
    'Hydrangeaceae',
    'Hydrangea',
    'flower',
    TRUE,
    'Toxic',
    'Toxic – Contains cyanogenic glycosides',
    'Vomiting, diarrhea, depression, lethargy, cyanosis',
    ARRAY['Birthday', 'Anniversary', 'Sympathy'],
    ARRAY['Blue hydrangea care', 'Hydrangea cat poisoning'],
    'hydrangea-toxicity-cats',
    6,
    'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=400&h=400&fit=crop',
    NOW(),
    NOW()
),
-- 7. Sunflowers (向日葵) - Safe
(
    'Sunflower',
    'Helianthus annuus',
    'Asteraceae',
    'Sunflower',
    'flower',
    TRUE,
    'Safe',
    'Safe – Generally non-toxic to cats',
    'None',
    ARRAY['Birthday', 'Get Well', 'Summer'],
    ARRAY['Summer vibes', 'Non-toxic sunflower gifts'],
    'cat-safe-sunflowers',
    7,
    'https://images.unsplash.com/photo-1506805945078-4b0c4d8d71b6?w=400&h=400&fit=crop',
    NOW(),
    NOW()
),
-- 8. Carnation (康乃馨) - Mild
(
    'Carnation',
    'Dianthus caryophyllus',
    'Caryophyllaceae',
    'Carnation',
    'flower',
    TRUE,
    'Mild',
    'Mild – May cause mild gastrointestinal upset',
    'Mild vomiting, diarrhea, skin irritation',
    ARRAY['Mother''s Day', 'Birthday', 'Anniversary'],
    ARRAY['Mother''s day flowers', 'Cheap flower bouquet'],
    'carnation-toxicity-cats',
    8,
    'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=400&h=400&fit=crop',
    NOW(),
    NOW()
),
-- 9. Dahlia (大丽花) - Mild
(
    'Dahlia',
    'Dahlia pinnata',
    'Asteraceae',
    'Dahlia',
    'flower',
    TRUE,
    'Mild',
    'Mild – May cause mild gastrointestinal upset',
    'Mild vomiting, diarrhea, drooling',
    ARRAY['Birthday', 'Anniversary', 'Garden'],
    ARRAY['Dahlia garden style', 'Dahlia and cats'],
    'dahlia-toxicity-cats',
    9,
    'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=400&h=400&fit=crop',
    NOW(),
    NOW()
),
-- 10. Orchid (兰花/蝴蝶兰) - Safe
(
    'Orchid',
    'Phalaenopsis amabilis',
    'Orchidaceae',
    'Orchid',
    'flower',
    TRUE,
    'Safe',
    'Safe – Generally non-toxic to cats',
    'None',
    ARRAY['Luxury', 'Anniversary', 'Birthday', 'Get Well'],
    ARRAY['Luxury home decor', 'Safe orchids for pets'],
    'cat-safe-orchids',
    10,
    'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop',
    NOW(),
    NOW()
),
-- 11. Lily (百合) - Deadly
(
    'Lily',
    'Lilium longiflorum',
    'Liliaceae',
    'Lily',
    'flower',
    TRUE,
    'Deadly',
    'Deadly – Extremely toxic, can cause acute kidney failure',
    'Vomiting, lethargy, loss of appetite, kidney failure, death',
    ARRAY['Easter', 'Wedding', 'Funeral'],
    ARRAY['Easter Lily danger', 'Lily pollen cat death'],
    'lily-deadly-toxicity-cats',
    11,
    'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=400&h=400&fit=crop',
    NOW(),
    NOW()
),
-- 12. Freesia (小苍兰) - Safe
(
    'Freesia',
    'Freesia refracta',
    'Iridaceae',
    'Freesia',
    'flower',
    TRUE,
    'Safe',
    'Safe – Generally non-toxic to cats',
    'None',
    ARRAY['Birthday', 'Anniversary', 'Get Well'],
    ARRAY['Fragrant bouquets', 'Freesia cat safe'],
    'cat-safe-freesia',
    12,
    'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=400&h=400&fit=crop',
    NOW(),
    NOW()
),
-- 13. Daisy (雏菊/格桑花) - Toxic
(
    'Daisy',
    'Bellis perennis',
    'Asteraceae',
    'Daisy',
    'flower',
    TRUE,
    'Toxic',
    'Toxic – Contains sesquiterpene lactones',
    'Vomiting, diarrhea, drooling, skin irritation, lethargy',
    ARRAY['Birthday', 'Get Well', 'Summer'],
    ARRAY['Wildflower aesthetic', 'Daisy toxicity'],
    'daisy-toxicity-cats',
    13,
    'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=400&h=400&fit=crop',
    NOW(),
    NOW()
),
-- 14. Lisianthus (洋桔梗) - Safe
(
    'Lisianthus',
    'Eustoma grandiflorum',
    'Gentianaceae',
    'Lisianthus',
    'flower',
    TRUE,
    'Safe',
    'Safe – Generally non-toxic to cats',
    'None',
    ARRAY['Wedding', 'Anniversary', 'Birthday'],
    ARRAY['Elegant floral design', 'Pet friendly lisianthus'],
    'cat-safe-lisianthus',
    14,
    'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=400&h=400&fit=crop',
    NOW(),
    NOW()
),
-- 15. Anemone (银莲花) - Toxic
(
    'Anemone',
    'Anemone hupehensis',
    'Ranunculaceae',
    'Anemone',
    'flower',
    TRUE,
    'Toxic',
    'Toxic – Contains protoanemonin',
    'Drooling, vomiting, diarrhea, abdominal pain, skin irritation',
    ARRAY['Wedding', 'Birthday', 'Spring'],
    ARRAY['Modern wedding flowers', 'Anemone safety'],
    'anemone-toxicity-cats',
    15,
    'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=400&h=400&fit=crop',
    NOW(),
    NOW()
),
-- 16. Lavender (薰衣草) - Toxic
(
    'Lavender',
    'Lavandula angustifolia',
    'Lamiaceae',
    'Lavender',
    'flower',
    TRUE,
    'Toxic',
    'Toxic – Contains linalool and linalyl acetate',
    'Nausea, vomiting, lethargy, liver damage in large amounts',
    ARRAY['Relaxation', 'Sleep', 'Birthday'],
    ARRAY['Calming scent', 'Lavender oil and cats'],
    'lavender-toxicity-cats',
    16,
    'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=400&h=400&fit=crop',
    NOW(),
    NOW()
),
-- 17. Gerbera (非洲菊) - Safe
(
    'Gerbera',
    'Gerbera jamesonii',
    'Asteraceae',
    'Gerbera Daisy',
    'flower',
    TRUE,
    'Safe',
    'Safe – Generally non-toxic to cats',
    'None',
    ARRAY['Birthday', 'Get Well', 'Congratulations'],
    ARRAY['Bright colorful flowers', 'Gerbera daisy cats'],
    'cat-safe-gerbera',
    17,
    'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=400&h=400&fit=crop',
    NOW(),
    NOW()
),
-- 18. Statice (勿忘我/补血草) - Safe
(
    'Statice',
    'Limonium sinuatum',
    'Plumbaginaceae',
    'Statice',
    'flower',
    TRUE,
    'Safe',
    'Safe – Generally non-toxic to cats',
    'None',
    ARRAY['Dried flowers', 'Birthday', 'Anniversary'],
    ARRAY['Dried flowers', 'Statice cat friendly'],
    'cat-safe-statice',
    18,
    'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=400&h=400&fit=crop',
    NOW(),
    NOW()
),
-- 19. Chrysanthemum (菊花) - Toxic
(
    'Chrysanthemum',
    'Chrysanthemum morifolium',
    'Asteraceae',
    'Chrysanthemum',
    'flower',
    TRUE,
    'Toxic',
    'Toxic – Contains pyrethrins',
    'Vomiting, diarrhea, drooling, incoordination, skin irritation',
    ARRAY['Autumn', 'Birthday', 'Sympathy'],
    ARRAY['Autumn decor', 'Mums and cat safety'],
    'chrysanthemum-toxicity-cats',
    19,
    'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=400&h=400&fit=crop',
    NOW(),
    NOW()
),
-- 20. Alstroemeria (六出花) - Mild
(
    'Alstroemeria',
    'Alstroemeria aurea',
    'Alstroemeriaceae',
    'Alstroemeria',
    'flower',
    TRUE,
    'Mild',
    'Mild – May cause mild gastrointestinal upset',
    'Mild vomiting, diarrhea, drooling, skin irritation',
    ARRAY['Birthday', 'Anniversary', 'Get Well'],
    ARRAY['Long lasting flowers', 'Peruvian lily cats'],
    'alstroemeria-toxicity-cats',
    20,
    'https://images.unsplash.com/photo-1598306948263-8e4b4898d6b5?w=400&h=400&fit=crop',
    NOW(),
    NOW()
)
ON CONFLICT (common_name) DO NOTHING;

-- Create a function to get flower by SEO slug
CREATE OR REPLACE FUNCTION get_flower_by_slug(flower_slug VARCHAR(200)) RETURNS TABLE (
    id INTEGER,
    common_name VARCHAR(200),
    scientific_name VARCHAR(200),
    family VARCHAR(100),
    display_name VARCHAR(200),
    safety_status VARCHAR(20),
    toxicity_level TEXT,
    toxicity_symptoms TEXT,
    gifting_occasions TEXT[],
    search_intent TEXT[],
    seo_slug VARCHAR(200),
    priority_rank INTEGER,
    file_path TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        id,
        common_name,
        scientific_name,
        family,
        display_name,
        safety_status,
        toxicity_level,
        toxicity_symptoms,
        gifting_occasions,
        search_intent,
        seo_slug,
        priority_rank,
        file_path,
        created_at,
        updated_at
    FROM media_metadata 
    WHERE seo_slug = get_flower_by_slug.flower_slug
      AND category = 'flower'
    ORDER BY priority_rank ASC;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get flowers by safety status
CREATE OR REPLACE FUNCTION get_flowers_by_safety(status_filter VARCHAR(20)) RETURNS TABLE (
    id INTEGER,
    common_name VARCHAR(200),
    scientific_name VARCHAR(200),
    safety_status VARCHAR(20),
    toxicity_level TEXT,
    display_name VARCHAR(200),
    file_path TEXT,
    gifting_occasions TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        id,
        common_name,
        scientific_name,
        safety_status,
        toxicity_level,
        display_name,
        file_path,
        gifting_occasions
    FROM media_metadata 
    WHERE safety_status = get_flowers_by_safety.status_filter
      AND category = 'flower'
    ORDER BY priority_rank ASC;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get flowers by gifting occasion
CREATE OR REPLACE FUNCTION get_flowers_by_occasion(occasion_name TEXT) RETURNS TABLE (
    id INTEGER,
    common_name VARCHAR(200),
    safety_status VARCHAR(20),
    display_name VARCHAR(200),
    file_path TEXT,
    priority_rank INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        id,
        common_name,
        safety_status,
        display_name,
        file_path,
        priority_rank
    FROM media_metadata 
    WHERE category = 'flower'
      AND gifting_occasions @> ARRAY[occasion_name]
    ORDER BY priority_rank ASC;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE media_metadata IS 'Enhanced media metadata with 2026 popular flowers including safety levels, SEO data, and gifting occasions';
COMMENT ON COLUMN media_metadata.common_name IS 'English common name of the flower';
COMMENT ON COLUMN media_metadata.scientific_name IS 'Latin scientific name of the flower';
COMMENT ON COLUMN media_metadata.safety_status IS 'Safety status: Safe, Mild, Toxic, Deadly';
COMMENT ON COLUMN media_METADATA.toxicity_symptoms IS 'Detailed symptoms of toxicity in cats';
COMMENT ON COLUMN media_metadata.gifting_occasions IS 'Array of suitable gifting occasions';
COMMENT ON COLUMN media_metadata.search_intent IS 'Array of target search intents and keywords';
COMMENT ON COLUMN media_metadata.seo_slug IS 'SEO-friendly URL slug for the flower page';
COMMENT ON COLUMN media_metadata.priority_rank IS 'Priority ranking for search results (1=highest)';

-- Create a view for safe flowers (for easy querying)
CREATE OR REPLACE VIEW safe_flowers_2026 AS
SELECT 
    id,
    common_name,
    scientific_name,
    family,
    display_name,
    safety_status,
    toxicity_level,
    file_path,
    gifting_occasions,
    search_intent,
    seo_slug,
    priority_rank,
    created_at,
    updated_at
FROM media_metadata 
WHERE safety_status IN ('Safe', 'Mild')
  AND category = 'flower'
ORDER BY priority_rank ASC;

-- Create a view for toxic flowers (with warnings)
CREATE OR REPLACE VIEW toxic_flowers_2026 AS
SELECT 
    id,
    common_name,
    scientific_name,
    family,
    display_name,
    safety_status,
    toxicity_level,
    toxicity_symptoms,
    file_path,
    gifting_occasions,
    search_intent,
    seo_slug,
    priority_rank,
    created_at,
    updated_at
FROM media_metadata 
WHERE safety_status IN ('Toxic', 'Deadly')
  AND category = 'flower'
ORDER BY 
    CASE 
        WHEN safety_status = 'Deadly' THEN 1
        WHEN safety_status = 'Toxic' THEN 2
        ELSE 3
    END,
    priority_rank ASC;
