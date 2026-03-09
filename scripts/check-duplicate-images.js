const fs = require('fs');
const path = require('path');

const plantsDir = path.join(process.cwd(), 'content', 'plants');
const files = fs.readdirSync(plantsDir).filter(f => f.endsWith('.md'));

const urlCounts = {};
const duplicates = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(plantsDir, file), 'utf8');
  const match = content.match(/image:\s*[\r\n]+\s*(\S+)/);
  if (match) {
    const url = match[1];
    urlCounts[url] = (urlCounts[url] || 0) + 1;
  }
}

console.log('=== Image URL Usage Stats ===');
Object.entries(urlCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20)
  .forEach(([url, count]) => {
    console.log(`${count} plants: ${url.substring(0, 60)}...`);
    if (count > 1) duplicates.push({ url, count });
  });

console.log(`\nTotal unique URLs: ${Object.keys(urlCounts).length}`);
console.log(`Duplicates: ${duplicates.length} URLs used by multiple plants`);