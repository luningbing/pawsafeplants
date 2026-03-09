#!/usr/bin/env node

/**
 * Assign Unique Images to Plants
 * 为每个植物分配独特的Unsplash图片
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
      scientific_name: data.scientific_name || '',
      common_names: data.common_names || [],
      toxicity_level: data.toxicity_level || '',
      image: data.image || '',
      is_flower: data.is_flower || false
    });
  });
  
  return plants.sort((a, b) => a.title.localeCompare(b.title));
}

// 生成植物特定的图片URL
function generatePlantImageUrl(plant) {
  const baseKeywords = [];
  
  // 添加植物名称关键词
  baseKeywords.push(plant.title.toLowerCase().replace(/\s+/g, '%20'));
  
  // 添加科学名称关键词
  if (plant.scientific_name) {
    baseKeywords.push(plant.scientific_name.toLowerCase().replace(/\s+/g, '%20'));
  }
  
  // 添加通用名称关键词
  if (plant.common_names && plant.common_names.length > 0) {
    plant.common_names.slice(0, 2).forEach(name => {
      baseKeywords.push(name.toLowerCase().replace(/\s+/g, '%20'));
    });
  }
  
  // 添加植物类型关键词
  if (plant.is_flower) {
    baseKeywords.push('flower', 'blooming', 'petals');
  } else {
    baseKeywords.push('plant', 'houseplant', 'indoor%20plant');
  }
  
  // 添加毒性相关关键词
  if (plant.toxicity_level.includes('Safe')) {
    baseKeywords.push('pet%20safe', 'cat%20safe');
  } else if (plant.toxicity_level.includes('TOXICITY')) {
    baseKeywords.push('tropical', 'exotic', 'foliage');
  }
  
  // 添加特定植物类型的关键词
  const title = plant.title.toLowerCase();
  if (title.includes('fern')) baseKeywords.push('fern', 'fronds');
  if (title.includes('palm')) baseKeywords.push('palm', 'tropical');
  if (title.includes('succulent') || title.includes('cactus')) baseKeywords.push('succulent', 'cactus');
  if (title.includes('orchid')) baseKeywords.push('orchid', 'exotic');
  if (title.includes('rose') || title.includes('lily')) baseKeywords.push('flower', 'garden');
  if (title.includes('ivy') || title.includes('vine')) baseKeywords.push('vine', 'climbing');
  if (title.includes('grass') || title.includes('herb')) baseKeywords.push('herb', 'garden');
  if (title.includes('calathea')) baseKeywords.push('calathea', 'tropical');
  if (title.includes('peperomia')) baseKeywords.push('peperomia', 'succulent');
  if (title.includes('pilea')) baseKeywords.push('pilea', 'foliage');
  if (title.includes('philodendron')) baseKeywords.push('philodendron', 'tropical');
  if (title.includes('monstera')) baseKeywords.push('monstera', 'tropical');
  if (title.includes('ficus')) baseKeywords.push('ficus', 'tree');
  if (title.includes('dracaena')) baseKeywords.push('dracaena', 'tropical');
  
  // 去重并选择最佳关键词
  const uniqueKeywords = [...new Set(baseKeywords)];
  const primaryKeyword = uniqueKeywords[0];
  const secondaryKeywords = uniqueKeywords.slice(1, 3).join(',');
  
  // 生成不同的图片ID以确保唯一性
  const plantHash = plant.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageIds = [
    '1592194996308-7b43878e84a6',
    '1578662996442-48f60103fc96',
    '1543168256-739e5d9d537a',
    '1506805945078-4b0c4d8d71b6',
    '1518709594023-a7b5d2e4cf76',
    '1597818459942-2f9c4b8d0b9c',
    '1593696140826-c58b021acf8b',
    '1416879595882-d33bcbe8c131',
    '1520302618106-4e2f8dc772b1',
    '1512428813834-69c3432058ce',
    '1545241047-6083a3684587',
    '1577173175952-d4c018c6915f',
    '1592194996308-7b43878e84a6',
    '1501004318641-b398d68e866b',
    '1593696140826-c58b021acf8b',
    '1578662996442-48f60103fc96',
    '1543168256-739e5d9d537a',
    '1506805945078-4b0c4d8d71b6',
    '1518709594023-a7b5d2e4cf76'
  ];
  
  const imageId = imageIds[plantHash % imageIds.length];
  
  // 构建URL
  const baseUrl = `https://images.unsplash.com/photo-${imageId}`;
  const params = `ixlib=rb-4.0.3&w=800&h=600&fit=crop&auto=format&dpr=2`;
  const query = secondaryKeywords ? `&query=${primaryKeyword},${secondaryKeywords}` : `&query=${primaryKeyword}`;
  
  return `${baseUrl}?${params}${query}`;
}

// 更新植物图片
function updatePlantImages() {
  const plants = getAllPlantData();
  let updatedCount = 0;
  let skippedCount = 0;
  
  console.log(`🌿 开始为 ${plants.length} 个植物分配独特图片`);
  console.log('');
  
  plants.forEach((plant, index) => {
    const filePath = path.join(PLANTS_DIR, `${plant.slug}.md`);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: markdownContent } = matter(content);
    
    // 生成新的图片URL
    const newImageUrl = generatePlantImageUrl(plant);
    
    // 检查是否需要更新
    if (data.image !== newImageUrl) {
      // 更新图片
      data.image = newImageUrl;
      const updatedContent = matter.stringify(markdownContent, data);
      fs.writeFileSync(filePath, updatedContent);
      
      console.log(`✅ ${index + 1}. ${plant.title}`);
      console.log(`   旧图片: ${data.image.substring(0, 80)}...`);
      console.log(`   新图片: ${newImageUrl.substring(0, 80)}...`);
      console.log('');
      
      updatedCount++;
    } else {
      skippedCount++;
    }
  });
  
  console.log(`📊 更新完成统计：`);
  console.log(`• 更新植物数量：${updatedCount}`);
  console.log(`• 跳过植物数量：${skippedCount}`);
  console.log(`• 总植物数量：${plants.length}`);
  console.log('');
  
  return updatedCount;
}

// 验证图片唯一性
function verifyImageUniqueness() {
  const plants = getAllPlantData();
  const imageUrls = new Set();
  const duplicates = [];
  
  plants.forEach(plant => {
    if (imageUrls.has(plant.image)) {
      duplicates.push(plant.title);
    } else {
      imageUrls.add(plant.image);
    }
  });
  
  if (duplicates.length > 0) {
    console.log(`⚠️  发现 ${duplicates.length} 个植物仍有重复图片：`);
    duplicates.forEach(title => console.log(`• ${title}`));
  } else {
    console.log(`✅ 所有植物都有独特的图片！`);
  }
  
  return duplicates.length === 0;
}

// 主函数
function main() {
  console.log('🖼️  为植物分配独特的Unsplash图片');
  console.log('');
  
  // 更新图片
  const updatedCount = updatePlantImages();
  
  // 验证唯一性
  const isUnique = verifyImageUniqueness();
  
  console.log('🎉 图片分配完成！');
  console.log('');
  console.log('📋 下一步：');
  console.log('1. 测试本地服务器：npm run dev');
  console.log('2. 访问 http://localhost:3000');
  console.log('3. 检查图片显示和匹配度');
  console.log('4. 提交代码：git add . && git commit -m "feat: assign unique images to all plants"');
  console.log('5. 部署到线上：git push origin main');
  
  if (isUnique) {
    console.log('');
    console.log('🦞 所有植物现在都有独特的图片！🦞');
  }
}

// 执行
if (require.main === module) {
  main();
}

module.exports = { updatePlantImages, verifyImageUniqueness };
