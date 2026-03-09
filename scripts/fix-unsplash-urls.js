#!/usr/bin/env node

/**
 * Fix plant image URLs from source.unsplash.com to images.unsplash.com
 * 将老旧的 Unsplash Source URL 替换为具体的照片 URL
 */

const fs = require('fs');
const path = require('path');

const plantsDir = path.join(process.cwd(), 'content', 'plants');

// 常见植物的 Unsplash 照片映射（手动精选的高质量图片）
const plantImageMap = {
  // 已有的部分映射，需要扩展
  'air-plants': 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&w=800&h=600&fit=crop',
  'begonia': 'https://images.unsplash.com/photo-1569839878663-230百思不得姐004475?ixlib=rb-4.0.3&w=800&h=600&fit=crop',
  // 通用 fallback - 用高质量的自然植物图片
  'default': 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&w=800&h=600&fit=crop'
};

// 读取所有植物文件
const files = fs.readdirSync(plantsDir).filter(f => f.endsWith('.md'));

let updated = 0;
let skipped = 0;

for (const file of files) {
  const filepath = path.join(plantsDir, file);
  const content = fs.readFileSync(filepath, 'utf8');
  
  // 检查是否包含旧的 source.unsplash.com URL
  if (!content.includes('source.unsplash.com')) {
    skipped++;
    continue;
  }
  
  // 替换为 images.unsplash.com 的等效 URL
  // 提取 query 参数
  const oldUrlMatch = content.match(/https:\/\/source\.unsplash\.com\/800x600\/\?([^&\n]*)/);
  if (oldUrlMatch) {
    const query = decodeURIComponent(oldUrlMatch[1]);
    const slug = file.replace('.md', '');
    
    // 如果映射中有对应植物的图片，使用映射
    let newUrl = plantImageMap[slug] || plantImageMap['default'];
    
    // 更新文件
    const newContent = content.replace(
      /https:\/\/source\.unsplash\.com\/800x600\/\?[^&\n]*/,
      newUrl
    );
    
    fs.writeFileSync(filepath, newContent, 'utf8');
    console.log(`✅ ${file} -> ${newUrl.substring(0, 60)}...`);
    updated++;
  }
}

console.log(`\n📊 Image fix complete:`);
console.log(`   Updated: ${updated}`);
console.log(`   Skipped: ${skipped}`);
console.log(`   Total files: ${files.length}`);