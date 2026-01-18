-- 🔍 检查RLS策略状态和权限问题
-- 用于诊断site_config和atmosphere_images表的访问权限

-- 1. 检查RLS是否启用
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('site_config', 'atmosphere_images', 'media_metadata');

-- 2. 检查现有的RLS策略
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
WHERE schemaname = 'public' 
    AND tablename IN ('site_config', 'atmosphere_images', 'media_metadata');

-- 3. 检查匿名用户(anon)的权限
SELECT 
    schemaname,
    tablename,
    privilege_type,
    grantee
FROM information_schema.role_table_grants 
WHERE schemaname = 'public' 
    AND tablename IN ('site_config', 'atmosphere_images', 'media_metadata')
    AND grantee = 'anon';

-- 4. 测试匿名用户访问权限
-- 模拟匿名用户查询site_config表
DO $$
BEGIN
    -- 设置为匿名用户角色
    SET ROLE anon;
    
    -- 尝试查询site_config
    BEGIN
        PERFORM 1 FROM site_config LIMIT 1;
        RAISE NOTICE '✅ site_config: 匿名用户可以访问';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ site_config: 匿名用户访问失败 - %', SQLERRM;
    END;
    
    -- 尝试查询atmosphere_images
    BEGIN
        PERFORM 1 FROM atmosphere_images LIMIT 1;
        RAISE NOTICE '✅ atmosphere_images: 匿名用户可以访问';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ atmosphere_images: 匿名用户访问失败 - %', SQLERRM;
    END;
    
    -- 尝试查询media_metadata
    BEGIN
        PERFORM 1 FROM media_metadata LIMIT 1;
        RAISE NOTICE '✅ media_metadata: 匿名用户可以访问';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ media_metadata: 匿名用户访问失败 - %', SQLERRM;
    END;
    
    -- 重置角色
    RESET ROLE;
END $$;

-- 5. 检查表结构
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('site_config', 'atmosphere_images', 'media_metadata')
ORDER BY table_name, ordinal_position;

-- 📋 诊断结果说明：
-- ✅ 如果RLS未启用：匿名用户应该可以访问
-- ❌ 如果RLS启用但没有anon策略：需要创建允许策略
-- ❌ 如果表不存在：需要创建表
-- ❌ 如果权限不足：需要授予SELECT权限
