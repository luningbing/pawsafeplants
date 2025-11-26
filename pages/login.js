import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() })
      });
      if (res.ok) {
        window.location.href = '/admin';
      } else {
        const j = await res.json().catch(() => ({}));
        setError(j.error || '登录失败');
      }
    } catch {
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 420, margin: '40px auto' }}>
      <h1>后台登录</h1>
      <p style={{ marginBottom: 12 }}><Link href="/">← 返回首页</Link></p>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>用户名</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="用户名" />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>密码</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="密码" />
        </label>
        {error && <div style={{ color: '#c00' }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>{loading ? '登录中...' : '登录'}</button>
      </form>
      <p style={{ marginTop: 12, color: '#666' }}>默认用户名密码可通过环境变量配置：`ADMIN_USERNAME` / `ADMIN_PASSWORD`。</p>
    </div>
  );
}