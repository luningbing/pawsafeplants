export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log('🔍 Debug update-plant request');
  console.log('📋 Request headers:', req.headers);
  console.log('📝 Request body:', req.body);

  const { slug, ...updateData } = req.body;

  if (!slug) {
    console.error('❌ Plant slug is required');
    return res.status(400).json({ error: 'Plant slug is required' });
  }

  console.log('🔄 Updating plant:', slug);
  console.log('📝 Update data:', updateData);

  // Check if content/plants directory exists
  const fs = require('fs');
  const path = require('path');
  const plantsDir = path.join(process.cwd(), 'content/plants');
  
  console.log('📁 Plants directory:', plantsDir);
  console.log('📁 Directory exists:', fs.existsSync(plantsDir));
  
  if (fs.existsSync(plantsDir)) {
    const files = fs.readdirSync(plantsDir);
    console.log('📄 Files in plants directory:', files);
  }

  const filePath = path.join(process.cwd(), 'content/plants', `${slug}.md`);
  console.log('📁 File path:', filePath);
  console.log('📁 File exists:', fs.existsSync(filePath));

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('❌ Plant file not found:', filePath);
      return res.status(404).json({ 
        error: 'Plant not found',
        filePath: filePath,
        availableFiles: fs.existsSync(plantsDir) ? fs.readdirSync(plantsDir) : []
      });
    }

    // Read existing file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    console.log('📖 File contents length:', fileContents.length);
    console.log('📖 File contents preview:', fileContents.substring(0, 200));

    const matter = require('gray-matter');
    const { data: frontmatter, content } = matter(fileContents);

    console.log('📖 Existing frontmatter:', frontmatter);
    console.log('📖 Content length:', content.length);

    // Update frontmatter with new data
    const updatedFrontmatter = {
      ...frontmatter,
      ...updateData
    };

    console.log('✏️ Updated frontmatter:', updatedFrontmatter);

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

    console.log('💾 New content length:', newMarkdownContent.length);
    console.log('💾 Writing updated file...');

    // Write updated file
    fs.writeFileSync(filePath, newMarkdownContent);

    console.log('✅ Plant updated successfully:', slug);

    res.status(200).json({ 
      message: 'Plant updated successfully!', 
      slug: slug,
      updatedData: updateData,
      filePath: filePath
    });
  } catch (error) {
    console.error('🚨 Failed to update plant:', error);
    console.error('🚨 Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to update plant data.',
      details: error.message,
      stack: error.stack
    });
  }
}
