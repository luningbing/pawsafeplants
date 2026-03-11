'use client';

import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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
  } catch (e) { console.error(e); }
  if (!plants.length) {
    plants = [
      { slug: 'lily', title: 'Lily', toxicity_level: 'DANGER – Highly toxic to cats', summary: 'Even small ingestions can cause acute kidney failure in cats.' },
      { slug: 'rose', title: 'Rose', toxicity_level: 'Safe – generally non-toxic', summary: 'Thorns can cause injury but the plant is generally non-toxic.' }
    ];
  }
  return { props: { plants }, revalidate: 10 };
}

export default function CheckPage({ plants }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);

  const sageGreen = '#87A96B';
  const cautionYellow = '#F5A623';
  const dangerRed = '#E53935';

  const getToxicityCategory = (level) => {
    const L = String(level || '').toLowerCase();
    if (L.includes('safe')) return { category: 'Safe', color: sageGreen };
    if (L.includes('danger') || L.includes('toxic') || L.includes('highly')) return { category: 'Danger', color: dangerRed };
    return { category: 'Caution', color: cautionYellow };
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    const q = query.toLowerCase().trim();
    const matches = plants.filter(p => {
      const title = String(p.title || '').toLowerCase();
      const scientific = String(p.scientific_name || '').toLowerCase();
      const commons = Array.isArray(p.common_names) ? p.common_names.map(c => String(c).toLowerCase()) : [];
      const titleMatch = title.includes(q);
      const scientificMatch = scientific.includes(q);
      const commonMatch = commons.some(c => c.includes(q));
      return titleMatch || scientificMatch || commonMatch;
    });
    setResults(matches);
    setHasSearched(true);
  }, [query, plants]);

  const handleSelect = (plant) => {
    setSelectedPlant(plant);
  };

  return (
    <>
      <Head>
        <title>Quick Plant Safety Check for Cats | PawSafePlants</title>
        <meta name="description" content="Quickly check if a plant is safe for cats. Search our database of 200+ plants to protect your feline friends." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://pawsafeplants.com/check" />
        {/* Open Graph */}
        <meta property="og:title" content="Quick Plant Safety Check for Cats" />
        <meta property="og:description" content="Instantly check if a plant is safe for your cat. Search 200+ plants with up-to-date toxicity info." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pawsafeplants.com/check" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Quick Plant Safety Check" />
        <meta name="twitter:description" content="Is that plant safe for your cat? Find out now." />
      </Head>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #FAF7F2 0%, #f5f0e8 100%)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        {/* Header */}
        <header style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: sageGreen, textDecoration: 'none' }}>🦞 PawSafePlants</Link>
          <nav style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/" style={{ color: '#666', textDecoration: 'none' }}>Home</Link>
            <Link href="/blog" style={{ color: '#666', textDecoration: 'none' }}>Blog</Link>
            <Link href="/check" style={{ color: sageGreen, fontWeight: 'bold', textDecoration: 'none' }}>Check</Link>
          </nav>
        </header>

        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '0.5rem' }}>Quick Plant Safety Check</h1>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>Enter a plant name to instantly check if it&apos;s safe for your cat.</p>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', marginBottom: '2rem' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Lily, Rose, Monstera, Aloe..."
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                fontSize: '1.1rem',
                border: `2px solid ${hasSearched ? sageGreen : '#ddd'}`,
                borderRadius: '50px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
                background: 'white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            />
            {query && results.length > 0 && (
              <ul style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                border: '1px solid #eee',
                borderRadius: '12px',
                marginTop: '0.5rem',
                listStyle: 'none',
                padding: 0,
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 100,
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }}>
                {results.map(p => (
                  <li
                    key={p.slug}
                    onClick={() => handleSelect(p)}
                    style={{
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{p.title} {p.scientific_name && `(${p.scientific_name})`}</span>
                    <span style={{ fontSize: '0.85rem', color: '#888' }}>Click to check</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Selected Plant Result */}
          {selectedPlant && (
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
              marginBottom: '2rem',
              animation: 'fadeIn 0.3s ease'
            }}>
              {(() => {
                const { category, color } = getToxicityCategory(selectedPlant.toxicity_level);
                return (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <h2 style={{ fontSize: '1.8rem', color: '#333', margin: 0 }}>{selectedPlant.title}</h2>
                        {selectedPlant.scientific_name && (
                          <em style={{ color: '#666', fontSize: '0.95rem' }}>{selectedPlant.scientific_name}</em>
                        )}
                      </div>
                      <span style={{
                        background: color + '20',
                        color: color,
                        padding: '0.4rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        border: `1px solid ${color}40`
                      }}>
                        {category}
                      </span>
                    </div>

                    <p style={{ color: '#555', lineHeight: 1.7, marginBottom: '1.5rem' }}>{selectedPlant.summary}</p>

                    <Link
                      href={`/plants/${selectedPlant.slug}`}
                      style={{
                        display: 'inline-block',
                        background: sageGreen,
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '30px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(135, 169, 107, 0.3)'
                      }}
                    >
                      View Full Details &rarr;
                    </Link>
                  </>
                );
              })()}
            </div>
          )}

          {/* Instructions */}
          {!hasSearched && (
            <div style={{ textAlign: 'center', color: '#888', marginTop: '3rem' }}>
              <p style={{ fontSize: '1.1rem' }}>Start typing to search our database of 200+ plants.</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>We cover common houseplants, garden plants, and flowers.</p>
            </div>
          )}

          {hasSearched && results.length === 0 && query && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
              <p>No results found for &quot;{query}&quot;. Try a different name or check spelling.</p>
            </div>
          )}

          {/* SEO Hidden Content (for indexing) */}
          <div style={{ display: 'none' }}>
            <p>PawSafePlants quick check tool lets you search our comprehensive database of plants to determine toxicity levels for cats. We provide accurate, up-to-date information based on ASPCA and veterinary sources. Common searches include: lily toxicity, rose safety for cats, monstera, aloe vera, pothos, snake plant, and many more.</p>
          </div>
        </main>

        <footer style={{ textAlign: 'center', padding: '2rem', color: '#999', fontSize: '0.9rem', borderTop: '1px solid #eee' }}>
          <p>PawSafePlants &copy; {new Date().getFullYear()} — Helping keep cats safe</p>
        </footer>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </>
  );
}