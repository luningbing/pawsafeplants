import { createClient } from '@supabase/supabase-js'

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

    // 验证管理员权限
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
      if (!decoded.username) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { sql } = req.body;

    if (!sql) {
      return res.status(400).json({ error: 'SQL statement is required' });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('🔄 执行SQL语句:', sql.substring(0, 100) + '...');

    try {
      // 使用Supabase的RPC执行SQL
      const { data, error } = await supabase.rpc('exec_sql', { sql_statement: sql });
      
      if (error) {
        console.error('❌ SQL执行失败:', error);
        return res.status(500).json({ 
          error: 'SQL execution failed',
          details: error.message 
        });
      }

      console.log('✅ SQL执行成功:', data);

      return res.status(200).json({
        success: true,
        message: 'SQL executed successfully',
        data: data
      });

    } catch (error) {
      console.error('❌ SQL执行异常:', error);
      return res.status(500).json({ 
        error: 'SQL execution failed',
        details: error.message 
      });
    }

  } catch (error) {
    console.error('🚨 Exec SQL API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
