#!/usr/bin/env node
// Fix YAML summary fields by ensuring they are quoted if they contain ':'

const fs = require('fs');
const path = require('path');

const plantsDir = path.join(process.cwd(), 'content', 'plants');

const files = fs.readdirSync(plantsDir).filter(f => f.endsWith('.md'));

let fixed = 0;

files.forEach(file => {
  const filePath = path.join(plantsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if summary line exists and is not already quoted
  const summaryMatch = content.match(/^summary:\s*(.*)$/m);
  if (summaryMatch) {
    const original = summaryMatch[1];
    if (!original.startsWith('"') && original.includes(':')) {
      // Quote the summary value
      const quoted = `"${original}"`;
      content = content.replace(/^summary:\s*.*$/, `summary: ${quoted}`);
      fs.writeFileSync(filePath, content, 'utf8');
      fixed++;
      console.log(`Fixed: ${file}`);
    }
  }
});

console.log(`✅ Fixed ${fixed} files`);
