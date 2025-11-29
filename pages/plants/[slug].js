import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export async function getStaticProps({ params }) {
  const { slug } = params;
  const fullPath = path.join(process.cwd(), 'content/plants', `${slug}.md`);
  if (fs.existsSync(fullPath)) {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const symptoms = Array.isArray(data.symptoms) ? data.symptoms : [];
    const common_names = Array.isArray(data.common_names) ? data.common_names : [];
    const clinical_signs = Array.isArray(data.clinical_signs) ? data.clinical_signs : [];
    const safe_alternatives = Array.isArray(data.safe_alternatives) ? data.safe_alternatives : [];
    const sources = Array.isArray(data.sources) ? data.sources : [];
    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();
    const what_to_do_html = String(data.what_to_do || '').trim()
      ? (await remark().use(html).process(String(data.what_to_do || ''))).toString()
      : '';
    let image = String(data.image || '');
    let image2 = String(data.image2 || '');
    let image3 = String(data.image3 || '');
    let fallbackHero = '/images/hero-default.svg';
    try {
      const siteRaw = fs.readFileSync(path.join(process.cwd(), 'content', 'site.json'), 'utf8');
      const siteJson = JSON.parse(siteRaw);
      if (siteJson && siteJson.heroImage) fallbackHero = siteJson.heroImage;
    } catch {}
    if (!image) image = fallbackHero;
    if (image) {
      try {
        const clean = image.startsWith('/') ? image.slice(1) : image;
        const abs = path.join(process.cwd(), 'public', clean);
        if (!fs.existsSync(abs)) image = fallbackHero;
      } catch {}
    }
    if (image2) {
      try {
        const clean2 = image2.startsWith('/') ? image2.slice(1) : image2;
        const abs2 = path.join(process.cwd(), 'public', clean2);
        if (!fs.existsSync(abs2)) image2 = '';
      } catch {}
    }
    if (image3) {
      try {
        const clean3 = image3.startsWith('/') ? image3.slice(1) : image3;
        const abs3 = path.join(process.cwd(), 'public', clean3);
        if (!fs.existsSync(abs3)) image3 = '';
      } catch {}
    }
    try {
      const supabaseUrl = process.env.SUPABASE_URL || ''
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
      if (supabaseUrl && supabaseKey) {
        const client = createClient(supabaseUrl, supabaseKey)
        const { data: rows } = await client.from('plant_images').select('image,image2,image3').eq('slug', slug).limit(1)
        const row = Array.isArray(rows) && rows[0] ? rows[0] : {}
        image = String(row.image || image || '')
        image2 = String(row.image2 || image2 || '')
        image3 = String(row.image3 || image3 || '')
      }
    } catch {}
    return {
      props: {
        plant: {
          ...data,
          image,
          image2,
          image3,
          symptoms,
          common_names,
          clinical_signs,
          safe_alternatives,
          sources,
          contentHtml,
          what_to_do_html,
          slug
        }
      }
    };
  }
  const fallback = {
    lily: {
      title: 'Lily (百合)',
      scientific_name: 'Lilium spp.',
      toxicity_level: 'DANGER – Highly toxic to cats',
      summary: 'Even small ingestions can cause acute kidney failure in cats.',
      symptoms: ['Vomiting', 'Lethargy', 'Loss of appetite', 'Kidney failure'],
      what_to_do: '<p>Contact your veterinarian immediately. Early decontamination and IV fluids are critical.</p>'
    },
    rose: {
      title: 'Rose (玫瑰)',
      scientific_name: 'Rosa spp.',
      toxicity_level: 'Safe – generally non-toxic',
      summary: 'Thorns can cause injury but the plant is generally non-toxic.',
      symptoms: [],
      what_to_do: '<p>Monitor for mechanical injury from thorns; toxicity is unlikely.</p>'
    }
  }
  const data = fallback[slug]
  if (!data) return { notFound: true }
  return { props: { plant: { ...data, contentHtml: '', slug } } }
}

export async function getStaticPaths() {
  const dir = path.join(process.cwd(), 'content/plants');
  let files = [];
  try { files = fs.readdirSync(dir).filter((f) => f.endsWith('.md')); } catch {}
  let paths = files.map((f) => ({ params: { slug: f.replace(/\.md$/, '') } }));
  if (!paths.length) paths = [{ params: { slug: 'lily' } }, { params: { slug: 'rose' } }]
  return { paths, fallback: 'blocking' };
}

export default function PlantPage({ plant }) {
  const [comments, setComments] = useState([])
  const [userName, setUserName] = useState('')
  const [userContent, setUserContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [openReplies, setOpenReplies] = useState({})
  useEffect(() => {
    try {
      const body = { page_path: window.location.pathname, referrer: document.referrer }
      fetch('/api/analytics/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => {})
    } catch {}
  }, [])
  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch('/api/comments/list?slug=' + encodeURIComponent(plant.slug))
        const j = await r.json()
        setComments(j.comments || [])
      } catch {}
    }
    load()
  }, [plant.slug])
  const onSubmit = async (e) => {
    e.preventDefault()
    if (!userContent.trim()) return
    setSubmitting(true)
    try {
      const body = { slug: plant.slug, user_name: userName, content: userContent }
      const r = await fetch('/api/comments/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (r.ok) {
        setUserContent('')
        setUserName('')
      }
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <div>
      <Link href="/">← Back to all plants</Link>
      <h1>{plant.title}</h1>
      {plant.scientific_name && <p><em>{plant.scientific_name}</em></p>}
      <p className={plant.toxicity_level?.includes('DANGER') ? 'danger' : 'safe'}>
        Toxicity: {plant.toxicity_level}
      </p>
      {plant.image && <img src={plant.image} alt={plant.title} style={{ width: '100%', height: 360, objectFit: 'cover', objectPosition: 'center', borderRadius: 12, marginTop: 12 }} />}
      {(plant.image2 || plant.image3) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          {plant.image2 && (
            <img src={plant.image2} alt={(plant.title || '') + ' - 2'} style={{ width: '100%', height: 220, objectFit: 'cover', objectPosition: 'center', borderRadius: 12 }} />
          )}
          {plant.image3 && (
            <img src={plant.image3} alt={(plant.title || '') + ' - 3'} style={{ width: '100%', height: 220, objectFit: 'cover', objectPosition: 'center', borderRadius: 12 }} />
          )}
        </div>
      )}
      <p>{plant.summary}</p>

      {plant.common_names && plant.common_names.length > 0 && (
        <>
          <h3>Also known as:</h3>
          <ul>
            {plant.common_names.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </>
      )}

      {plant.toxic_principles && (
        <p><strong>Toxic principles:</strong> {plant.toxic_principles}</p>
      )}

      {plant.symptoms && (
        <>
          <h3>Symptoms of poisoning:</h3>
          <ul>
            {plant.symptoms.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </>
      )}

      {plant.clinical_signs && plant.clinical_signs.length > 0 && (
        <>
          <h3>Clinical signs:</h3>
          <ul>
            {plant.clinical_signs.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </>
      )}

      {(plant.what_to_do_html || plant.what_to_do) && (
        <>
          <h3>What to do:</h3>
          <div dangerouslySetInnerHTML={{ __html: plant.what_to_do_html || plant.what_to_do }} />
        </>
      )}

      {plant.safe_alternatives && plant.safe_alternatives.length > 0 && (
        <>
          <h3>Safe alternatives:</h3>
          <ul>
            {plant.safe_alternatives.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </>
      )}

      {plant.sources && plant.sources.length > 0 && (
        <>
          <h3>Sources:</h3>
          <ul>
            {plant.sources.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </>
      )}

      {plant.ascpa_link && (
        <p>
          <a href={plant.ascpa_link} target="_blank" rel="noopener">
            View on ASPCA.org
          </a>
        </p>
      )}

      {plant.contentHtml && (
        <div dangerouslySetInnerHTML={{ __html: plant.contentHtml }} />
      )}

      <hr />
      <Link href="/">Check another plant</Link>

      <div style={{ marginTop: 20 }}>
        <h3>Comments</h3>
        {comments.length === 0 && <div style={{ color: '#777' }}>No approved comments yet</div>}
        {comments.map(c => (
          <div key={c.id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 10, marginTop: 8 }}>
            <div style={{ fontSize: 12, color: '#555' }}>{c.author || 'Anonymous'} • {new Date(c.created_at).toLocaleString()}</div>
            <div style={{ marginTop: 6 }}>{c.content}</div>
            {Array.isArray(c.replies) && c.replies.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <button type="button" onClick={() => setOpenReplies(prev => ({ ...prev, [c.id]: !prev[c.id] }))} style={{ padding: '4px 8px' }}>{openReplies[c.id] ? '收起回复' : `展开回复(${c.replies.length})`}</button>
                {openReplies[c.id] && (
                  <div style={{ marginTop: 8, display: 'grid', gap: 6 }}>
                    {[...c.replies].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).map(r => (
                      <div key={r.id} style={{ border: '1px dashed #e5e7eb', borderRadius: 8, padding: 8 }}>
                        <div style={{ fontSize: 12, color: '#555' }}>{r.author || 'Admin'} • {new Date(r.created_at).toLocaleString()}</div>
                        <div style={{ marginTop: 4 }}>{r.content}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <form onSubmit={onSubmit} style={{ marginTop: 12, display: 'grid', gap: 8, maxWidth: 520 }}>
          <input placeholder="Your nickname (optional)" value={userName} onChange={(e) => setUserName(e.target.value)} />
          <textarea placeholder="Write your comment..." value={userContent} onChange={(e) => setUserContent(e.target.value)} rows={3} />
          <button type="submit" disabled={submitting || !userContent.trim()}>{submitting ? 'Submitting...' : 'Submit comment (shown after review)'}</button>
        </form>
      </div>
    </div>
  );
}
