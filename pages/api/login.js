import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default async function handler(req, res) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method === 'POST') {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      // Connect to Supabase
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase configuration');
        return res.status(500).json({ error: 'Database configuration missing' });
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      // Find user by username
      const { data: users, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!users) {
        console.log('User not found:', username);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, users.password_hash);

      if (!isValidPassword) {
        console.log('Invalid password for user:', username);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: users.id, 
          username: users.username 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Return success response
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: users.id,
          username: users.username,
          created_at: users.created_at
        }
      });

    } else if (req.method === 'GET') {
      // Verify token endpoint
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.status(200).json({
          message: 'Token is valid',
          user: decoded
        });
      } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Invalid token' });
      }

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
      console.error('Login API error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
}
