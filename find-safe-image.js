const fs = require('fs');
const content = fs.readFileSync('pages/plants/[slug].js', 'utf8');
const idx = content.indexOf('function SafeImage');
console.log('SafeImage at position:', idx);
if (idx > 0) {
  const snippet = content.substring(idx, idx + 800);
  console.log(snippet);
}