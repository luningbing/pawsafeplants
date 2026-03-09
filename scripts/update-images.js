#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Generate an Unsplash image URL based on plant name.
 * Priority: plant + cat → plant + indoor → cat + plants generic
 */
function generateImageUrl(title) {
  const queryBase = title.replace(/\s+/g, '+');
  // Try plant + cat first (for cute cat-with-plant photos)
  return `https://source.unsplash.com/800x600/?${queryBase},cat,houseplant`;
}

/**
 * Update all plant markdown files with new image URLs
 */
function main() {
  const plantsDir = path.join(process.cwd(), 'content', 'plants');
  const files = fs.readdirSync(plantsDir).filter(f => f.endsWith('.md'));

  let updated = 0;
  let skipped = 0;

  files.forEach(file => {
    const filePath = path.join(plantsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // Find title from frontmatter
    const titleMatch = content.match(/^title:\s*(.+)$/m);
    if (!titleMatch) {
      skipped++;
      return;
    }
    const title = titleMatch[1].replace(/^"|"$/g, '').trim();

    // Generate new image URL
    const newImageUrl = generateImageUrl(title);

    // Check if image line exists
    const imageLineIdx = lines.findIndex(line => line.startsWith('image:'));
    if (imageLineIdx !== -1) {
      lines[imageLineIdx] = `image: ${newImageUrl}`;
      updated++;
      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
      console.log(`Updated: ${file} -> ${title}`);
    } else {
      skipped++;
    }
  });

  console.log(`\n✅ Image update complete: ${updated} updated, ${skipped} skipped`);
}

main();
