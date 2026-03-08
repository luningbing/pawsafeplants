#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Convert a string to a URL-friendly slug
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Parse CSV text into an array of objects.
 * Handles quoted fields and commas inside quotes.
 */
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return [];

  // Split headers, respecting quotes
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = [];
    let inQuotes = false;
    let current = '';

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
        // Handle double quotes inside quoted field: "" -> "
        if (inQuotes && line[j + 1] === '"') {
          current += '"';
          j++;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);

    // Trim and unquote each value
    const row = {};
    headers.forEach((header, idx) => {
      let val = values[idx] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      row[header] = val.trim();
    });

    result.push(row);
  }

  return result;
}

/**
 * Main import logic
 */
function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('Usage: batch-import <path-to-csv-or-json>');
    process.exit(1);
  }

  const ext = path.extname(inputPath).toLowerCase();
  let plants = [];

  if (ext === '.csv') {
    const csvText = fs.readFileSync(inputPath, 'utf8');
    plants = parseCSV(csvText);
  } else if (ext === '.json') {
    const jsonText = fs.readFileSync(inputPath, 'utf8');
    plants = JSON.parse(jsonText);
  } else {
    console.error('Unsupported file type. Use .csv or .json');
    process.exit(1);
  }

  const contentDir = path.join(process.cwd(), 'content', 'plants');
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  let created = 0;
  let skipped = 0;

  plants.forEach(plant => {
    const title = plant.title || plant.name;
    if (!title) {
      console.warn('Skipping entry without title');
      skipped++;
      return;
    }

    const slug = slugify(title);
    const existingPath = path.join(contentDir, `${slug}.md`);
    if (fs.existsSync(existingPath)) {
      console.log(`Skipping duplicate: ${slug}`);
      skipped++;
      return;
    }

    const scientific_name = plant.scientific_name || plant.scientificName || '';
    const toxicity_level = plant.toxicity_level || plant.toxicity || plant.level || 'Caution';
    const care_difficulty = plant.care_difficulty || plant.difficulty || 'Medium';
    const summary = plant.summary || plant.description || '';
    const image = plant.image || plant.image_url || plant.photo || `https://images.unsplash.com/photo-1545241047-6083a3684587`;

    const frontmatter = `---
title: "${title}"
scientific_name: "${scientific_name}"
toxicity_level: "${toxicity_level}"
care_difficulty: "${care_difficulty}"
summary: "${summary}"
image: "${image}"
---

# ${title}

## Overview
${summary}

## Care Guide
- **Light**: Moderate indirect light
- **Water**: Allow soil to dry between waterings
- **Toxicity**: ${toxicity_level} to cats

## Scientific Name
${scientific_name}
`;

    fs.writeFileSync(existingPath, frontmatter, 'utf8');
    console.log(`Created: ${slug}.md`);
    created++;
  });

  console.log(`\n✅ Import complete: ${created} created, ${skipped} skipped`);
}

main();
