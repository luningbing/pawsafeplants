import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function getStaticProps() {
  const plantsDir = path.join(process.cwd(), 'content/plants');
  const filenames = fs.readdirSync(plantsDir);
  const plants = filenames.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    const fullPath = path.join(plantsDir, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    return { slug, ...data };
  });
  return { props: { plants } };
}

export default function Home({ plants }) {
  return (
    <div>
      <h1>🐾 PawSafe Plants</h1>
      <p>Your quick guide to <strong>cat-safe and toxic plants</strong>. Keep your furbaby safe!</p>
      
      <h2>Recently Checked Plants</h2>
      {plants.map(plant => (
        <div className="card" key={plant.slug}>
          <h3><Link href={`/plants/${plant.slug}`}>{plant.title}</Link></h3>
          <p><span className={plant.toxicity_level?.includes('DANGER') ? 'danger' : 'safe'}>
            {plant.toxicity_level || 'Unknown'}
          </span></p>
          <p>{plant.summary}</p>
        </div>
      ))}

      <footer style={{ marginTop: '40px', fontSize: '0.9em', color: '#666' }}>
        <p>⚠️ If your cat ate a plant, contact your vet immediately.</p>
        <Link href="/about">About & Disclaimer</Link>
      </footer>
    </div>
  );
}
