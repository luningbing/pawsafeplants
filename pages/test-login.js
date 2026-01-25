import { useState } from 'react';
import Head from 'next/head';

export default function TestLogin() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult('正在测试登录...');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'laifu',
          password: 'lailaifu'
        })
      });

      const data = await response.json();
      
      setResult(`响应状态: ${response.status}\n响应数据: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`错误: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>测试登录 - PawSafePlants</title>
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
          🔐 测试登录API
        </h1>

        <button
          onClick={testLogin}
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
          {loading ? '⏳ 测试中...' : '🧪 测试 laifu/lailaifu 登录'}
        </button>

        {result && (
          <div style={{
            backgroundColor: result.includes('success') ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${result.includes('success') ? '#bbf7d0' : '#fecaca'}`,
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
            📋 测试信息
          </h3>
          <div style={{ 
            fontSize: '14px',
            color: '#0c4a6e',
            lineHeight: '1.8'
          }}>
            <div>👤 用户名: laifu</div>
            <div>🔑 密码: lailaifu</div>
            <div>🔗 API: /api/auth/login</div>
            <div>📝 方法: POST</div>
          </div>
        </div>
      </div>
    </>
  );
}
