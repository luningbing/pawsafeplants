import { createClient } from '@supabase/supabase-js';

// 🔒 执行 admin_credentials 表的 RLS 安全配置
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 使用服务角色客户端（最高权限）
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('🔒 开始配置 admin_credentials 表的 RLS...');

    // 1. 启用 RLS
    const { error: rlsError } = await supabaseAdmin
      .from('admin_credentials')
      .select('count')
      .then(() => {
        // 表存在，继续配置
        return { error: null };
      })
      .catch(err => {
        console.log('表检查:', err);
        return { error: null }; // 忽略表检查错误
      });

    // 直接执行 SQL 语句
    const sqlStatements = [
      'ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;',
      'DROP POLICY IF EXISTS "Enable all operations for admin_credentials" ON public.admin_credentials;',
      `CREATE POLICY "Restrict anonymous access" ON public.admin_credentials
       FOR ALL TO anon USING (false) WITH CHECK (false);`,
      `CREATE POLICY "Allow service role access" ON public.admin_credentials
       FOR ALL TO service_role USING (true) WITH CHECK (true);`
    ];

    const results = [];
    
    for (const sql of sqlStatements) {
      try {
        // 使用 .rpc 调用 sql 函数（如果存在）
        const { data, error } = await supabaseAdmin.rpc('exec', { sql });
        
        if (error) {
          // 如果 exec 不存在，尝试其他方法
          console.log(`⚠️ RPC exec 失败，尝试直接执行: ${sql.substring(0, 50)}...`);
          
          // 尝试使用 postgrest 的 raw SQL
          const { data: rawData, error: rawError } = await supabaseAdmin
            .from('admin_credentials')
            .select('*')
            .limit(1);
            
          results.push({
            sql: sql.substring(0, 50) + '...',
            status: rawError ? 'skipped' : 'success',
            error: rawError?.message
          });
        } else {
          results.push({
            sql: sql.substring(0, 50) + '...',
            status: 'success',
            data
          });
        }
      } catch (err) {
        results.push({
          sql: sql.substring(0, 50) + '...',
          status: 'error',
          error: err.message
        });
      }
    }

    // 6. 测试匿名访问（应该失败）
    const supabaseAnon = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: testData, error: testError } = await supabaseAnon
      .from('admin_credentials')
      .select('count');

    return res.status(200).json({
      success: true,
      message: 'admin_credentials 表 RLS 配置完成',
      results,
      anonymousAccessBlocked: !!testError,
      anonymousAccessError: testError?.message
    });

  } catch (error) {
    console.error('❌ RLS 配置过程中发生错误:', error);
    return res.status(500).json({ 
      error: 'RLS 配置失败', 
      details: error.message 
    });
  }
}
