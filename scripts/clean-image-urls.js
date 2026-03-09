#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const plantsDir = path.join(process.cwd(), 'content', 'plants');
const files = fs.readdirSync(plantsDir).filter(f => f.endsWith('.md'));

let updated = 0;

for (const file of files) {
  const filepath = path.join(plantsDir, file);
  const content = fs.readFileSync(filepath, 'utf8');
  
  // 匹配 image: >- 后的 URL，包含可能的参数
  const newContent = content.replace(
    /(image:\s*>-\s*)(https?:\/\/images\.unsplash\.com\/photo-[^\s?]+(?:\?[^\n]*)?)/g,
    (match, prefix, url) => {
      // 提取 photo ID 和基本参数
      const photoIdMatch = url.match(/(photo-[^\s?]+)/);
      if (!photoIdMatch) return match;
      
      const photoId = photoIdMatch[1];
      const cleanUrl = `https://images.unsplash.com/${photoId}?ixlib=rb-4.0.3&w=800&h=600&fit=crop`;
      return prefix + cleanUrl;
    }
  );
  
  if (newContent !== content) {
    fs.writeFileSync(filepath, newContent, 'utf8');
    updated++;
  }
}

console.log(`✅ Cleaned image URLs in ${updated} files`);