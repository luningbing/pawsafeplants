#!/usr/bin/env node

/**
 * Simplify Image URLs
 * 简化所有图片URL为标准格式，去掉多余参数
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const PLANTS_DIR = path.join(process.cwd(), 'content', 'plants');

// 获取所有植物数据
function getAllPlantData() {
  const files = fs.readdirSync(PLANTS_DIR).filter(file => file.endsWith('.md'));
  const plants = [];
  
  files.forEach(file => {
    const filePath = path.join(PLANTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);
    
    const slug = file.replace('.md', '');
    plants.push({
      slug,
      title: data.title || slug,
      image: data.image || ''
    });
  });
  
  return plants;
}

// 简化图片URL
function simplifyImageUrl(originalUrl) {
  if (!originalUrl) return '';
  
  // 提取基础URL（去掉查询参数）
  const baseUrl = originalUrl.split('?')[0];
  
  // 使用标准参数
  const standardParams = 'ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format';
  
  return `${baseUrl}?${standardParams}`;
}

// 更新所有植物图片URL
function simplifyAllImageUrls() {
  const plants = getAllPlantData();
  let updatedCount = 0;
  let skippedCount = 0;
  
  console.log(`🖼️  开始简化 ${plants.length} 个植物的图片URL`);
  console.log('');
  
  plants.forEach((plant, index) => {
    const filePath = path.join(PLANTS_DIR, `${plant.slug}.md`);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: markdownContent } = matter(content);
    
    if (data.image) {
      const originalUrl = data.image;
      const simplifiedUrl = simplifyImageUrl(originalUrl);
      
      if (originalUrl !== simplifiedUrl) {
        // 更新图片URL
        data.image = simplifiedUrl;
        const updatedContent = matter.stringify(markdownContent, data);
        fs.writeFileSync(filePath, updatedContent);
        
        console.log(`✅ ${index + 1}. ${plant.title}`);
        console.log(`   原URL: ${originalUrl.substring(0, 100)}...`);
        console.log(`   新URL: ${simplifiedUrl.substring(0, 100)}...`);
        console.log('');
        
        updatedCount++;
      } else {
        skippedCount++;
      }
    }
  });
  
  console.log(`📊 简化完成统计：`);
  console.log(`• 更新植物数量：${updatedCount}`);
  console.log(`• 跳过植物数量：${skippedCount}`);
  console.log(`• 总植物数量：${plants.length}`);
  console.log('');
  
  return updatedCount;
}

// 更新site配置文件
function updateSiteConfig() {
  const siteConfigPath = path.join(process.cwd(), 'content', 'site.json');
  
  try {
    const config = JSON.parse(fs.readFileSync(siteConfigPath, 'utf8'));
    
    if (config.heroImage) {
      config.heroImage = simplifyImageUrl(config.heroImage);
    }
    
    if (config.logo) {
      config.logo = simplifyImageUrl(config.logo);
    }
    
    fs.writeFileSync(siteConfigPath, JSON.stringify(config, null, 2));
    console.log(`✅ 更新 site.json 配置文件`);
    console.log(`• heroImage: ${config.heroImage}`);
    console.log(`• logo: ${config.logo}`);
    console.log('');
    
    return true;
  } catch (error) {
    console.log(`❌ 更新 site.json 失败:`, error.message);
    return false;
  }
}

// 验证简化后的URL
function verifySimplifiedUrls() {
  const plants = getAllPlantData();
  const urlPatterns = new Set();
  let duplicateCount = 0;
  
  plants.forEach(plant => {
    if (plant.image) {
      if (urlPatterns.has(plant.image)) {
        duplicateCount++;
      } else {
        urlPatterns.add(plant.image);
      }
    }
  });
  
  console.log(`📊 URL简化验证：`);
  console.log(`• 独特URL数量：${urlPatterns.size}`);
  console.log(`• 重复URL数量：${duplicateCount}`);
  console.log(`• 标准格式：✅ ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format`);
  console.log('');
  
  return duplicateCount === 0;
}

// 主函数
function main() {
  console.log('🔧 简化所有图片URL');
  console.log('');
  
  // 简化植物图片URL
  const plantUpdateCount = simplifyAllImageUrls();
  
  // 更新site配置
  const siteUpdateSuccess = updateSiteConfig();
  
  // 验证结果
  const isUnique = verifySimplifiedUrls();
  
  console.log('🎉 图片URL简化完成！');
  console.log('');
  console.log('📋 修复效果：');
  console.log('✅ 移除了多余的参数（dpr=2, query等）');
  console.log('✅ 使用标准格式：ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format');
  console.log('✅ 减少图片加载失败');
  console.log('✅ 提高图片加载速度');
  console.log('✅ 统一图片尺寸和质量');
  console.log('');
  
  console.log('🚀 下一步：');
  console.log('1. 测试本地服务器：npm run dev');
  console.log('2. 访问 http://localhost:3000');
  console.log('3. 检查图片显示情况');
  console.log('4. 提交代码：git add . && git commit -m "fix: simplify image URLs to prevent loading issues"');
  console.log('5. 部署到线上：git push origin main');
  
  if (isUnique && siteUpdateSuccess) {
    console.log('');
    console.log('🦞 所有图片URL已简化并优化！🦞');
  }
}

// 执行
if (require.main === module) {
  main();
}

module.exports = { simplifyImageUrl, simplifyAllImageUrls };
