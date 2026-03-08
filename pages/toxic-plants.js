import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PageTransition, FadeIn, ListItemAnimation } from '../components/PageTransitions';

function SafeImage({ src, alt, fallback, style, containerStyle, unsplashFallback }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  useEffect(() => { setImgSrc(src); setHasError(false); }, [src]);
  const handleError = () => {
    if (!hasError && unsplashFallback) { setImgSrc(unsplashFallback); setHasError(false); }
    else { setHasError(true); setImgSrc(null); }
  };
  if (hasError || !imgSrc) {
    return <div style={{ ...style, ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #87A96B20, #87A96B10)', color: '#87A96B' }}>{fallback || <span style={{ fontSize: '32px' }}>🌿</span>}</div>;
  }
  return <img src={imgSrc} alt={alt} style={style} onError={handleError} />;
}

export async function getStaticProps() {
  const plantsDir = path.join(process.cwd(), 'content/plants');
  let plants = [];
  try {
    const filenames = fs.readdirSync(plantsDir).filter((f) => f.endsWith('.md'));
    plants = filenames.map(filename => {
      const slug = filename.replace(/\.md$/, '');
      const fullPath = path.join(plantsDir, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return { slug, ...data };
    });
  } catch {}
  if (!plants.length) {
    plants = [{ slug: 'lily', title: 'Lily', toxicity_level: 'DANGER – Highly toxic to cats', summary: 'Toxic example' }];
  }

  // Filter: Only Danger/Toxic
  const toxicPlants = plants.filter(p => {
    const L = String(p.toxicity_level || '').toLowerCase();
    return L.includes('danger') || L.includes('toxic') || L.includes('extreme');
  });

  return { props: { plants: toxicPlants }, revalidate: 10 };
}

export default function ToxicPlantsPage({ plants: toxicPlants }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const sageGreen = '#87A96B';
  const sageGreenDark = '#6B8553';
  const warmCream = '#FAF7F2';
  const warmCreamDark = '#F5F1E8';
  const borderRadius = '24px';
  const unsplashPlaceholder = 'https://images.unsplash.com/photo-1545241047-6083a3684587';

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); setShowSearchResults(false); return; }
    const query = searchQuery.toLowerCase();
    const results = toxicPlants.filter(plant => {
      const title = String(plant.title || '').toLowerCase();
      const scientific = String(plant.scientific_name || '').toLowerCase();
      const summary = String(plant.summary || '').toLowerCase();
      return title.includes(query) || scientific.includes(query) || summary.includes(query);
    }).slice(0, 5);
    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  }, [searchQuery, toxicPlants]);

  const getToxicityLevel = (level) => {
    const L = String(level || '').toLowerCase();
    if (L.includes('safe')) return { label: 'Safe', color: sageGreen, bg: `${sageGreen}20`, icon: '✅' };
    if (L.includes('danger') || L.includes('toxic')) return { label: 'Dangerous', color: '#E85D5D', bg: '#E85D5D20', icon: '❌' };
    return { label: 'Caution', color: '#F5C842', bg: '#F5C84220', icon: '⚠️' };
  };

  return (
    <PageTransition>
      <Head>
        <title>Toxic Plants for Cats - PawSafe Plants</title>
        <meta name="description" content="List of plants that are toxic to cats. Keep these away from your feline friends." />
      </Head>

      <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif', background: warmCream, minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: sageGreenDark, textDecoration: 'none', marginBottom: '24px', fontWeight: 500 }}>← Back to all plants</Link>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 700, color: '#E85D5D', marginBottom: '16px' }}>❌ Toxic Plants for Cats</h1>
            <p style={{ fontSize: '18px', color: '#666', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
              These plants are harmful to cats and can cause serious health issues. Avoid having them in your home if you have cats.
            </p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto 40px auto', position: 'relative' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', border: `2px solid ${warmCreamDark}`, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: '20px', fontSize: '20px' }}>🔍</div>
              <input
                type="text"
                placeholder="Search toxic plants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '16px 20px 16px 56px', border: 'none', background: 'transparent', fontSize: '16px', outline: 'none', borderRadius: '24px' }}
              />
            </div>
            {showSearchResults && searchResults.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', borderRadius: borderRadius, marginTop: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', border: `2px solid ${warmCreamDark}`, zIndex: 100, maxHeight: '400px', overflow: 'auto' }}>
                {searchResults.map(plant => {
                  const toxicity = getToxicityLevel(plant.toxicity_level);
                  return (
                    <Link key={plant.slug} href={`/plants/${plant.slug}`} style={{ display: 'block', padding: '16px 20px', textDecoration: 'none', color: '#2D2D2D', borderBottom: `1px solid ${warmCreamDark}` }} onMouseEnter={(e) => e.currentTarget.style.background = warmCream} onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '16px' }}>{plant.title}</div>
                          <div style={{ fontSize: '14px', color: '#5A5A5A' }}>{plant.summary?.substring(0, 60)}...</div>
                        </div>
                        <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: toxicity.bg, color: toxicity.color }}>{toxicity.icon} {toxicity.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {toxicPlants.map((plant, index) => {
              const toxicity = getToxicityLevel(plant.toxicity_level);
              return (
                <ListItemAnimation key={plant.slug} index={index}>
                  <div style={{ background: '#fff', borderRadius: borderRadius, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: `2px solid ${warmCreamDark}`, transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)'; e.currentTarget.style.borderColor = sageGreen + '40'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = warmCreamDark; }}>
                    <div style={{ height: '240px', overflow: 'hidden', background: warmCreamDark }}>
                      <SafeImage src={plant.image || plant.thumbPlant || unsplashPlaceholder} alt={plant.title} unsplashFallback={unsplashPlaceholder} style={{ width: '100%', height: '100%', objectFit: 'cover' }} containerStyle={{ width: '100%', height: '100%' }} />
                    </div>
                    <div style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 700, color: sageGreenDark, margin: 0 }}>{plant.title}</h3>
                        <span style={{ padding: '6px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: 600, background: toxicity.bg, color: toxicity.color, whiteSpace: 'nowrap' }}>{toxicity.icon} {toxicity.label}</span>
                      </div>
                      <p style={{ fontSize: '15px', color: '#5A5A5A', lineHeight: 1.6, marginBottom: '20px', minHeight: '48px' }}>{plant.summary || 'Learn more about this plant.'}</p>
                      <Link href={`/plants/${plant.slug}`} style={{ display: 'inline-block', padding: '12px 24px', background: '#E85D5D', color: '#fff', textDecoration: 'none', borderRadius: borderRadius, fontWeight: 600, fontSize: '15px', textAlign: 'center', width: '100%', transition: 'all 0.3s ease' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#c92a2a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#E85D5D'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                        View Details
                      </Link>
                    </div>
                  </div>
                </ListItemAnimation>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{` @media (max-width: 768px) { h1 { font-size: 32px !important; } } `}</style>
    </PageTransition>
  );
}
