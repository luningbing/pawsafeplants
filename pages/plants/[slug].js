import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Link from 'next/link';

export async function getStaticProps({ params }) {
  const { slug } = params;
  const fullPath = path.join(process.cwd(), 'content/plants', `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return { notFound: true };
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const symptoms = Array.isArray(data.symptoms) ? data.symptoms : [];
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();
  return {
    props: {
      plant: {
        ...data,
        symptoms,
        contentHtml,
        slug
      }
    }
  };
}

export async function getStaticPaths() {
  const dir = path.join(process.cwd(), 'content/plants');
  let files = [];
  try { files = fs.readdirSync(dir).filter((f) => f.endsWith('.md')); } catch {}
  const paths = files.map((f) => ({ params: { slug: f.replace(/\.md$/, '') } }));
  return { paths, fallback: 'blocking' };
}

export default function PlantPage({ plant }) {
  return (
    <div>
      <Link href="/">← Back to all plants</Link>
      <h1>{plant.title}</h1>
      {plant.scientific_name && <p><em>{plant.scientific_name}</em></p>}
      <p className={plant.toxicity_level?.includes('DANGER') ? 'danger' : 'safe'}>
        Toxicity: {plant.toxicity_level}
      </p>
      <p>{plant.summary}</p>

      {plant.symptoms && (
        <>
          <h3>Symptoms of poisoning:</h3>
          <ul>
            {plant.symptoms.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </>
      )}

      {plant.what_to_do && (
        <>
          <h3>What to do:</h3>
          <div dangerouslySetInnerHTML={{ __html: plant.what_to_do }} />
        </>
      )}

      {plant.ascpa_link && (
        <p>
          <a href={plant.ascpa_link} target="_blank" rel="noopener">
            View on ASPCA.org
          </a>
        </p>
      )}

      <hr />
      <Link href="/">Check another plant</Link>
    </div>
  );
}
