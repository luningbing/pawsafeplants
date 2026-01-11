-- High-Quality Hero Carousel Images for Valentine's Day
-- Images: 1920x1080px+ resolution, bright & airy style

-- Image 1: Warm living room with cat and safe flowers
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
    is_atmosphere,
    created_at,
    updated_at
) VALUES (
    'valentines-cozy-living-room-cat-roses',
    'https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=1920&h=1080&fit=crop&auto=format',
    'atmosphere',
    TRUE,
    'Safe',
    'Safe – Generally non-toxic to cats',
    ARRAY['Valentine''s Day', 'Cozy', 'Living Room', 'Warm Lighting'],
    ARRAY['cat with roses valentine', 'cozy living room cat', 'warm home atmosphere', 'valentine cat safe flowers'],
    'valentines-cozy-living-room-cat-roses-atmosphere',
    1,
    TRUE,
    NOW(),
    NOW()
);

-- Image 2: Cat smelling orchid with bokeh background
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
    is_atmosphere,
    created_at,
    updated_at
) VALUES (
    'valentines-cat-orchid-bokeh-closeup',
    'https://images.unsplash.com/photo-1459411621453-1b7a9a1c6e?w=1920&h=1080&fit=crop&auto=format',
    'atmosphere',
    TRUE,
    'Safe',
    'Safe – Generally non-toxic to cats',
    ARRAY['Valentine''s Day', 'Orchid', 'Elegant', 'Close-up'],
    ARRAY['cat smelling orchid valentine', 'orchid close-up bokeh', 'elegant cat flower', 'valentine orchid safe'],
    'valentines-cat-orchid-bokeh-closeup-atmosphere',
    2,
    TRUE,
    NOW(),
    NOW()
);

-- Image 3: Proposal surprise with cat and gift box
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
    is_atmosphere,
    created_at,
    updated_at
) VALUES (
    'valentines-proposal-surprise-cat-gift-box',
    'https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=1920&h=1080&fit=crop&auto=format',
    'atmosphere',
    TRUE,
    'Safe',
    'Safe – Generally non-toxic to cats',
    ARRAY['Valentine''s Day', 'Proposal', 'Surprise', 'Gift Box', 'Romantic'],
    ARRAY['cat proposal surprise valentine', 'romantic cat gift box', 'valentine proposal atmosphere', 'cat safe proposal'],
    'valentines-proposal-surprise-cat-gift-box-atmosphere',
    3,
    TRUE,
    NOW(),
    NOW()
);

-- Update existing atmosphere images to mark as non-atmosphere
UPDATE media_metadata 
SET is_atmosphere = FALSE 
WHERE display_name LIKE '%valentines%' 
  AND is_atmosphere = TRUE;
