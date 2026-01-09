-- First, let's check what columns exist in your admin_credentials table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'admin_credentials' 
ORDER BY ordinal_position;

-- Then try the insert with the correct column name
-- If the column is called 'password' instead of 'password_hash', use this:
INSERT INTO admin_credentials (
  username, 
  password, 
  created_at
) VALUES (
  'laifu',
  '$2b$10$8xZuRZTjUZXEWWm0xH5OuuCQr.ePkssIYQguYxV3Qz1E4B8v2LU5u',
  NOW()
);

-- Verify the user was created
SELECT * FROM admin_credentials WHERE username = 'laifu';
