console.log('🌐 测试开发服务器连接');
console.log('');

const http = require('http');

function testServer() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    console.log(`✅ 服务器状态码: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (data.includes('PawSafe Plants')) {
        console.log('✅ 页面包含 PawSafe Plants 标题');
      } else {
        console.log('❌ 页面不包含 PawSafe Plants 标题');
      }
      
      if (data.includes('search')) {
        console.log('✅ 页面包含搜索功能');
      } else {
        console.log('❌ 页面不包含搜索功能');
      }
      
      if (data.includes('filter')) {
        console.log('✅ 页面包含筛选功能');
      } else {
        console.log('❌ 页面不包含筛选功能');
      }
      
      console.log('');
      console.log('🌐 服务器测试完成！');
      console.log('📱 请在浏览器中访问: http://localhost:3000');
      console.log('🔍 如果无法访问，请检查防火墙设置');
    });
  });

  req.on('error', (err) => {
    console.log('❌ 服务器连接错误:', err.message);
    console.log('');
    console.log('🔧 可能的解决方案：');
    console.log('1. 检查服务器是否正在运行');
    console.log('2. 检查端口3000是否被占用');
    console.log('3. 检查防火墙设置');
    console.log('4. 尝试重启服务器');
  });

  req.on('timeout', () => {
    console.log('❌ 服务器响应超时');
    req.destroy();
  });

  req.end();
}

testServer();
