import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createSupabaseClient } from '../../../lib/supabase';

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

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Extract old and new passwords
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const supabase = createSupabaseClient();

    // Find user by username from admin_credentials table
    const { data: users, error: fetchError } = await supabase
      .from('admin_credentials')
      .select('*')
      .eq('username', decoded.username);

    if (fetchError) {
      console.error('Database error:', fetchError);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!users || users.length === 0) {
      console.log('User not found:', decoded.username);
      return res.status(401).json({ error: 'User not found' });
    }

    const user = users[0];

    // Verify old password - check if field name is hash, password_hash or password
    const passwordField = user.hash || user.password_hash || user.password;
    if (!passwordField) {
      console.error('Password field not found in admin_credentials table');
      return res.status(500).json({ error: 'Database configuration error' });
    }

    const isValidOldPassword = await bcrypt.compare(oldPassword, passwordField);
    if (!isValidOldPassword) {
      console.log('Invalid old password for user:', decoded.username);
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password in database
    const { error: updateError } = await supabase
      .from('admin_credentials')
      .update({ 
        hash: hashedNewPassword,
        updated_at: new Date().toISOString()
      })
      .eq('username', decoded.username);

    if (updateError) {
      console.error('Password update error:', updateError);
      return res.status(500).json({ error: 'Failed to update password' });
    }

    console.log('Password updated successfully for user:', decoded.username);

    return res.status(200).json({
      message: 'Password updated successfully',
      success: true
    });

  } catch (error) {
    console.error('Change password API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
