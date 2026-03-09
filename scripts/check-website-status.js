#!/usr/bin/env node

/**
 * Check Website Status
 * 检查网站实际状态
 */

const https = require('https');
const http = require('http');

function checkWebsite(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          content: data.substring(0, 2000), // 前2000字符
          success: true
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({
        statusCode: 0,
        error: err.message,
        success: false
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        statusCode: 0,
        error: 'Request timeout',
        success: false
      });
    });
  });
}

async function main() {
  console.log('🔍 检查网站状态');
  console.log('');
  
  const urls = [
    'https://www.pawsafeplants.com/',
    'https://pawsafeplants.vercel.app/',
    'https://pawsafeplants-luningbing.vercel.app/'
  ];
  
  for (const url of urls) {
    console.log(`📱 检查: ${url}`);
    
    try {
      const result = await checkWebsite(url);
      
      if (result.success) {
        console.log(`✅ 状态码: ${result.statusCode}`);
        console.log(`📄 内容长度: ${result.content.length} 字符`);
        
        // 检查关键内容
        const hasPawSafe = result.content.includes('PawSafe Plants');
        const hasImages = result.content.includes('/images/plants/');
        const hasSearch = result.content.includes('search') || result.content.includes('Search');
        const hasFilter = result.content.includes('filter') || result.content.includes('All') || result.content.includes('Safe');
        
        console.log(`🔍 内容检查:`);
        console.log(`• PawSafe Plants: ${hasPawSafe ? '✅' : '❌'}`);
        console.log(`• 本地图片路径: ${hasImages ? '✅' : '❌'}`);
        console.log(`• 搜索功能: ${hasSearch ? '✅' : '❌'}`);
        console.log(`• 筛选功能: ${hasFilter ? '✅' : '❌'}`);
        
        if (result.statusCode === 200 && hasPawSafe) {
          console.log('🎉 网站正常运行！');
        } else {
          console.log('⚠️ 网站可能有问题');
        }
      } else {
        console.log(`❌ 连接错误: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ 检查失败: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('📋 可能的问题分析：');
  console.log('');
  console.log('如果网站显示异常：');
  console.log('1. 部署可能还在进行中（等待2-3分钟）');
  console.log('2. DNS解析需要时间');
  console.log('3. CDN缓存更新需要时间');
  console.log('4. 可能需要清除浏览器缓存');
  console.log('');
  console.log('如果图片仍然裂开：');
  console.log('1. 检查浏览器控制台错误');
  console.log('2. 清除浏览器缓存');
  console.log('3. 使用无痕模式访问');
  console.log('4. 检查网络连接');
  console.log('');
  console.log('🚀 建议操作：');
  console.log('1. 等待2-3分钟让部署完全完成');
  console.log('2. 清除浏览器缓存后重试');
  console.log('3. 如果仍有问题，可以重新部署');
}

// 执行
if (require.main === module) {
  main();
}

module.exports = { checkWebsite };
