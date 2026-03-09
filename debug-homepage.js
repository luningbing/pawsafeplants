console.log('🔍 调试首页加载问题');
console.log('');

const http = require('http');

function debugHomepage() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
    timeout: 10000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`✅ 服务器状态码: ${res.statusCode}`);
    console.log(`📋 响应头:`, res.headers);
    console.log('');
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`📄 页面长度: ${data.length} 字符`);
      console.log('');
      
      // 检查关键元素
      const checks = [
        { name: 'PawSafe Plants 标题', pattern: /PawSafe Plants/i },
        { name: '搜索框', pattern: /search|placeholder.*search/i },
        { name: '筛选按钮', pattern: /filter|All.*Plants|Safe.*Plants|Caution.*Plants|Toxic.*Plants/i },
        { name: '植物卡片', pattern: /plant.*card|toxicity.*level/i },
        { name: 'React组件', pattern: /react|__NEXT_DATA__/i },
        { name: 'JavaScript错误', pattern: /error|exception/i },
        { name: 'CSS样式', pattern: /style|css|background/i }
      ];
      
      console.log('🔍 页面元素检查:');
      checks.forEach(check => {
        if (check.pattern.test(data)) {
          console.log(`✅ ${check.name}: 找到`);
        } else {
          console.log(`❌ ${check.name}: 未找到`);
        }
      });
      
      console.log('');
      console.log('🌐 测试结果:');
      console.log('• 服务器正在运行');
      console.log('• 页面正在加载');
      console.log('• 请在浏览器中访问: http://localhost:3000');
      console.log('• 如果浏览器无法访问，可能是缓存或网络问题');
      console.log('');
      console.log('🔧 浏览器故障排除:');
      console.log('1. 清除浏览器缓存 (Ctrl+Shift+Delete)');
      console.log('2. 使用无痕模式访问');
      console.log('3. 尝试不同的浏览器');
      console.log('4. 检查浏览器控制台错误');
      console.log('5. 确认URL正确: http://localhost:3000');
    });
  });

  req.on('error', (err) => {
    console.log('❌ 服务器连接错误:', err.message);
  });

  req.on('timeout', () => {
    console.log('❌ 服务器响应超时');
    req.destroy();
  });

  req.end();
}

debugHomepage();
