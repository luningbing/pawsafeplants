export default function BlogRedirect() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      正在重定向到工业级博客管理页面...
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: '/admin/blog-table',
      permanent: false
    }
  };
}
