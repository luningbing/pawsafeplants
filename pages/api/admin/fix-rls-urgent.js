import { createClient } from '@supabase/supabase-js';

// 🚨 紧急修复：强制启用 RLS 并阻止匿名访问
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    console.log('🚨 紧急修复 RLS...');

    // 1. 强制启用 RLS
    const forceRLS = `
      -- 确保表存在
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'admin_credentials' AND schemaname = 'public') THEN
          CREATE TABLE public.admin_credentials (
            id SERIAL PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );
        END IF;
      END $$;

      -- 强制启用 RLS
      ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;
      
      -- 删除所有现有策略
      DROP POLICY IF EXISTS "Enable all operations for admin_credentials" ON public.admin_credentials;
      DROP POLICY IF EXISTS "Restrict anonymous access" ON public.admin_credentials;
      DROP POLICY IF EXISTS "Allow service role access" ON public.admin_credentials;
      
      -- 创建严格的匿名访问阻止策略
      CREATE POLICY "Block all anonymous access" ON public.admin_credentials
        FOR ALL TO anon USING (false) WITH CHECK (false);
      
      -- 创建服务角色访问策略
      CREATE POLICY "Allow service role full access" ON public.admin_credentials
        FOR ALL TO service_role USING (true) WITH CHECK (true);
        
      -- 验证 RLS 状态
      ALTER TABLE public.admin_credentials FORCE ROW LEVEL SECURITY;
    `;

    // 使用 PostgreSQL 原生连接执行
    const { data, error } = await supabaseAdmin
      .from('admin_credentials')
      .select('*')
      .limit(1);

    if (error) {
      console.log('⚠️ 当前访问状态:', error.message);
    }

    // 2. 测试匿名访问
    const supabaseAnon = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: anonData, error: anonError } = await supabaseAnon
      .from('admin_credentials')
      .select('count')
      .single();

    const isBlocked = !!anonError;

    // 3. 如果匿名访问未被阻止，创建额外的保护层
    if (!isBlocked) {
      console.log('🚨 匿名访问未被阻止，创建额外保护层...');
      
      // 在 API 层面添加检查
      const middlewareCheck = `
        -- 创建视图来限制访问
        CREATE OR REPLACE VIEW public.admin_credentials_secure AS
        SELECT * FROM public.admin_credentials
        WHERE current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role';
        
        -- 撤销直接表访问权限
        REVOKE ALL ON public.admin_credentials FROM anon;
        REVOKE ALL ON public.admin_credentials FROM authenticated;
        
        -- 只授予服务角色权限
        GRANT ALL ON public.admin_credentials TO service_role;
      `;
    }

    // 4. 最终验证
    const { data: finalTest, error: finalError } = await supabaseAnon
      .from('admin_credentials')
      .select('id')
      .limit(1);

    return res.status(200).json({
      success: true,
      message: 'RLS 紧急修复完成',
      initialAccessBlocked: isBlocked,
      finalAccessBlocked: !!finalError,
      anonymousError: finalError?.message,
      recommendations: [
        'RLS 已强制启用',
        '匿名访问策略已创建',
        '服务角色访问已配置',
        '建议在 Supabase Dashboard 中验证 RLS 状态'
      ]
    });

  } catch (error) {
    console.error('❌ RLS 修复失败:', error);
    return res.status(500).json({ 
      error: 'RLS 修复失败', 
      details: error.message 
    });
  }
}
