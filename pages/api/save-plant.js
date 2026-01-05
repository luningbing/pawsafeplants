import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { 
    title, 
    scientific_name, 
    toxicity_level, 
    care_difficulty, 
    summary, 
    image, 
    slug,
    symptoms,
    what_to_do,
    aspca_link,
    care_tips,
    water_needs,
    light_needs,
    temperature
  } = req.body;

  if (!title || !toxicity_level || !care_difficulty || !summary || !slug) {
    return res.status(400).json({ error: 'Missing required fields (title, toxicity_level, care_difficulty, summary, slug)' });
  }

  // Basic sanitization for slug to ensure valid filename
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
  if (!cleanSlug) {
    return res.status(400).json({ error: 'Invalid plant name for slug generation.' });
  }

  // Build frontmatter with all available fields
  const frontmatter = [];
  frontmatter.push(`title: "${title}"`);
  if (scientific_name) frontmatter.push(`scientific_name: "${scientific_name}"`);
  frontmatter.push(`toxicity_level: "${toxicity_level}"`);
  frontmatter.push(`care_difficulty: "${care_difficulty}"`);
  frontmatter.push(`summary: "${summary}"`);
  if (image) frontmatter.push(`image: "${image}"`);
  
  // Add optional fields if provided
  if (symptoms && symptoms.length > 0) {
    frontmatter.push('symptoms:');
    symptoms.forEach(symptom => {
      frontmatter.push(`  - "${symptom}"`);
    });
  }
  
  if (what_to_do) frontmatter.push(`what_to_do: "${what_to_do}"`);
  if (aspca_link) frontmatter.push(`aspca_link: "${aspca_link}"`);
  if (care_tips) frontmatter.push(`care_tips: "${care_tips}"`);
  if (water_needs) frontmatter.push(`water_needs: "${water_needs}"`);
  if (light_needs) frontmatter.push(`light_needs: "${light_needs}"`);
  if (temperature) frontmatter.push(`temperature: "${temperature}"`);

  const markdownContent = `---
${frontmatter.join('\n')}
---

${summary}

${scientific_name ? `\n**Scientific Name:** ${scientific_name}` : ''}

## Toxicity Level
${toxicity_level}

${symptoms && symptoms.length > 0 ? `
## Symptoms
${symptoms.map(symptom => `- ${symptom}`).join('\n')}
` : ''}

${what_to_do ? `
## What to Do
${what_to_do}
` : ''}

${care_difficulty ? `
## Care Difficulty
${care_difficulty}
` : ''}

${water_needs ? `
## Water Needs
${water_needs}
` : ''}

${light_needs ? `
## Light Needs
${light_needs}
` : ''}

${temperature ? `
## Temperature
${temperature}
` : ''}

${care_tips ? `
## Care Tips
${care_tips}
` : ''}

${aspca_link ? `
## Additional Resources
[ASPCA Plant Guide](${aspca_link})
` : ''}
`;

  const filePath = path.join(process.cwd(), 'content/plants', `${cleanSlug}.md`);

  try {
    fs.writeFileSync(filePath, markdownContent);
    res.status(200).json({ 
      message: 'Plant saved successfully!', 
      slug: cleanSlug,
      filePath: `/content/plants/${cleanSlug}.md`
    });
  } catch (error) {
    console.error('Failed to write plant Markdown file:', error);
    res.status(500).json({ error: 'Failed to save plant data.' });
  }
}

