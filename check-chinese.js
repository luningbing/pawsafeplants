const fs = require('fs');
const path = require('path');

function checkChineseInFiles(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    console.log(`\n=== Checking ${file} ===`);
    let hasChinese = false;
    
    lines.forEach((line, index) => {
      // Check for Chinese characters (Unicode range for CJK)
      if (/[\u4e00-\u9fff]/.test(line)) {
        console.log(`${file}:${index + 1}: ${line.trim()}`);
        hasChinese = true;
      }
    });
    
    if (!hasChinese) {
      console.log('✅ No Chinese characters found');
    }
  });
}

// Check pages directory
checkChineseInFiles('./pages');

// Also check content/plants directory
console.log('\n\n=== Checking content/plants ===');
try {
  const contentDir = './content/plants';
  if (fs.existsSync(contentDir)) {
    const mdFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
    console.log(`Found ${mdFiles.length} markdown files`);
    
    mdFiles.slice(0, 3).forEach(file => { // Check first 3 files as sample
      const filePath = path.join(contentDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      console.log(`\n--- Sample from ${file} ---`);
      let hasChinese = false;
      
      lines.slice(0, 10).forEach((line, index) => { // Check first 10 lines
        if (/[\u4e00-\u9fff]/.test(line)) {
          console.log(`${file}:${index + 1}: ${line.trim()}`);
          hasChinese = true;
        }
      });
      
      if (!hasChinese) {
        console.log('✅ No Chinese in first 10 lines');
      }
    });
  } else {
    console.log('❌ content/plants directory not found');
  }
} catch (e) {
  console.log('❌ Error checking content:', e.message);
}

console.log('\n=== Check Complete ===');
