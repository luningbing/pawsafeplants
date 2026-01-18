import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function BlogEditRedirect() {
  const router = useRouter();

  useEffect(() => {
    // 重定向到正确的编辑页面
    const { id } = router.query;
    if (id) {
      router.replace(`/admin/blog-edit-new?id=${id}`);
    } else {
      router.replace('/admin/blog-list-new');
    }
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
      正在重定向到博客编辑页面...
    </div>
  );
}
