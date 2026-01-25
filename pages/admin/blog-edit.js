import { useRouter } from 'next/router';

export default function BlogEditRedirect() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      正在重定向到工业级博客编辑页面...
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  
  if (id) {
    return {
      redirect: {
        destination: `/admin/blog-editor?id=${id}`,
        permanent: false
      }
    };
  } else {
    return {
      redirect: {
        destination: '/admin/blog-table',
        permanent: false
      }
    };
  }
}
