import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
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

export default function Home({ plants }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [filter, setFilter] = useState('All');
  const unsplashPlaceholder = 'https://images.unsplash.com/photo-1545241047-6083a3684587';

  const sageGreen = '#87A96B';
  const warmCream = '#FAF7F2';

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    const query = searchQuery.toLowerCase().trim();
    
    const results = plants.filter(plant => {
      const title = String(plant.title || '').toLowerCase();
      const scientific = String(plant.scientific_name || '').toLowerCase();
      
      // Simple direct matching - prioritize title and scientific name
      const titleMatch = title.includes(query);
      const scientificMatch = scientific.includes(query);
      
      // Only check summary for longer queries (3+ chars) and if no title/scientific match
      const summary = String(plant.summary || '').toLowerCase();
      const summaryMatch = query.length >= 3 && !titleMatch && !scientificMatch && summary.includes(query);
      
      return titleMatch || scientificMatch || summaryMatch;
    }).slice(0, 5);
    
    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  }, [searchQuery, plants]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && searchResults.length > 0) {
      // Navigate to first result or show results page
      window.location.href = `/plants/${searchResults[0].slug}`;
    }
  };

  const getToxicityCategory = (level) => {
    const L = String(level || '').toLowerCase();
    if (L.includes('safe')) return 'Safe';
    if (L.includes('danger') || L.includes('toxic')) return 'Danger';
    return 'Caution';
  };

  const displayedPlants = useMemo(() => {
    let sorted = plants.slice().sort((a, b) => {
      const aTitle = String(a.title || '').toLowerCase();
      const bTitle = String(b.title || '').toLowerCase();
      return aTitle.localeCompare(bTitle);
    });
    if (filter !== 'All') {
      sorted = sorted.filter(p => getToxicityCategory(p.toxicity_level) === filter);
    }
    return sorted.slice(0, 6);
  }, [plants, filter]);

  const getToxicityLevel = (level) => {
    const L = String(level || '').toLowerCase();
    if (L.includes('safe')) return { label: 'Safe', color: sageGreen, bg: `${sageGreen}20`, icon: '✅' };
    if (L.includes('danger') || L.includes('toxic')) return { label: 'Dangerous', color: '#E85D5D', bg: '#E85D5D20', icon: '❌' };
    return { label: 'Caution', color: '#F5C842', bg: '#F5C84220', icon: '⚠️' };
  };

  return (
    <div style={{ fontFamily: 'sans-serif', background: warmCream, minHeight: '100vh', padding: '20px' }}>
      <Head>
        <title>PawSafe Plants</title>
        <meta name="description" content="PawSafe Plants - Your guide to cat-safe and toxic plants. Browse our comprehensive database to keep your feline friends safe." />
        <link rel="canonical" href="https://www.pawsafeplants.com/" />
        <meta property="og:title" content="PawSafe Plants" />
        <meta property="og:description" content="Your guide to cat-safe and toxic plants." />
        <meta property="og:url" content="https://www.pawsafeplants.com/" />
        <meta property="og:type" content="website" />
      </Head>

      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>PawSafe Plants</h1>

      {/* Search */}
      <div style={{ maxWidth: '800px', margin: '0 auto 20px', position: 'relative' }}>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Search plants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                flex: 1, 
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid #ccc',
                fontSize: '16px'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                background: sageGreen,
                color: '#fff',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Search
            </button>
          </div>
        </form>
        
        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            marginTop: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            maxHeight: '300px',
            overflow: 'auto'
          }}>
            {searchResults.map(plant => {
              const toxicity = getToxicityLevel(plant.toxicity_level);
              return (
                <Link key={plant.slug} href={`/plants/${plant.slug}`} style={{
                  display: 'block',
                  padding: '12px 16px',
                  textDecoration: 'none',
                  color: '#333',
                  borderBottom: '1px solid #eee',
                  ':hover': { background: '#f5f5f5' }
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{plant.title}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {plant.summary?.substring(0, 60)}...
                      </div>
                    </div>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: 600,
                      background: toxicity.bg,
                      color: toxicity.color
                    }}>
                      {toxicity.icon} {toxicity.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter buttons */}
      <div style={{ maxWidth: '800px', margin: '0 auto 20px', textAlign: 'center' }}>
        {['All', 'Safe', 'Caution', 'Danger'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              margin: '4px',
              borderRadius: '20px',
              border: 'none',
              background: filter === f ? sageGreen : '#fff',
              color: filter === f ? '#fff' : '#333',
              cursor: 'pointer'
            }}
          >
            {f === 'All' ? 'All Plants' : f + ' Plants'}
          </button>
        ))}
      </div>

      {/* Plant grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {displayedPlants.map(plant => {
          const toxicity = getToxicityLevel(plant.toxicity_level);
          return (
            <div key={plant.slug} style={{ background: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <img loading="lazy" src={plant.image || unsplashPlaceholder} alt={plant.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
              <h3 style={{ margin: '12px 0 4px', color: sageGreen }}>{plant.title}</h3>
              <span style={{ padding: '4px 8px', borderRadius: '8px', fontSize: '12px', background: toxicity.bg, color: toxicity.color }}>
                {toxicity.icon} {toxicity.label}
              </span>
              <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>{plant.summary}</p>
              <Link href={`/plants/${plant.slug}`} style={{ display: 'inline-block', marginTop: '12px', padding: '8px 16px', background: sageGreen, color: '#fff', textDecoration: 'none', borderRadius: '8px' }}>
                View Details
              </Link>
            </div>
          );
        })}
      </div>

      {/* Category Navigation */}
      <div style={{ maxWidth: '800px', margin: '60px auto 20px', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '16px', color: '#6B8553', fontSize: '18px' }}>
          Browse by Safety Category
        </h3>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link 
            href="/safe-plants" 
            style={{
              padding: '12px 24px',
              borderRadius: '20px',
              background: sageGreen,
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '15px',
              boxShadow: '0 2px 8px rgba(135, 169, 107, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            ✅ Safe Plants
          </Link>
          <Link 
            href="/caution-plants" 
            style={{
              padding: '12px 24px',
              borderRadius: '20px',
              background: '#F5C842',
              color: '#333',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '15px',
              boxShadow: '0 2px 8px rgba(245, 200, 66, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            ⚠️ Caution Plants
          </Link>
          <Link 
            href="/toxic-plants" 
            style={{
              padding: '12px 24px',
              borderRadius: '20px',
              background: '#E85D5D',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '15px',
              boxShadow: '0 2px 8px rgba(232, 93, 93, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            ❌ Toxic Plants
          </Link>
        </div>
      </div>
    </div>
  );
}
