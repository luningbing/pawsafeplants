#!/usr/bin/env node

/**
 * Data Migration Script - Phase 1
 * 数据迁移脚本 - 将现有植物数据规范化为 PRD 要求的 SSOT 标准
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const PLANTS_DIR = path.join(process.cwd(), 'content', 'plants');

// PRD 要求的枚举映射
const TOXICITY_TO_SAFETY_STATUS = {
  'Safe': 'safe',
  'Caution': 'risky',
  'Danger': 'toxic_to_cats',
  'Toxic': 'toxic_to_cats',
  'Non-Toxic': 'safe',
  'Low': 'safe',
  'Medium': 'risky',
  'High': 'toxic_to_cats'
};

const TOXICITY_TO_RISK_LEVEL = {
  'Safe': 'low',
  'Caution': 'medium',
  'Danger': 'high',
  'Toxic': 'high',
  'Non-Toxic': 'low',
  'Low': 'low',
  'Medium': 'medium',
  'High': 'high'
};

const DIFFICULTY_ENUM = {
  'Low': 'easy',
  'Medium': 'medium',
  'High': 'hard',
  'Easy': 'easy',
  'Moderate': 'medium',
  'Difficult': 'hard'
};

// 获取所有植物文件
function getAllPlantFiles() {
  return fs.readdirSync(PLANTS_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => ({
      slug: file.replace('.md', ''),
      filePath: path.join(PLANTS_DIR, file)
    }));
}

// 处理单个植物数据
function processPlant(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { data, content: markdownContent } = matter(content);
  
  // 规范化 toxicity_level 到 safety_status
  const rawToxicity = data.toxicity_level || 'Safe';
  const safetyStatus = TOXICITY_TO_SAFETY_STATUS[rawToxicity] || 'safe';
  
  // 规范化 toxicity_level 到 risk_level
  const riskLevel = TOXICITY_TO_RISK_LEVEL[rawToxicity] || 'low';
  
  // 规范化 care_difficulty
  const rawDifficulty = data.care_difficulty || 'Low';
  const careDifficulty = DIFFICULTY_ENUM[rawDifficulty] || 'easy';
  
  // 构建 aliases 从 common_names
  let aliases = [];
  if (data.common_names && Array.isArray(data.common_names)) {
    aliases = data.common_names.map(name => name.toLowerCase().trim());
  }
  // 添加 scientific_name 作为别名
  if (data.scientific_name) {
    aliases.push(data.scientific_name.toLowerCase().trim());
  }
  
  // 获取 alternatives 从 safe_alternatives
  let alternatives = [];
  if (data.safe_alternatives && Array.isArray(data.safe_alternatives)) {
    alternatives = data.safe_alternatives.map(alt => {
      // 简化替代名称，去掉括号内容
      return alt.split('(')[0].trim().toLowerCase().replace(/\s+/g, '-');
    });
  }
  
  // 提取症状关键词用于 toxicity_symptoms
  let toxicitySymptoms = '';
  if (data.symptoms && Array.isArray(data.symptoms)) {
    toxicitySymptoms = data.symptoms.join(', ');
  }
  
  // 构建新的标准化数据结构
  const normalizedData = {
    // 保留原有字段
    title: data.title,
    scientific_name: data.scientific_name,
    
    // PRD SSOT 标准字段
    common_name: data.title, // 通用名称
    aliases: [...new Set(aliases)], // 去重别名
    safety_status: safetyStatus, // 严格枚举: safe, risky, toxic_to_cats, toxic_to_dogs_and_cats
    toxicity_symptoms: toxicitySymptoms,
    risk_level: riskLevel, // 严格枚举: low, medium, high
    care_difficulty: careDifficulty, // 严格枚举: easy, medium, hard
    light_level: data.light_level || 'bright_indirect', // 严格枚举: low, bright_indirect, direct
    is_featured_today: data.is_featured_today || false,
    affiliate_url: data.affiliate_url || '',
    alternatives: alternatives,
    
    // 保留其他有用字段
    summary: data.summary,
    image: data.image,
    what_to_do: data.what_to_do,
    ascpa_link: data.ascpa_link,
    
    // 为了向后兼容，保留原始字段
    toxicity_level: rawToxicity,
    symptoms: data.symptoms
  };
  
  return { data: normalizedData, content: markdownContent };
}

// 写入规范化后的数据
function writeNormalizedPlant(filePath, normalizedData, markdownContent) {
  const updatedContent = matter.stringify(markdownContent, normalizedData);
  fs.writeFileSync(filePath, updatedContent);
}

// 生成数据迁移报告
function generateReport(results) {
  const safe = results.filter(r => r.safetyStatus === 'safe').length;
  const risky = results.filter(r => r.safetyStatus === 'risky').length;
  const toxic = results.filter(r => r.safetyStatus === 'toxic_to_cats').length;
  
  console.log('\n📊 数据迁移报告');
  console.log('=' .repeat(50));
  console.log(`总植物数: ${results.length}`);
  console.log(`安全植物: ${safe} (${((safe/results.length)*100).toFixed(1)}%)`);
  console.log(`有风险植物: ${risky} (${((risky/results.length)*100).toFixed(1)}%)`);
  console.log(`有毒植物: ${toxic} (${((toxic/results.length)*100).toFixed(1)}%)`);
  console.log('=' .repeat(50));
  
  // 显示一些示例
  console.log('\n📝 规范化示例:');
  const samples = results.slice(0, 3);
  samples.forEach((result, i) => {
    console.log(`\n${i + 1}. ${result.title}`);
    console.log(`   原始 toxicity_level: ${result.rawToxicity}`);
    console.log(`   标准化 safety_status: ${result.safetyStatus}`);
    console.log(`   risk_level: ${result.riskLevel}`);
    console.log(`   care_difficulty: ${result.careDifficulty}`);
    console.log(`   aliases: ${result.aliases.slice(0, 3).join(', ')}${result.aliases.length > 3 ? '...' : ''}`);
  });
}

// 主函数
async function main() {
  console.log('🚀 开始数据迁移 - Phase 1: SSOT 标准化\n');
  
  const plantFiles = getAllPlantFiles();
  const results = [];
  
  console.log(`📁 发现 ${plantFiles.length} 个植物文件\n`);
  
  let processed = 0;
  for (const { slug, filePath } of plantFiles) {
    try {
      const { data, content } = processPlant(filePath);
      writeNormalizedPlant(filePath, data, content);
      
      results.push({
        slug,
        title: data.title,
        rawToxicity: data.toxicity_level,
        safetyStatus: data.safety_status,
        riskLevel: data.risk_level,
        careDifficulty: data.care_difficulty,
        aliases: data.aliases,
        alternatives: data.alternatives
      });
      
      processed++;
      if (processed % 50 === 0) {
        console.log(`✅ 已处理 ${processed}/${plantFiles.length}`);
      }
    } catch (error) {
      console.error(`❌ 处理失败 ${slug}: ${error.message}`);
    }
  }
  
  console.log(`\n✅ 完成！成功处理 ${processed} 个植物\n`);
  
  generateReport(results);
  
  // 保存统计数据供后续使用
  const statsPath = path.join(process.cwd(), 'data', 'plant-stats.json');
  fs.mkdirSync(path.dirname(statsPath), { recursive: true });
  fs.writeFileSync(statsPath, JSON.stringify({
    total: results.length,
    safe: results.filter(r => r.safetyStatus === 'safe').length,
    risky: results.filter(r => r.safetyStatus === 'risky').length,
    toxic: results.filter(r => r.safetyStatus === 'toxic_to_cats').length,
    plants: results.map(r => ({
      slug: r.slug,
      title: r.title,
      safety_status: r.safetyStatus,
      aliases: r.aliases
    }))
  }, null, 2));
  
  console.log(`\n📁 统计数据已保存到: ${statsPath}\n`);
  
  console.log('🎉 Phase 1 数据迁移完成！');
  console.log('\n下一步：');
  console.log('  1. 检查标准化后的数据');
  console.log('  2. 提交代码: git add . && git commit -m "data: normalize plant data to PRD SSOT standard"');
  console.log('  3. 开始首页 UI 改造');
}

// 执行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { processPlant, TOXICITY_TO_SAFETY_STATUS, TOXICITY_TO_RISK_LEVEL };
