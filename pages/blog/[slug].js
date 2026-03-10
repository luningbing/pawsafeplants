import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Link from 'next/link';
import Head from 'next/head';

export async function getStaticProps({ params }) {
  const { slug } = params;
  const fullPath = path.join(process.cwd(), 'content', 'blog', `${slug}.md`);
  if (fs.existsSync(fullPath)) {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();
    return {
      props: {
        post: {
          slug,
          title: data.title || slug,
          date: data.date || '',
          description: data.description || '',
          tags: data.tags || [],
          contentHtml
        }
      },
      revalidate: 3600
    };
  }
  return { notFound: true };
}

export default function BlogPost({ post }) {
  return (
    <div style={{ fontFamily: 'sans-serif', background: '#FAF7F2', minHeight: '100vh', padding: '40px 20px' }}>
      <Head>
        <title>{post.title} - PawSafePlants Blog</title>
        <meta name="description" content={post.description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:url" content={`https://www.pawsafeplants.com/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          datePublished: post.date,
          author: { '@type': 'Organization', name: 'PawSafePlants' },
          description: post.description
        })}</script>
      </Head>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Back Link */}
        <Link href="/blog" style={{
          display: 'inline-flex',
          alignItems: 'center',
          color: '#6B8553',
          textDecoration: 'none',
          fontWeight: 500,
          marginBottom: '24px'
        }}>
          ← Back to Blog
        </Link>

        <article style={{ background: '#fff', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          <header style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '36px',
              fontWeight: 700,
              color: '#333',
              lineHeight: 1.2,
              marginBottom: '16px'
            }}>
              {post.title}
            </h1>

            {post.date && (
              <div style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>
                📅 {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
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
          </header>

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            style={{
              fontSize: '17px',
              lineHeight: 1.7,
              color: '#333'
            }}
          />
        </article>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: '#6B8553',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: 600
            }}
          >
            Explore Cat-Safe Plants →
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .blog-content h2 {
          font-size: 24px;
          margin: 32px 0 12px 0;
          color: #6B8553;
          font-weight: 600;
        }
        .blog-content h3 {
          font-size: 20px;
          margin: 24px 0 10px 0;
          color: #555;
          font-weight: 600;
        }
        .blog-content ul, .blog-content ol {
          margin: 12px 0 20px 20px;
          line-height: 1.8;
        }
        .blog-content li {
          margin-bottom: 6px;
        }
        .blog-content p {
          margin-bottom: 16px;
        }
        .blog-content strong {
          color: #6B8553;
        }
      `}</style>
    </div>
  );
}
