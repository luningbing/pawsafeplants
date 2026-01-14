-- 🔒 启用 admin_credentials 表的 RLS (Row Level Security)
-- 确保敏感数据不被未授权访问

-- 1. 启用 RLS
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

-- 2. 删除现有策略（如果存在）
DROP POLICY IF EXISTS "Enable all operations for admin_credentials" ON public.admin_credentials;

-- 3. 创建严格的访问策略 - 禁止所有匿名访问
CREATE POLICY "Restrict anonymous access" ON public.admin_credentials
    FOR ALL
    TO anon
    USING (false)
    WITH CHECK (false);

-- 4. 创建服务角色访问策略 - 仅限内部使用
CREATE POLICY "Allow service role access" ON public.admin_credentials
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 5. 验证策略已创建
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'admin_credentials';

-- 6. 检查表状态
SELECT 
    tablename,
    rowsecurity,
    forcerlspolicy
FROM pg_tables 
WHERE tablename = 'admin_credentials' AND schemaname = 'public';

-- ✅ 安全配置完成
-- 📋 说明：
-- - 匿名用户 (anon) 完全无法访问 admin_credentials 表
-- - 只有服务角色 (service_role) 可以访问此表
-- - 所有前端 API 调用将被阻止
-- - 后端 API 使用 supabaseAdmin 可以正常访问
