// 这个脚本用于执行blog_posts表结构更新
// 请在浏览器控制台中运行此脚本

const executeSQL = async () => {
  // 获取管理员token
  const token = localStorage.getItem('admin_token');
  if (!token) {
    console.error('❌ 请先登录管理员后台');
    return;
  }

  const sqlStatements = [
    // 1. 增加 slug 字段（用于美化 URL，比如 /blog/valentine-guide）
    `ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS slug text UNIQUE;`,
    
    // 2. 增加 image_slots 字段 (核心！)
    // 这是一个 JSONB 格式，存储结构如：{"ring_bearer": "url1", "proposal": "url2"}
    `ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS image_slots JSONB DEFAULT '{}'::jsonb;`,
    
    // 3. 增加内容摘要，用于列表显示
    `ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS excerpt text;`
  ];

  console.log('🔄 开始执行blog_posts表结构更新...');

  for (let i = 0; i < sqlStatements.length; i++) {
    const sql = sqlStatements[i];
    console.log(`📝 执行SQL ${i + 1}/${sqlStatements.length}: ${sql.substring(0, 50)}...`);
    
    try {
      const response = await fetch('/api/admin/exec-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sql })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ SQL ${i + 1} 执行成功`);
      } else {
        console.error(`❌ SQL ${i + 1} 执行失败:`, result.error);
      }
    } catch (error) {
      console.error(`❌ SQL ${i + 1} 执行异常:`, error);
    }
  }

  console.log('🎉 所有SQL语句执行完成！');
};

// 执行更新
executeSQL();
