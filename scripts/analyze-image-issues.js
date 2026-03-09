#!/usr/bin/env node

/**
 * Analyze Image Loading Issues
 * 分析图片加载问题
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const PLANTS_DIR = path.join(process.cwd(), 'content', 'plants');

// 检查当前图片URL格式
function analyzeCurrentImageUrls() {
  const files = fs.readdirSync(PLANTS_DIR).filter(file => file.endsWith('.md'));
  const urlStats = {
    total: 0,
    withQuery: 0,
    withDpr: 0,
    withComplexParams: 0,
    simpleFormat: 0,
    uniqueUrls: new Set(),
    urlExamples: {}
  };
  
  files.forEach(file => {
    const filePath = path.join(PLANTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);
    
    if (data.image) {
      urlStats.total++;
      urlStats.uniqueUrls.add(data.image);
      
      // 分析URL参数
      const hasQuery = data.image.includes('query=');
      const hasDpr = data.image.includes('dpr=');
      const hasComplexParams = data.image.split('&').length > 5;
      const isSimple = data.image.includes('ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format') && 
                      !data.image.includes('query=') && 
                      !data.image.includes('dpr=');
      
      if (hasQuery) urlStats.withQuery++;
      if (hasDpr) urlStats.withDpr++;
      if (hasComplexParams) urlStats.withComplexParams++;
      if (isSimple) urlStats.simpleFormat++;
      
      // 记录示例
      if (!urlStats.urlExamples.complex && hasComplexParams) {
        urlStats.urlExamples.complex = data.image;
      }
      if (!urlStats.urlExamples.simple && isSimple) {
        urlStats.urlExamples.simple = data.image;
      }
      if (!urlStats.urlExamples.withQuery && hasQuery) {
        urlStats.urlExamples.withQuery = data.image;
      }
    }
  });
  
  return urlStats;
}

// 生成网络友好的图片URL
function generateNetworkFriendlyUrl(originalUrl) {
  if (!originalUrl) return '';
  
  // 提取基础图片ID
  const urlMatch = originalUrl.match(/photo-([^?]+)/);
  if (!urlMatch) return originalUrl;
  
  const imageId = urlMatch[1];
  
  // 使用最简单的参数组合
  return `https://images.unsplash.com/photo-${imageId}?w=800&h=600&fit=crop`;
}

// 修复所有图片URL为网络友好格式
function fixNetworkFriendlyUrls() {
  const files = fs.readdirSync(PLANTS_DIR).filter(file => file.endsWith('.md'));
  let updatedCount = 0;
  
  console.log('🔧 开始修复图片URL为网络友好格式');
  console.log('');
  
  files.forEach((file, index) => {
    const filePath = path.join(PLANTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: markdownContent } = matter(content);
    
    if (data.image) {
      const originalUrl = data.image;
      const networkFriendlyUrl = generateNetworkFriendlyUrl(originalUrl);
      
      if (originalUrl !== networkFriendlyUrl) {
        data.image = networkFriendlyUrl;
        const updatedContent = matter.stringify(markdownContent, data);
        fs.writeFileSync(filePath, updatedContent);
        
        updatedCount++;
        
        if (updatedCount <= 10 || updatedCount % 50 === 0) {
          console.log(`✅ ${updatedCount}. ${file.replace('.md', '')} -> ${networkFriendlyUrl.substring(50, 90)}...`);
        }
      }
    }
  });
  
  console.log(`\n📊 修复完成统计：`);
  console.log(`• 更新文件数量：${updatedCount}`);
  console.log(`• 总文件数量：${files.length}`);
  console.log('');
  
  return updatedCount;
}

// 主函数
function main() {
  console.log('🔍 分析图片加载问题');
  console.log('');
  
  // 分析当前状态
  const currentStats = analyzeCurrentImageUrls();
  
  console.log('📊 当前图片URL分析：');
  console.log(`• 总图片数量：${currentStats.total}`);
  console.log(`• 独特URL数量：${currentStats.uniqueUrls.size}`);
  console.log(`• 包含query参数：${currentStats.withQuery}`);
  console.log(`• 包含dpr参数：${currentStats.withDpr}`);
  console.log(`• 复杂参数(>5个)：${currentStats.withComplexParams}`);
  console.log(`• 简单格式：${currentStats.simpleFormat}`);
  console.log('');
  
  if (currentStats.urlExamples.complex) {
    console.log('🔍 复杂URL示例：');
    console.log(currentStats.urlExamples.complex.substring(0, 120) + '...');
    console.log('');
  }
  
  if (currentStats.urlExamples.simple) {
    console.log('✅ 简单URL示例：');
    console.log(currentStats.urlExamples.simple);
    console.log('');
  }
  
  // 分析可能的问题
  console.log('🚨 图片裂开的可能原因：');
  console.log('');
  console.log('1. 网络问题：');
  console.log('   • CDN延迟或不稳定');
  console.log('   • 地理位置影响图片加载速度');
  console.log('   • 网络带宽限制');
  console.log('   • 防火墙或代理阻止');
  console.log('');
  
  console.log('2. URL参数问题：');
  console.log('   • 过多参数导致URL过长');
  console.log('   • 某些参数不被支持');
  console.log('   • query参数可能被过滤');
  console.log('   • dpr参数可能导致兼容性问题');
  console.log('');
  
  console.log('3. 图片服务问题：');
  console.log('   • Unsplash服务器负载');
  console.log('   • 图片ID不存在或已删除');
  console.log('   • API限制或配额问题');
  console.log('');
  
  console.log('4. 浏览器兼容性：');
  console.log('   • 不同浏览器对长URL的处理');
  console.log('   • 图片缓存策略差异');
  console.log('   • 网络请求超时设置');
  console.log('');
  
  // 提供解决方案
  console.log('🔧 推荐解决方案：');
  console.log('');
  console.log('方案1：使用最简单的URL格式');
  console.log('• 移除所有非必要参数');
  console.log('• 只保留基本的尺寸和裁剪参数');
  console.log('• 提高兼容性和加载成功率');
  console.log('');
  
  console.log('方案2：添加图片加载错误处理');
  console.log('• 在React组件中添加onError处理');
  console.log('• 提供备用图片或占位符');
  console.log('• 实现重试机制');
  console.log('');
  
  console.log('方案3：使用本地图片备份');
  console.log('• 下载关键图片到本地');
  console.log('• 使用本地图片作为fallback');
  console.log('• 减少对外部服务的依赖');
  console.log('');
  
  // 询问是否执行修复
  console.log('🤔 是否执行网络友好URL修复？');
  console.log('这会将所有图片URL简化为最基本格式，提高加载成功率');
  console.log('');
  console.log('运行: node scripts/analyze-image-issues.js --fix');
}

// 执行修复
if (require.main === module) {
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--fix');
  
  if (shouldFix) {
    console.log('🔧 执行网络友好URL修复');
    console.log('');
    const updatedCount = fixNetworkFriendlyUrls();
    console.log('🎉 网络友好URL修复完成！');
    console.log('');
    console.log('📋 修复效果：');
    console.log('✅ 移除所有复杂参数');
    console.log('✅ 使用最简单URL格式');
    console.log('✅ 提高网络兼容性');
    console.log('✅ 减少加载失败概率');
    console.log('');
    console.log('🚀 下一步：');
    console.log('1. 提交代码：git add . && git commit -m "fix: simplify image URLs for network compatibility"');
    console.log('2. 推送代码：git push origin main');
    console.log('3. 等待部署完成');
    console.log('4. 测试图片加载情况');
  } else {
    main();
  }
}

module.exports = { analyzeCurrentImageUrls, fixNetworkFriendlyUrls };
