const fs = require('fs');
const path = require('path');

const jsonPath = path.join(process.cwd(), 'data', 'batch-01.json');
try {
  const raw = fs.readFileSync(jsonPath, 'utf8');
  console.log('File length:', raw.length);
  const data = JSON.parse(raw);
  console.log('Parsed successfully:', data.length, 'plants');
  console.log('First plant:', data[0].title);
} catch (err) {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
}