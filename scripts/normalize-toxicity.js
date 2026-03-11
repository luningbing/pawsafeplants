#!/usr/bin/env node
// Normalize toxicity_level values in all plant markdown files to: Safe, Danger, Caution

const fs = require('fs');
const path = require('path');

const plantsDir = path.join(process.cwd(), 'content', 'plants');

function normalizeLevel(level) {
  if (!level) return 'Caution';
  const L = String(level).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const clean = L.replace(/[^\w\s-]/g, '').trim();
  if (clean.includes('safe')) return 'Safe';
  if (clean.includes('danger') || clean.includes('toxic') || clean.includes('extreme') || clean.includes('fatal')) return 'Danger';
  return 'Caution';
}

function processFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    console.log(`Skipping ${filepath}: no frontmatter`);
    return false;
  }
  
  const frontmatter = frontmatterMatch[1];
  if (!frontmatter.includes('toxicity_level:')) {
    console.log(`Skipping ${filepath}: no toxicity_level`);
    return false;
  }
  
  const newFrontmatter = frontmatter.replace(/toxicity_level:\s*(.+)/, (match, level) => {
    const normalized = normalizeLevel(level);
    return `toxicity_level: ${normalized}`;
  });
  
  if (newFrontmatter === frontmatter) return false; // no change
  
  const newContent = content.replace(frontmatter, newFrontmatter);
  fs.writeFileSync(filepath, newContent, 'utf8');
  return true;
}

const files = fs.readdirSync(plantsDir).filter(f => f.endsWith('.md'));
let changed = 0;
files.forEach(file => {
  const full = path.join(plantsDir, file);
  if (processFile(full)) {
    changed++;
    console.log(`✅ ${file}`);
  }
});

console.log(`\nTotal files: ${files.length}, changed: ${changed}`);
