#!/usr/bin/env node

/**
 * Batch Add Plants Script
 * 批量导入植物数据到 PawSafePlants 项目
 * 
 * Usage:
 *   node add-plants-batch.js plants.json [--dry-run] [--verbose]
 * 
 * plants.json 格式：
 * [
 *   {
 *     "title": "Monstera",
 *     "scientific_name": "Monstera deliciosa",
 *     "common_names": ["Swiss Cheese Plant", "Split-Leaf Philodendron"],
 *     "toxicity_level": "⚠️ MILD TO MODERATE TOXICITY – ORAL AND GASTROINTESTINAL IRRITATION",
 *     "summary": "Monstera contains calcium oxalate crystals...",
 *     "image": "https://source.unsplash.com/800x600/?monstera",
 *     "symptoms": ["Mouth irritation", "Excessive drooling", "Vomiting"],
 *     "what_to_do": "**If ingested:**\\n1. Rinse mouth...\\n2. Offer milk...",
 *     "safe_alternatives": ["Philodendron (non-toxic varieties)", "Pothos"],
 *     "ascpa_link": "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/monstera",
 *     "is_flower": false
 *   }
 * ]
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const TARGET_DIR = path.join(process.cwd(), 'content', 'plants');

// Slugify: convert title to URL-friendly slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Validate required fields
function validatePlant(plant, index) {
  const errors = [];
  
  if (!plant.title) errors.push(`Plant ${index}: missing title`);
  if (!plant.toxicity_level) errors.push(`Plant ${index} (${plant.title || 'unknown'}): missing toxicity_level`);
  if (!plant.summary) errors.push(`Plant ${index} (${plant.title || 'unknown'}): missing summary`);
  
  // Validate toxicity level format
  const level = plant.toxicity_level.toLowerCase();
  const validLevels = ['safe', '⚠️ mild to moderate toxicity', 'danger', 'toxic', 'caution'];
  if (!validLevels.some(v => level.includes(v.replace(/[^\w\s]/g, '')))) {
    console.warn(`Plant ${index} (${plant.title}): unusual toxicity_level format: "${plant.toxicity_level}"`);
  }
  
  return errors;
}

// Generate frontmatter and content
function generateMarkdown(plant) {
  const frontmatter = {
    title: plant.title,
    scientific_name: plant.scientific_name || '',
    toxicity_level: plant.toxicity_level,
    summary: plant.summary,
    image: plant.image || `https://source.unsplash.com/800x600/?${encodeURIComponent(plant.title)}`,
    care_difficulty: plant.care_difficulty || 'Medium',
  };

  // Optional fields
  if (plant.common_names) frontmatter.common_names = Array.isArray(plant.common_names) ? plant.common_names : [plant.common_names];
  if (plant.is_flower !== undefined) frontmatter.is_flower = plant.is_flower;
  if (plant.category) frontmatter.category = plant.category;
  if (plant.ascpa_link) frontmatter.ascpa_link = plant.ascpa_link;
  
  // Only include these for toxic/caution plants
  const isToxic = !plant.toxicity_level.toLowerCase().includes('safe');
  if (isToxic) {
    if (plant.symptoms) frontmatter.symptoms = Array.isArray(plant.symptoms) ? plant.symptoms : [];
    if (plant.what_to_do) frontmatter.what_to_do = plant.what_to_do;
    if (plant.safe_alternatives) frontmatter.safe_alternatives = Array.isArray(plant.safe_alternatives) ? plant.safe_alternatives : [];
    if (plant.sources) frontmatter.sources = Array.isArray(plant.sources) ? plant.sources : [];
  }

  const content = `
${isToxic ? `> ⚠️ **Disclaimer**: PawSafePlants provides general educational information only. This content is **not veterinary advice**. If your cat has been exposed to any plant, **contact a licensed veterinarian or the ASPCA Animal Poison Control Center immediately**. We do not guarantee the accuracy, completeness, or timeliness of this information. Use at your own risk.
` : ''}

${plant.full_description || ''}
`.trim();

  return matter.stringify(content, frontmatter);
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const jsonPath = args[0];
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose');

  if (!jsonPath) {
    console.error('Usage: node add-plants-batch.js plants.json [--dry-run] [--verbose]');
    process.exit(1);
  }

  if (!fs.existsSync(TARGET_DIR)) {
    console.error(`Target directory does not exist: ${TARGET_DIR}`);
    process.exit(1);
  }

  // Load plants data
  let plants;
  try {
    const raw = fs.readFileSync(jsonPath, 'utf8');
    plants = JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to read or parse ${jsonPath}:`, err.message);
    process.exit(1);
  }

  if (!Array.isArray(plants)) {
    console.error('JSON data must be an array of plant objects');
    process.exit(1);
  }

  console.log(`📦 Loaded ${plants.length} plants from ${jsonPath}`);

  // Validate all plants first
  const allErrors = [];
  plants.forEach((plant, idx) => {
    const errors = validatePlant(plant, idx);
    allErrors.push(...errors);
  });

  if (allErrors.length > 0) {
    console.error('❌ Validation errors:');
    allErrors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log('✅ All plants validated successfully');

  // Process each plant
  let created = 0;
  let skipped = 0;
  const existingFiles = new Set(
    fs.readdirSync(TARGET_DIR).filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''))
  );

  for (const plant of plants) {
    const slug = slugify(plant.title);
    const filename = `${slug}.md`;
    const filepath = path.join(TARGET_DIR, filename);

    if (existingFiles.has(slug)) {
      if (verbose) console.log(`⏭️  Skipping existing: ${filename} (${plant.title})`);
      skipped++;
      continue;
    }

    const markdown = generateMarkdown(plant);

    if (dryRun) {
      console.log(`[DRY-RUN] Would create: ${filename} (${plant.title})`);
    } else {
      try {
        fs.writeFileSync(filepath, markdown, 'utf8');
        created++;
        console.log(`✅ Created: ${filename} (${plant.title})`);
      } catch (err) {
        console.error(`❌ Failed to write ${filename}:`, err.message);
      }
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   Total: ${plants.length}`);
  console.log(`   Created: ${created}`);
  console.log(`   Skipped (existing): ${skipped}`);
  if (dryRun) console.log('   (dry-run mode, no files written)');
  console.log(`\n🎯 Total plants after import: ${existingFiles.size + created}`);

  if (!dryRun && created > 0) {
    console.log('\n📝 Next steps:');
    console.log('   1. Test locally: npm run dev');
    console.log('   2. Check new plant pages: http://localhost:3000/plants/' + slugify(plants[0].title));
    console.log('   3. Commit changes: git add . && git commit -m "Add ${created} new plants"');
    console.log('   4. Deploy: npm run deploy or vercel --prod');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});