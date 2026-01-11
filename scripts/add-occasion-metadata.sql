-- Create occasion-based meta tags database for seasonal search traffic
-- Target: North American and European markets

-- Create occasions table
CREATE TABLE IF NOT EXISTS plant_occasions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    meta_title VARCHAR(200),
    meta_description VARCHAR(300),
    meta_keywords TEXT,
    target_markets TEXT[], -- ['US', 'CA', 'UK', 'DE', 'EU']
    season VARCHAR(50), -- 'spring', 'summer', 'fall', 'winter', 'year-round'
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create plant_occasion_relations table
CREATE TABLE IF NOT EXISTS plant_occasion_relations (
    id SERIAL PRIMARY KEY,
    plant_id INTEGER REFERENCES media_metadata(id) ON DELETE CASCADE,
    occasion_id INTEGER REFERENCES plant_occasions(id) ON DELETE CASCADE,
    relevance_score INTEGER DEFAULT 5 CHECK (relevance_score >= 1 AND relevance_score <= 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(plant_id, occasion_id)
);

-- Insert occasion data for Birthday, Valentine's Day, Mother's Day
INSERT INTO plant_occasions (name, slug, description, meta_title, meta_description, meta_keywords, target_markets, season, sort_order) VALUES
(
    'Birthday',
    'birthday',
    'Cat-safe flowers perfect for birthday celebrations and gifts. Beautiful blooms that won''t harm your feline friends.',
    'Cat Safe Birthday Flowers - Pet Friendly Birthday Bouquets | PawSafePlants',
    'Discover beautiful cat-safe flowers for birthday celebrations. Perfect for pet-friendly birthday bouquets and gifts that keep cats safe while adding joy to special occasions.',
    'cat safe birthday flowers, pet friendly birthday bouquets, cat safe birthday gifts, non-toxic flowers for cats birthday, feline safe birthday arrangements, cat safe birthday plants',
    ARRAY['US', 'CA', 'UK', 'DE', 'EU'],
    'year-round',
    1
),
(
    'Valentine''s Day',
    'valentines-day',
    'Romantic cat-safe flowers for Valentine''s Day. Express your love without putting your cats at risk with these pet-friendly blooms.',
    'Cat Safe Valentine''s Day Flowers - Romantic Pet-Friendly Bouquets | PawSafePlants',
    'Find romantic cat-safe flowers for Valentine''s Day. Beautiful pet-friendly bouquets and arrangements that express your love while keeping your feline friends safe.',
    'cat safe valentine flowers, pet friendly valentine bouquets, cat safe valentine arrangements, non-toxic valentine flowers for cats, feline safe valentine gifts, cat safe romantic flowers',
    ARRAY['US', 'CA', 'UK', 'DE', 'EU'],
    'winter',
    2
),
(
    'Mother''s Day',
    'mothers-day',
    'Beautiful cat-safe flowers for Mother''s Day. Show mom you care with pet-friendly blooms that are safe for her furry companions.',
    'Cat Safe Mother''s Day Flowers - Pet Friendly Mom Bouquets | PawSafePlants',
    'Choose beautiful cat-safe flowers for Mother''s Day. Pet-friendly bouquets and arrangements that celebrate mom while keeping her beloved cats safe and healthy.',
    'cat safe mothers day flowers, pet friendly mothers day bouquets, cat safe mothers day gifts, non-toxic mothers day flowers for cats, feline safe mothers day plants, cat safe mom flowers',
    ARRAY['US', 'CA', 'UK', 'DE', 'EU'],
    'spring',
    3
),
(
    'Anniversary',
    'anniversary',
    'Celebrate your love with cat-safe anniversary flowers. Romantic blooms that won''t compromise your cats'' safety.',
    'Cat Safe Anniversary Flowers - Romantic Pet-Friendly Bouquets | PawSafePlants',
    'Find romantic cat-safe flowers for anniversaries. Beautiful pet-friendly bouquets that celebrate your love while keeping your feline family members safe.',
    'cat safe anniversary flowers, pet friendly anniversary bouquets, cat safe anniversary arrangements, non-toxic anniversary flowers for cats, feline safe anniversary gifts',
    ARRAY['US', 'CA', 'UK', 'DE', 'EU'],
    'year-round',
    4
),
(
    'Wedding',
    'wedding',
    'Stunning cat-safe flowers for weddings and bridal bouquets. Beautiful blooms that ensure all guests (including felines) stay safe.',
    'Cat Safe Wedding Flowers - Pet Friendly Bridal Bouquets | PawSafePlants',
    'Discover beautiful cat-safe flowers for weddings. Perfect for bridal bouquets, centerpieces, and arrangements that keep your feline friends safe on your special day.',
    'cat safe wedding flowers, pet friendly wedding bouquets, cat safe bridal flowers, non-toxic wedding flowers for cats, feline safe wedding arrangements, cat safe bridal bouquets',
    ARRAY['US', 'CA', 'UK', 'DE', 'EU'],
    'spring',
    5
),
(
    'Get Well Soon',
    'get-well-soon',
    'Cheerful cat-safe flowers for get well soon wishes. Bright blooms that lift spirits without harming cats.',
    'Cat Safe Get Well Flowers - Pet Friendly Recovery Bouquets | PawSafePlants',
    'Send cheerful cat-safe get well flowers. Bright pet-friendly bouquets that speed recovery while keeping feline friends safe and comfortable.',
    'cat safe get well flowers, pet friendly get well bouquets, cat safe recovery flowers, non-toxic get well flowers for cats, feline safe get well arrangements',
    ARRAY['US', 'CA', 'UK', 'DE', 'EU'],
    'year-round',
    6
),
(
    'Sympathy',
    'sympathy',
    'Thoughtful cat-safe flowers for sympathy and condolences. Gentle blooms that comfort without posing risks to cats.',
    'Cat Safe Sympathy Flowers - Pet Friendly Condolence Bouquets | PawSafePlants',
    'Choose thoughtful cat-safe sympathy flowers. Gentle pet-friendly bouquets that offer comfort while keeping feline family members safe during difficult times.',
    'cat safe sympathy flowers, pet friendly sympathy bouquets, cat safe condolence flowers, non-toxic sympathy flowers for cats, feline safe funeral flowers',
    ARRAY['US', 'CA', 'UK', 'DE', 'EU'],
    'year-round',
    7
)
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_plant_occasions_slug ON plant_occasions(slug);
CREATE INDEX IF NOT EXISTS idx_plant_occasions_active ON plant_occasions(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_plant_occasions_season ON plant_occasions(season, is_active);
CREATE INDEX IF NOT EXISTS idx_plant_occasion_relations_plant ON plant_occasion_relations(plant_id);
CREATE INDEX IF NOT EXISTS idx_plant_occasion_relations_occasion ON plant_occasion_relations(occasion_id);
CREATE INDEX IF NOT EXISTS idx_plant_occasion_relations_score ON plant_occasion_relations(relevance_score DESC);

-- Create view for occasion-based queries
CREATE OR REPLACE VIEW occasion_flowers AS
SELECT 
    p.id,
    p.file_path,
    p.display_name,
    p.category,
    p.is_flower,
    p.toxicity_level,
    p.summary,
    po.occasion_id,
    po.relevance_score,
    o.name as occasion_name,
    o.slug as occasion_slug,
    o.season,
    o.target_markets,
    p.created_at,
    p.updated_at
FROM media_metadata p
JOIN plant_occasion_relations por ON p.id = por.plant_id
JOIN plant_occasions o ON por.occasion_id = o.id
JOIN (
    SELECT occasion_id, MAX(relevance_score) as max_score
    FROM plant_occasion_relations
    GROUP BY occasion_id
) po ON o.id = po.occasion_id AND por.relevance_score = po.max_score
WHERE o.is_active = TRUE
  AND (p.is_flower = TRUE OR p.category = 'flower')
ORDER BY o.sort_order, por.relevance_score DESC, p.created_at DESC;

-- Create function to get flowers by occasion
CREATE OR REPLACE FUNCTION get_flowers_by_occasion(
    occasion_slug VARCHAR(100),
    market_code VARCHAR(10) DEFAULT 'US',
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
) RETURNS TABLE (
    id INTEGER,
    file_path TEXT,
    display_name TEXT,
    category VARCHAR(50),
    is_flower BOOLEAN,
    toxicity_level TEXT,
    summary TEXT,
    occasion_name VARCHAR(100),
    occasion_slug VARCHAR(100),
    season VARCHAR(50),
    relevance_score INTEGER,
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pf.id,
        pf.file_path,
        pf.display_name,
        pf.category,
        pf.is_flower,
        pf.toxicity_level,
        pf.summary,
        pf.occasion_name,
        pf.occasion_slug,
        pf.season,
        pf.relevance_score,
        pf.created_at
    FROM occasion_flowers pf
    WHERE pf.occasion_slug = get_flowers_by_occasion.occasion_slug
      AND (pf.target_markets @> ARRAY[market_code] OR pf.target_markets @> ARRAY['EU'])
    ORDER BY pf.relevance_score DESC, pf.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get occasion metadata
CREATE OR REPLACE FUNCTION get_occasion_metadata(occasion_slug VARCHAR(100)) RETURNS TABLE (
    name VARCHAR(100),
    slug VARCHAR(100),
    description TEXT,
    meta_title VARCHAR(200),
    meta_description VARCHAR(300),
    meta_keywords TEXT,
    target_markets TEXT[],
    season VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.name,
        o.slug,
        o.description,
        o.meta_title,
        o.meta_description,
        o.meta_keywords,
        o.target_markets,
        o.season
    FROM plant_occasions o
    WHERE o.slug = get_occasion_metadata.occasion_slug
      AND o.is_active = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Add comments
COMMENT ON TABLE plant_occasions IS 'Occasion-based metadata for seasonal search traffic targeting North American and European markets';
COMMENT ON TABLE plant_occasion_relations IS 'Many-to-many relationship between plants and occasions with relevance scoring';
COMMENT ON VIEW occasion_flowers IS 'Optimized view for querying flowers by occasion with market targeting';
COMMENT ON FUNCTION get_flowers_by_occasion IS 'Retrieve flowers filtered by occasion and target market with pagination';
COMMENT ON FUNCTION get_occasion_metadata IS 'Get SEO metadata for occasion pages including title, description, and keywords';
