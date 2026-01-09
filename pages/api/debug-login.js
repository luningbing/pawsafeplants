import { createSupabaseClient } from '../../lib/supabase';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method === 'GET') {
      const supabase = createSupabaseClient();
      
      try {
        // Check if admin_credentials table exists and has data
        const { data: tableInfo, error: tableError } = await supabase
          .from('admin_credentials')
          .select('*')
          .limit(1);
        
        if (tableError) {
          return res.status(500).json({ 
            error: 'Table query failed', 
            details: tableError.message 
          });
        }

        // Test password verification
        const testPassword = 'laifu123';
        const testHash = '$2b$10$8xZuRZTjUZXEWWm0xH5OuuCQr.ePkssIYQguYxV3Qz1E4B8v2LU5u';
        const isValid = await bcrypt.compare(testPassword, testHash);
        
        return res.status(200).json({
          message: 'Debug info',
          tableExists: true,
          hasData: tableInfo && tableInfo.length > 0,
          tableData: tableInfo,
          passwordTest: {
            password: testPassword,
            hash: testHash,
            isValid: isValid
          },
          envVars: {
            NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
            SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
            SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'
          }
        });
      } catch (error) {
        return res.status(500).json({ 
          error: 'Debug failed', 
          details: error.message 
        });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Debug API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
