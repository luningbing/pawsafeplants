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

    console.log('🔄 开始更新blog_posts表结构...');

    // SQL语句执行
    const sqlStatements = [
      // 1. 增加 slug 字段（用于美化 URL，比如 /blog/valentine-guide）
      `ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS slug text UNIQUE;`,
      
      // 2. 增加 image_slots 字段 (核心！)
      // 这是一个 JSONB 格式，存储结构如：{"ring_bearer": "url1", "proposal": "url2"}
      `ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS image_slots JSONB DEFAULT '{}'::jsonb;`,
      
      // 3. 增加内容摘要，用于列表显示
      `ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS excerpt text;`
    ];

    const results = [];

    for (let i = 0; i < sqlStatements.length; i++) {
      const sql = sqlStatements[i];
      console.log(`📝 执行SQL ${i + 1}/${sqlStatements.length}: ${sql.substring(0, 50)}...`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql_statement: sql });
        
        if (error) {
          console.error(`❌ SQL ${i + 1} 执行失败:`, error);
          results.push({
            statement: sql,
            success: false,
            error: error.message
          });
        } else {
          console.log(`✅ SQL ${i + 1} 执行成功`);
          results.push({
            statement: sql,
            success: true,
            data: data
          });
        }
      } catch (error) {
        console.error(`❌ SQL ${i + 1} 执行异常:`, error);
        results.push({
          statement: sql,
          success: false,
          error: error.message
        });
      }
    }

    // 检查表结构是否更新成功
    console.log('🔍 检查表结构...');
    try {
      const { data: tableInfo, error: tableError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, column_default')
        .eq('table_name', 'blog_posts')
        .eq('table_schema', 'public')
        .in('column_name', ['slug', 'image_slots', 'excerpt']);

      if (tableError) {
        console.error('❌ 检查表结构失败:', tableError);
      } else {
        console.log('✅ 表结构检查结果:', tableInfo);
      }
    } catch (error) {
      console.error('❌ 检查表结构异常:', error);
    }

    // 统计执行结果
    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    console.log(`📊 执行完成: ${successCount} 成功, ${errorCount} 失败`);

    return res.status(200).json({
      success: true,
      message: 'Blog schema update completed',
      results: results,
      summary: {
        total: sqlStatements.length,
        success: successCount,
        errors: errorCount
      }
    });

  } catch (error) {
    console.error('🚨 Update blog schema API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
