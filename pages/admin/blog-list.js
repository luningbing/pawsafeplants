import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function BlogListRedirect() {
  const router = useRouter();

  useEffect(() => {
    // 重定向到工业级博客列表页面
    router.replace('/admin/blog-table');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      正在重定向到工业级博客列表页面...
    </div>
  );
}
