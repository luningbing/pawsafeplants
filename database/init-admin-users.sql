-- Supabase Database Initialization for Admin Users
-- Run this SQL in your Supabase SQL Editor

-- 1. Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for admin_users
-- Allow all operations on admin_users table
CREATE POLICY "Enable all operations for admin_users" ON admin_users
  FOR ALL USING (true)
  WITH CHECK (true);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS admin_users_username_idx ON admin_users(username);
CREATE INDEX IF NOT EXISTS admin_users_created_at_idx ON admin_users(created_at DESC);

-- 5. Grant permissions
GRANT ALL ON admin_users TO authenticated;
GRANT ALL ON admin_users TO service_role;

-- 6. Create function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Create trigger to automatically update updated_at
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 8. Insert default admin user (password: laifu)
-- This hash was generated using bcrypt with 12 salt rounds
INSERT INTO admin_users (username, password_hash) VALUES 
('laifu', '$2b$12$TR/r7cxiBGzfEjWVJUWpWOoPf4n/DnZTQrf3TJw9yjrpP5ArHx7Ea');

-- 9. Verify the user was created
SELECT * FROM admin_users WHERE username = 'laifu';
