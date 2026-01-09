-- Create the laifu user in admin_credentials table
-- Run this in your Supabase SQL Editor

-- First check if table exists and what columns it has
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'admin_credentials' 
ORDER BY ordinal_position;

-- Insert the user with correct password hash
INSERT INTO admin_credentials (
  username, 
  password_hash, 
  created_at
) VALUES (
  'laifu',
  '$2b$10$8xZuRZTjUZXEWWm0xH5OuuCQr.ePkssIYQguYxV3Qz1E4B8v2LU5u',
  NOW()
);

-- Verify the user was created
SELECT * FROM admin_credentials WHERE username = 'laifu';
