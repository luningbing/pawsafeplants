-- Insert default admin credentials for PawSafePlants
-- Run this script in your Supabase SQL Editor

-- First, let's check if the table exists and get its structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'admin_credentials' 
ORDER BY ordinal_position;

-- Insert default user 'laifu' with bcrypt hashed password
-- Password: 'laifu123' (you can change this)
-- Hash generated with: bcrypt.hashSync('laifu123', 10)
INSERT INTO admin_credentials (
  username, 
  password_hash, 
  created_at
) VALUES (
  'laifu',
  '$2b$10$8xZuRZTjUZXEWWm0xH5OuuCQr.ePkssIYQguYxV3Qz1E4B8v2LU5u',
  NOW()
) ON CONFLICT (username) DO NOTHING;

-- Verify the insertion
SELECT * FROM admin_credentials WHERE username = 'laifu';

-- Note: If your table uses 'password' instead of 'password_hash', use this instead:
-- INSERT INTO admin_credentials (username, password, created_at)
-- VALUES ('laifu', '$2b$10$8xZuRZTjUZXEWWm0xH5OuuCQr.ePkssIYQguYxV3Qz1E4B8v2LU5u', NOW())
-- ON CONFLICT (username) DO NOTHING;
