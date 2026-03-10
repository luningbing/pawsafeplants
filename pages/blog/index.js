import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Head from 'next/head';

export async function getStaticProps() {
  const blogDir = path.join(process.cwd(), 'content', 'blog');
  let posts = [];
  try {
    const filenames = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
    posts = filenames.map(filename => {
      const slug = filename.replace(/\.md$/, '');
      const fullPath = path.join(blogDir, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        description: data.description || '',
        tags: data.tags || []
      };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (e) { console.error(e); }
  return { props: { posts }, revalidate: 3600 };
}

export default function BlogIndex({ posts }) {
  return (
    <div style={{ fontFamily: 'sans-serif', background: '#FAF7F2', minHeight: '100vh', padding: '40px 20px' }}>
      <Head>
        <title>Blog - PawSafePlants</title>
        <meta name="description" content="Cat-safe and toxic plant guides, tips, and news from PawSafePlants." />
        <link rel="canonical" href="https://www.pawsafeplants.com/blog" />
      </Head>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '42px', fontWeight: 700, color: '#6B8553', marginBottom: '40px', textAlign: 'center' }}>
          🐱 PawSafePlants Blog
        </h1>

        <div style={{ display: 'grid', gap: '24px' }}>
          {posts.map(post => (
            <article key={post.slug} style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              border: '1px solid #E8E4DC'
            }}>
              <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#333',
                  marginBottom: '12px'
                }}>
                  {post.title}
                </h2>
              </Link>

              {post.date && (
                <div style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>
                  📅 {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              )}

              {post.description && (
                <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.6, marginBottom: '16px' }}>
                  {post.description}
                </p>
              )}

              {post.tags && post.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {post.tags.map(tag => (
                    <span key={tag} style={{
                      background: '#87A96B20',
                      color: '#6B8553',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 500
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <Link href={`/blog/${post.slug}`} style={{
                display: 'inline-block',
                marginTop: '16px',
                color: '#6B8553',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '15px'
              }}>
                Read more →
              </Link>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666' }}>No blog posts yet. Check back soon!</p>
        )}
      </div>
    </div>
  );
}
