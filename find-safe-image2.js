const fs = require('fs');
const lines = fs.readFileSync('pages/plants/[slug].js', 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function SafeImage') || lines[i].includes('const SafeImage')) {
    console.log(`Line ${i+1}: ${lines[i].trim()}`);
    // 输出接下来几行
    for (let j = i; j < Math.min(i+10, lines.length); j++) {
      console.log(`  ${j+1}: ${lines[j].trim()}`);
    }
    break;
  }
}