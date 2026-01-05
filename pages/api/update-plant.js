import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { slug, ...updateData } = req.body;

  if (!slug) {
    return res.status(400).json({ error: 'Plant slug is required' });
  }

  const filePath = path.join(process.cwd(), 'content/plants', `${slug}.md`);

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    // Read existing file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContents);

    // Update frontmatter with new data
    const updatedFrontmatter = {
      ...frontmatter,
      ...updateData
    };

    // Build new markdown content
    const newMarkdownContent = `---
${Object.entries(updatedFrontmatter)
  .filter(([key, value]) => value !== undefined && value !== null && value !== '')
  .map(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length === 0) return '';
      return `${key}:\n${value.map(item => `  - "${item}"`).join('\n')}`;
    }
    return `${key}: "${value}"`;
  })
  .filter(line => line !== '')
  .join('\n')}
---

${content}
`;

    // Write updated file
    fs.writeFileSync(filePath, newMarkdownContent);

    res.status(200).json({ 
      message: 'Plant updated successfully!', 
      slug: slug
    });
  } catch (error) {
    console.error('Failed to update plant:', error);
    res.status(500).json({ error: 'Failed to update plant data.' });
  }
}
