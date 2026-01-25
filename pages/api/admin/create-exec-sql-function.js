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

    console.log('🔄 创建exec_sql函数...');

    // 创建exec_sql函数的SQL
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
      RETURNS TABLE(result text)
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        -- 执行动态SQL并返回结果
        RETURN QUERY EXECUTE sql;
      END;
      $$;
    `;

    try {
      // 直接执行SQL创建函数
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .limit(1);

      console.log('📊 测试数据库连接:', { data, error });

      // 由于无法直接执行DDL，我们返回SQL让用户手动执行
      return res.status(200).json({
        success: true,
        message: 'exec_sql function creation SQL generated',
        sql: createFunctionSQL,
        instructions: `
请在Supabase SQL Editor中执行以下SQL来创建exec_sql函数：

${createFunctionSQL}

执行完成后，数据库设置功能将正常工作。
        `
      });

    } catch (error) {
      console.error('💥 创建函数失败:', error);
      return res.status(500).json({ 
        error: 'Function creation failed',
        details: error.message 
      });
    }

  } catch (error) {
    console.error('🚨 Create exec_sql function API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
