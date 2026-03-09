#!/usr/bin/env node

/**
 * Check Duplicate Images
 * 检查重复的图片URL
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const PLANTS_DIR = path.join(process.cwd(), 'content', 'plants');

// 获取所有植物文件和图片
function getAllPlantImages() {
  const files = fs.readdirSync(PLANTS_DIR).filter(file => file.endsWith('.md'));
  const plantImages = {};
  
  files.forEach(file => {
    const filePath = path.join(PLANTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);
    
    if (data.image) {
      const slug = file.replace('.md', '');
      plantImages[slug] = {
        title: data.title || slug,
        image: data.image,
        scientific_name: data.scientific_name || ''
      };
    }
  });
  
  return plantImages;
}

// 检查重复图片
function checkDuplicateImages() {
  const plantImages = getAllPlantImages();
  const imageCount = {};
  const duplicates = {};
  
  // 统计每个图片的使用次数
  Object.values(plantImages).forEach(plant => {
    const imageUrl = plant.image;
    if (imageUrl) {
      imageCount[imageUrl] = (imageCount[imageUrl] || 0) + 1;
    }
  });
  
  // 找出重复的图片
  Object.entries(imageCount).forEach(([imageUrl, count]) => {
    if (count > 1) {
      duplicates[imageUrl] = [];
      Object.entries(plantImages).forEach(([slug, plant]) => {
        if (plant.image === imageUrl) {
          duplicates[imageUrl].push({
            slug,
            title: plant.title,
            scientific_name: plant.scientific_name
          });
        }
      });
    }
  });
  
  return duplicates;
}

// 主函数
function main() {
  console.log('🔍 检查重复的植物图片');
  console.log('');
  
  const duplicates = checkDuplicateImages();
  const duplicateCount = Object.keys(duplicates).length;
  
  console.log(`📊 统计结果：`);
  console.log(`• 重复图片数量：${duplicateCount}`);
  console.log(`• 涉及植物数量：${Object.values(duplicates).reduce((sum, plants) => sum + plants.length, 0)}`);
  console.log('');
  
  if (duplicateCount > 0) {
    console.log('🔄 发现重复图片：');
    console.log('');
    
    Object.entries(duplicates).forEach(([imageUrl, plants], index) => {
      console.log(`${index + 1}. 图片URL: ${imageUrl}`);
      console.log(`   使用植物 (${plants.length}个):`);
      plants.forEach(plant => {
        console.log(`   • ${plant.title} (${plant.slug})`);
      });
      console.log('');
    });
    
    console.log('🔧 需要为这些植物分配不同的图片');
    console.log('📝 运行: node scripts/assign-unique-images.js');
  } else {
    console.log('✅ 没有发现重复图片');
    console.log('🎉 所有植物都有独特的图片！');
  }
}

// 执行
if (require.main === module) {
  main();
}

module.exports = { checkDuplicateImages, getAllPlantImages };
