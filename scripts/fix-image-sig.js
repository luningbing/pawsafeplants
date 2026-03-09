#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Generate a fixed signature from a string
 * Simple deterministic hash (sum of char codes) modulo large number
 */
function generateSig(str) {
  const sum = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (sum % 1000000).toString(); // 0-999999
}

function main() {
  const plantsDir = path.join(process.cwd(), 'content', 'plants');
  const files = fs.readdirSync(plantsDir).filter(f => f.endsWith('.md'));

  let updated = 0;

  files.forEach(file => {
    const filePath = path.join(plantsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    // Get title from frontmatter
    const titleMatch = content.match(/^title:\s*(.+)$/m);
    if (!titleMatch) return;

    const title = titleMatch[1].replace(/^"|"$/g, '').trim();
    const slug = file.replace(/\.md$/, '');

    // Generate fixed sig from slug
    const sig = generateSig(slug);

    // Build new image URL
    const query = encodeURIComponent(`${title} cat houseplant`);
    const newImageUrl = `https://source.unsplash.com/800x600/?${query}&sig=${sig}`;

    // Update image line
    const imageLineIdx = lines.findIndex(line => line.trim().startsWith('image:'));
    if (imageLineIdx !== -1) {
      lines[imageLineIdx] = `image: ${newImageUrl}`;
      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
      updated++;
      console.log(`✅ ${slug} -> sig:${sig} -> ${newImageUrl}`);
    }
  });

  console.log(`\n✅ Fixed images: ${updated} plants`);
}

main();
