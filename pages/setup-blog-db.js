import { useState } from 'react';
import Head from 'next/head';

export default function SetupBlogDB() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const setupDatabase = async () => {
    setLoading(true);
    setResult('正在设置数据库...');

    try {
      // 1. 更新表结构
      const schemaResponse = await fetch('/api/admin/supabase-sql-executor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: `
            ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS slug text UNIQUE;
            ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS image_slots JSONB DEFAULT '{}'::jsonb;
            ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS excerpt text;
          `
        })
      });

      const schemaResult = await schemaResponse.json();
      
      if (schemaResult.success) {
        setResult('✅ 表结构更新成功！正在迁移数据...');
        
        // 2. 迁移情人节博客数据
        const migrateResponse = await fetch('/api/admin/blog-migrate-industrial', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const migrateResult = await migrateResponse.json();
        
        if (migrateResult.success) {
          setResult('✅ 数据库设置完成！情人节博客已迁移！');
        } else {
          setResult(`❌ 数据迁移失败: ${migrateResult.error}`);
        }
      } else {
        setResult(`❌ 表结构更新失败: ${schemaResult.error}`);
      }
    } catch (error) {
      setResult(`❌ 错误: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>设置博客数据库 - PawSafePlants</title>
      </Head>

      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '40px 20px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '600',
          color: '#2d3748',
          marginBottom: '20px'
        }}>
          🗄️ 设置博客数据库
        </h1>

        <div style={{ 
          backgroundColor: '#f7fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h2 style={{ 
            fontSize: '18px',
            color: '#4a5568',
            marginBottom: '10px'
          }}>
            📋 执行步骤
          </h2>
          <ol style={{ 
            color: '#718096',
            lineHeight: '1.6',
            paddingLeft: '20px'
          }}>
            <li>添加 slug、image_slots、excerpt 字段到 blog_posts 表</li>
            <li>迁移情人节博客完整内容到数据库</li>
            <li>设置5个图片槽位数据</li>
            <li>验证前台博客页面显示</li>
          </ol>
        </div>

        <button
          onClick={setupDatabase}
          disabled={loading}
          style={{
            padding: '16px 32px',
            background: loading ? '#cbd5e0' : '#4299e1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '20px'
          }}
        >
          {loading ? '⏳ 设置中...' : '🚀 开始设置数据库'}
        </button>

        {result && (
          <div style={{
            backgroundColor: result.includes('✅') ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${result.includes('✅') ? '#bbf7d0' : '#fecaca'}`,
            borderRadius: '8px',
            padding: '20px',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: '14px'
          }}>
            {result}
          </div>
        )}

        <div style={{ 
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px'
        }}>
          <h3 style={{ 
            fontSize: '16px',
            color: '#0369a1',
            marginBottom: '10px'
          }}>
            🔗 相关链接
          </h3>
          <div style={{ 
            fontSize: '14px',
            color: '#0c4a6e',
            lineHeight: '1.8'
          }}>
            <div>📊 <a href="/admin/blog-table-test" target="_blank" style={{ color: '#0284c7' }}>博客列表测试</a></div>
            <div>✏️ <a href="/admin/blog-editor-test?id=1" target="_blank" style={{ color: '#0284c7' }}>编辑情人节博客</a></div>
            <div>📱 <a href="/blog/valentines-day-cat-safe-flowers-guide" target="_blank" style={{ color: '#0284c7' }}>前台博客页面</a></div>
            <div>🏠 <a href="/admin" target="_blank" style={{ color: '#0284c7' }}>管理后台</a></div>
          </div>
        </div>
      </div>
    </>
  );
}
