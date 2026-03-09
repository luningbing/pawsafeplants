#!/usr/bin/env node

/**
 * Generate Plant Placeholder Images
 * 生成植物占位符图片
 */

const fs = require('fs');
const path = require('path');

const PLANTS_DIR = path.join(__dirname, '..', 'content', 'plants');
const PUBLIC_IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'plants');

// 确保目录存在
if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
  fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
}

// 生成SVG占位符
function generatePlantPlaceholder(slug, title) {
  const colors = [
    '#10b981', '#059669', '#047857', '#065f46', '#064e3b',
    '#84cc16', '#65a30d', '#4d7c0f', '#365314', '#1e3a0a',
    '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'
  ];
  
  const color = colors[Math.abs(slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length];
  
  const svg = `<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="${color}"/>
  <rect x="200" y="150" width="400" height="300" fill="rgba(255,255,255,0.1)" rx="8"/>
  <circle cx="400" cy="250" r="60" fill="rgba(255,255,255,0.2)"/>
  <path d="M400 200 L400 280 M370 240 L430 240 M380 270 L420 270" stroke="rgba(255,255,255,0.8)" stroke-width="3" stroke-linecap="round"/>
  <text x="400" y="380" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif" font-size="24" font-weight="bold">${title}</text>
  <text x="400" y="410" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="Arial, sans-serif" font-size="16">Plant Image</text>
</svg>`;
  
  return svg;
}

// 获取所有植物并生成占位符
function generateAllPlaceholders() {
  const files = fs.readdirSync(PLANTS_DIR).filter(file => file.endsWith('.md'));
  let generatedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(PLANTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);
    
    const slug = file.replace('.md', '');
    const title = data.title || slug;
    
    const svg = generatePlantPlaceholder(slug, title);
    const svgPath = path.join(PUBLIC_IMAGES_DIR, `${slug}.svg`);
    
    fs.writeFileSync(svgPath, svg);
    generatedCount++;
    
    if (generatedCount <= 10 || generatedCount % 50 === 0) {
      console.log(`✅ ${generatedCount}. ${title} -> ${slug}.svg`);
    }
  });
  
  console.log(`\n📊 生成完成统计：`);
  console.log(`• 生成占位符数量：${generatedCount}`);
  console.log(`• 存储路径：${PUBLIC_IMAGES_DIR}`);
  console.log(`• 图片格式：SVG`);
  console.log(`• 文件大小：约2-5KB`);
}

// 执行生成
if (require.main === module) {
  console.log('🎨 生成植物占位符图片');
  console.log('');
  generateAllPlaceholders();
  console.log('');
  console.log('🎉 占位符生成完成！');
  console.log('');
  console.log('📋 优势：');
  console.log('✅ 完全本地化，无网络依赖');
  console.log('✅ 瞬时加载，无延迟');
  console.log('✅ 文件小，加载快');
  console.log('✅ 美观统一的设计');
  console.log('✅ 支持所有浏览器');
}

module.exports = { generateAllPlaceholders };
