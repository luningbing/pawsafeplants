-- Insert user for your actual admin_credentials table structure
INSERT INTO admin_credentials (
  username, 
  hash,
  salt,
  iterations,
  algo,
  updated_at
) VALUES (
  'laifu',
  '$2b$10$8xZuRZTjUZXEWWm0xH5OuuCQr.ePkssIYQguYxV3Qz1E4B8v2LU5u',
  'some_salt_placeholder',
  10,
  'bcrypt',
  NOW()
);

-- Verify the user was created
SELECT * FROM admin_credentials WHERE username = 'laifu';
