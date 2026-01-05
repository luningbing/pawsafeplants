import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { slug } = req.body;

  if (!slug) {
    return res.status(400).json({ error: 'Plant slug is required' });
  }

  const filePath = path.join(process.cwd(), 'content/plants', `${slug}.md`);

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.status(200).json({ 
      message: 'Plant deleted successfully!', 
      slug: slug
    });
  } catch (error) {
    console.error('Failed to delete plant:', error);
    res.status(500).json({ error: 'Failed to delete plant data.' });
  }
}
