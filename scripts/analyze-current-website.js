#!/usr/bin/env node

/**
 * Analyze Current Website Images
 * 分析当前网站实际使用的图片
 */

const https = require('https');

function getWebsiteContent(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    });
    
    req.on('error', () => {
      resolve('');
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve('');
    });
  });
}

function extractImageUrls(content) {
  const urls = [];
  const patterns = [
    /"image":\s*"([^"]+)"/g,
    /src="([^"]+)"/g,
    /href="([^"]+\.(jpg|jpeg|png|svg|gif))"/g
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const url = match[1];
      if (url.includes('image') || url.includes('plants')) {
        urls.push(url);
      }
    }
  });
  
  return [...new Set(urls)]; // 去重
}

async function main() {
  console.log('🔍 分析当前网站图片使用情况');
  console.log('');
  
  const url = 'https://www.pawsafeplants.com/';
  console.log(`📱 分析: ${url}`);
  console.log('');
  
  try {
    const content = await getWebsiteContent(url);
    
    if (!content) {
      console.log('❌ 无法获取网站内容');
      return;
    }
    
    console.log(`📄 内容长度: ${content.length} 字符`);
    console.log('');
    
    // 提取图片URL
    const imageUrls = extractImageUrls(content);
    
    console.log(`🖼️ 找到 ${imageUrls.length} 个相关图片URL:`);
    console.log('');
    
    imageUrls.forEach((url, index) => {
      const isLocal = url.startsWith('/images/') || url.includes('pawsafeplants');
      const isExternal = url.startsWith('https://images.unsplash.com');
      const type = isLocal ? '🟢 本地' : isExternal ? '🔴 外部' : '🟡 其他';
      
      console.log(`${index + 1}. ${type} ${url.substring(0, 100)}${url.length > 100 ? '...' : ''}`);
    });
    
    console.log('');
    console.log('📊 分析结果：');
    const localCount = imageUrls.filter(url => url.startsWith('/images/')).length;
    const externalCount = imageUrls.filter(url => url.startsWith('https://images.unsplash.com')).length;
    
    console.log(`• 本地图片: ${localCount}`);
    console.log(`• 外部图片: ${externalCount}`);
    console.log(`• 其他图片: ${imageUrls.length - localCount - externalCount}`);
    console.log('');
    
    if (externalCount > 0) {
      console.log('🚨 问题发现：');
      console.log('• 网站仍在使用外部Unsplash图片');
      console.log('• 本地SVG图片没有生效');
      console.log('• 需要检查部署问题');
      console.log('');
      console.log('🔧 可能的解决方案：');
      console.log('1. 等待部署完成（可能需要更长时间）');
      console.log('2. 检查Vercel部署状态');
      console.log('3. 清除CDN缓存');
      console.log('4. 重新触发部署');
    } else if (localCount > 0) {
      console.log('✅ 好消息：');
      console.log('• 网站已开始使用本地图片');
      console.log('• 图片裂开问题应该解决');
    } else {
      console.log('⚠️ 未找到图片URL，可能需要更深入分析');
    }
    
  } catch (error) {
    console.log(`❌ 分析失败: ${error.message}`);
  }
}

// 执行
if (require.main === module) {
  main();
}

module.exports = { getWebsiteContent, extractImageUrls };
