-- Hero Carousel Table for Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS hero_carousel (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE hero_carousel ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Enable all operations for hero_carousel" ON hero_carousel
  FOR ALL USING (true)
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS hero_carousel_created_at_idx ON hero_carousel(created_at DESC);

-- Grant permissions
GRANT ALL ON hero_carousel TO authenticated;
GRANT ALL ON hero_carousel TO service_role;
