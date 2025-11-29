import { useEffect, useState } from 'react';
import Link from 'next/link';

function ImageDropdown({ images, value, onChange, placeholder = '选择图片路径...', width = 360 }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState('');
  const sel = String(value || '');
  const show = String(hover || sel || '');
  return (
    <div style={{ position: 'relative', minWidth: width }}>
      <button type="button" onClick={() => setOpen(!open)} style={{ width: '100%', textAlign: 'left', padding: '6px 8px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff' }}>{sel || placeholder}</button>
      {open && (
        <div style={{ position: 'absolute', zIndex: 100, top: '100%', left: 0, display: 'grid', gridTemplateColumns: '1fr 110px', gap: 8, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, marginTop: 6, padding: 8, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ maxHeight: 220, overflow: 'auto', display: 'grid', gap: 6 }}>
            {images.map((p) => (
              <button key={p} type="button" onMouseEnter={() => setHover(p)} onFocus={() => setHover(p)} onClick={() => { onChange(p); setOpen(false); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 8px', border: '1px solid #f3f4f6', background: sel === p ? '#eef' : '#fff', borderRadius: 6 }}>{p}</button>
            ))}
          </div>
          <div style={{ width: 110 }}>
            {show && <img src={show} alt="预览" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb' }} />}
          </div>
        </div>
      )}
    </div>
  );
}
export default function Admin() {
  const [images, setImages] = useState([]);
  const [plants, setPlants] = useState([]);
  const [site, setSite] = useState({ heroImage: '', logo: '' });
  const [heroSelection, setHeroSelection] = useState('');
  const [logoSelection, setLogoSelection] = useState('');
  const [selPlant, setSelPlant] = useState({});
  const [selPlant2, setSelPlant2] = useState({});
  const [selPlant3, setSelPlant3] = useState({});
  const [selThumbPlant, setSelThumbPlant] = useState({});
  const [selThumbCat, setSelThumbCat] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [msg, setMsg] = useState('');
  const [stats, setStats] = useState([]);
  const maxCount = Math.max(1, ...stats.map((s) => Number(s.count || 0)));
  const [pendingComments, setPendingComments] = useState([]);
  const [credUser, setCredUser] = useState('');
  const [credPass, setCredPass] = useState('');
  const [credMsg, setCredMsg] = useState('');
  const [activeTab, setActiveTab] = useState('images');
  const [approvedComments, setApprovedComments] = useState([]);
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const [imgRes, siteRes, plantRes] = await Promise.all([
          fetch('/api/list-images'),
          fetch('/api/site-config'),
          fetch('/api/plants')
        ]);
        const imgs = await imgRes.json();
        const s = await siteRes.json();
        const p = await plantRes.json();
        setImages(imgs.paths || []);
        setSite(s || { heroImage: '' });
        setHeroSelection((s || {}).heroImage || '');
        setLogoSelection((s || {}).logo || '');
        setPlants(p.plants || []);
      } catch {}
    };
    load();
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const r = await fetch('/api/analytics/stats?days=30');
        const j = await r.json();
        setStats(j.stats || []);
      } catch {}
    };
    loadStats();
  }, []);

  useEffect(() => {
    const loadPending = async () => {
      try {
        const r = await fetch('/api/admin/comments/pending');
        const j = await r.json();
        setPendingComments(j.comments || []);
      } catch {}
    };
    loadPending();
  }, []);

  useEffect(() => {
    const loadApproved = async () => {
      try {
        const r = await fetch('/api/comments/list');
        const j = await r.json();
        setApprovedComments(j.comments || []);
      } catch {}
    };
    loadApproved();
  }, []);

  useEffect(() => {
    const noop = () => {};
    noop();
  }, []);

  const moderate = async (id, action) => {
    try {
      await fetch('/api/admin/comments/moderate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action }) });
      const r = await fetch('/api/admin/comments/pending');
      const j = await r.json();
      setPendingComments(j.comments || []);
      const r2 = await fetch('/api/comments/list');
      const j2 = await r2.json();
      setApprovedComments(j2.comments || []);
    } catch {}
  };

  const submitReply = async (id) => {
    const content = String((replyText || {})[id] || '').trim();
    if (!content) return;
    try {
      const r = await fetch('/api/admin/comments/reply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, content }) });
      if (r.ok) {
        setReplyText((prev) => ({ ...prev, [id]: '' }));
        const r2 = await fetch('/api/comments/list');
        const j2 = await r2.json();
        setApprovedComments(j2.comments || []);
      }
    } catch {}
  };

  const onUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result;
        const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const res = await fetch('/api/upload-base64', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename, data: String(base64 || '') })
        });
        if (res.ok) {
          const j = await res.json();
          const imgs = await (await fetch('/api/list-images')).json();
          setImages(imgs.paths || []);
          setSite((s) => ({ ...s }));
          return j?.path || '';
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
    }
  };

  const confirmUpload = async () => {
    if (!uploadFile) return;
    const p = await onUpload(uploadFile);
    setUploading(false);
    if (p) setMsg('已上传到素材库');
    setUploadFile(null);
  };

  const onUploadForHero = async (file) => {
    const p = await onUpload(file);
    setUploading(false);
    if (p) await updateHero(p);
  };

  const onUploadForPlant = async (slug, file) => {
    const p = await onUpload(file);
    setUploading(false);
    if (p) await updatePlantImage(slug, p);
  };

  const onUploadForThumb = async (slug, field, file) => {
    const p = await onUpload(file);
    setUploading(false);
    if (p) await updatePlantThumbField(slug, field, p);
  };

  const updateHero = async (path) => {
    if (!path) return;
    await fetch('/api/site-config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ heroImage: path }) });
    const s = await (await fetch('/api/site-config')).json();
    setSite(s);
    setHeroSelection(s.heroImage || '');
    setMsg('已应用到首页大图');
  };

  const updateLogo = async (path) => {
    if (!path) return;
    await fetch('/api/site-config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ logo: path }) });
    const s = await (await fetch('/api/site-config')).json();
    setSite(s);
    setLogoSelection(s.logo || '');
    setMsg('站点 Logo 已更新');
  };

  const applyAndPreviewHero = async () => {
    const p = heroSelection;
    await updateHero(p);
    if (p) window.open('/', '_blank');
  };

  const updatePlantImage = async (slug, imagePath) => {
    await fetch('/api/update-plant-image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, imagePath }) });
    const p = await (await fetch('/api/plants')).json();
    setPlants(p.plants || []);
    setSelPlant((prev) => ({ ...prev, [slug]: imagePath }));
    setMsg('已应用到该植物封面图');
  };

  const updatePlantImage2 = async (slug, imagePath) => {
    await fetch('/api/update-plant-image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, image2: imagePath }) });
    const p = await (await fetch('/api/plants')).json();
    setPlants(p.plants || []);
    setSelPlant2((prev) => ({ ...prev, [slug]: imagePath }));
    setMsg('已应用到该植物附图 1');
  };

  const updatePlantImage3 = async (slug, imagePath) => {
    await fetch('/api/update-plant-image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, image3: imagePath }) });
    const p = await (await fetch('/api/plants')).json();
    setPlants(p.plants || []);
    setSelPlant3((prev) => ({ ...prev, [slug]: imagePath }));
    setMsg('已应用到该植物附图 2');
  };

  const updatePlantThumbField = async (slug, field, value) => {
    const body = { slug };
    if (field === 'thumbPlant') body.thumbPlant = value;
    if (field === 'thumbCat') body.thumbCat = value;
    await fetch('/api/update-plant-image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const p = await (await fetch('/api/plants')).json();
    setPlants(p.plants || []);
    if (field === 'thumbPlant') setSelThumbPlant((prev) => ({ ...prev, [slug]: value }));
    if (field === 'thumbCat') setSelThumbCat((prev) => ({ ...prev, [slug]: value }));
    setMsg(field === 'thumbCat' ? '已应用到该植物猫咪缩略图' : '已应用到该植物缩略图');
  };

  const applyAndPreviewPlant = async (slug) => {
    const imagePath = selPlant[slug];
    await updatePlantImage(slug, imagePath);
    if (slug) window.open(`/plants/${slug}`, '_blank');
  };

  const updateCred = async () => {
    setCredMsg('');
    try {
      const u = String(credUser || '').trim();
      const p = String(credPass || '').trim();
      if (u.length < 2) { setCredMsg('用户名至少 2 个字符'); return; }
      if (p.length < 6) { setCredMsg('密码至少 6 个字符'); return; }
      const r = await fetch('/api/admin/credentials/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: u, password: p }) });
      if (r.ok) {
        setCredPass('');
        setCredMsg('后台账号已更新，请退出并用新账号登录');
      } else {
        const j = await r.json().catch(() => ({}));
        setCredMsg(String(j.error || '更新失败'));
      }
    } catch {
      setCredMsg('更新失败');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>后台</h1>
      <p><Link href="/">← 返回首页</Link></p>
      {msg && <div style={{ margin: '8px 0', color: '#2e7d32' }}>{msg}</div>}
      <form onSubmit={async (e) => { e.preventDefault(); await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login'; }}>
        <button type="submit" style={{ marginTop: 8 }}>退出登录</button>
      </form>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button type="button" onClick={() => setActiveTab('images')} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: activeTab==='images' ? '#eef' : '#fff' }}>图片管理</button>
        <button type="button" onClick={() => setActiveTab('stats')} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: activeTab==='stats' ? '#eef' : '#fff' }}>数据统计</button>
        <button type="button" onClick={() => setActiveTab('comments')} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: activeTab==='comments' ? '#eef' : '#fff' }}>评论管理</button>
        <button type="button" onClick={() => setActiveTab('tables')} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: activeTab==='tables' ? '#eef' : '#fff' }}>数据表</button>
      </div>

      {activeTab === 'images' && (
      <>
      <section style={{ marginTop: 20 }}>
        <h2>上传文件</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="file" accept="image/*" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
          <button type="button" onClick={confirmUpload} disabled={!uploadFile || uploading}>{uploading ? '上传中...' : '确认上传'}</button>
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: '#555' }}>上传后会出现在下方下拉列表中，选择对应图位并点击应用。</div>
      </section>

      <section style={{ marginTop: 20 }}>
        <h2>首页大图（Hero）</h2>
        <p>当前：<code>{site?.heroImage || '未设置'}</code></p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <ImageDropdown images={images} value={heroSelection || site.heroImage || ''} onChange={(p) => setHeroSelection(p)} placeholder="选择图片路径..." width={420} />
          <button type="button" onClick={() => updateHero(heroSelection || site.heroImage || '')} disabled={!(heroSelection || site.heroImage)} style={{ padding: '6px 10px' }}>应用</button>
          <button type="button" onClick={applyAndPreviewHero} disabled={!heroSelection} style={{ padding: '6px 10px' }}>应用并预览</button>
          <div style={{ width: 110 }}>
            {(heroSelection || site.heroImage) && (
              <img src={heroSelection || site.heroImage} alt="预览" style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb' }} />
            )}
          </div>
        </div>
      </section>

      <section style={{ marginTop: 12 }}>
        <h2>站点 Logo</h2>
        <p>当前：<code>{site?.logo || '未设置'}</code></p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <ImageDropdown images={images} value={logoSelection || site.logo || ''} onChange={(p) => setLogoSelection(p)} placeholder="选择图片路径..." width={420} />
          <button type="button" onClick={() => updateLogo(logoSelection || site.logo || '')} disabled={!(logoSelection || site.logo)} style={{ padding: '6px 10px' }}>应用</button>
          <div style={{ width: 110 }}>
            {(logoSelection || site.logo) && (
              <img src={logoSelection || site.logo} alt="预览" style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb' }} />
            )}
          </div>
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: '#555' }}>建议使用透明背景的 PNG/SVG，系统会自动适配页面底色显示。</div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>植物图片（详情页封面）</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {plants.map((pl) => (
            <div key={pl.slug} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 }}>
              <div style={{ fontWeight: 600 }}>{pl.title || pl.slug}</div>
              <div style={{ fontSize: 12, color: '#555' }}>当前图片：<code>{pl.image || '未设置'}</code></div>
              <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>附图1：<code>{pl.image2 || '未设置'}</code> ／ 附图2：<code>{pl.image3 || '未设置'}</code></div>
              <div style={{ marginTop: 6 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <ImageDropdown images={images} value={selPlant[pl.slug] ?? (pl.image || '')} onChange={(p) => setSelPlant((prev) => ({ ...prev, [pl.slug]: p }))} placeholder="选择图片路径..." width={420} />
                  <button type="button" onClick={() => updatePlantImage(pl.slug, selPlant[pl.slug] ?? (pl.image || ''))} disabled={!((selPlant[pl.slug] ?? (pl.image || '')))} style={{ padding: '6px 10px' }}>应用</button>
                  <div style={{ width: 110 }}>
                    {(selPlant[pl.slug] ?? (pl.image || '')) && (
                      <img src={selPlant[pl.slug] ?? (pl.image || '')} alt="预览" style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb' }} />
                    )}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <ImageDropdown images={images} value={selPlant2[pl.slug] ?? (pl.image2 || '')} onChange={(p) => setSelPlant2((prev) => ({ ...prev, [pl.slug]: p }))} placeholder="选择图片路径..." width={420} />
                  <button type="button" onClick={() => updatePlantImage2(pl.slug, selPlant2[pl.slug] ?? (pl.image2 || ''))} disabled={!((selPlant2[pl.slug] ?? (pl.image2 || '')))} style={{ padding: '6px 10px' }}>应用</button>
                  <div style={{ width: 110 }}>
                    {(selPlant2[pl.slug] ?? (pl.image2 || '')) && (
                      <img src={selPlant2[pl.slug] ?? (pl.image2 || '')} alt="预览" style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb' }} />
                    )}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <ImageDropdown images={images} value={selPlant3[pl.slug] ?? (pl.image3 || '')} onChange={(p) => setSelPlant3((prev) => ({ ...prev, [pl.slug]: p }))} placeholder="选择图片路径..." width={420} />
                  <button type="button" onClick={() => updatePlantImage3(pl.slug, selPlant3[pl.slug] ?? (pl.image3 || ''))} disabled={!((selPlant3[pl.slug] ?? (pl.image3 || '')))} style={{ padding: '6px 10px' }}>应用</button>
                  <div style={{ width: 110 }}>
                    {(selPlant3[pl.slug] ?? (pl.image3 || '')) && (
                      <img src={selPlant3[pl.slug] ?? (pl.image3 || '')} alt="预览" style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb' }} />
                    )}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 12, borderTop: '1px dashed #e5e7eb', paddingTop: 10 }}>
                <div style={{ fontSize: 12, color: '#555', marginBottom: 6 }}>当前缩略图：<code>{pl.thumbPlant || '未设置'}</code> ／ 猫咪缩略图：<code>{pl.thumbCat || '未设置'}</code></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <ImageDropdown images={images} value={selThumbPlant[pl.slug] ?? (pl.thumbPlant || '')} onChange={(p) => setSelThumbPlant((prev) => ({ ...prev, [pl.slug]: p }))} placeholder="选择图片路径..." width={420} />
                    <button type="button" onClick={() => updatePlantThumbField(pl.slug, 'thumbPlant', selThumbPlant[pl.slug] ?? (pl.thumbPlant || ''))} disabled={!((selThumbPlant[pl.slug] ?? (pl.thumbPlant || '')))} style={{ padding: '6px 10px' }}>应用</button>
                    <div style={{ width: 110 }}>
                      {(selThumbPlant[pl.slug] ?? (pl.thumbPlant || '')) && (
                        <img src={selThumbPlant[pl.slug] ?? (pl.thumbPlant || '')} alt="预览" style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb' }} />
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <ImageDropdown images={images} value={selThumbCat[pl.slug] ?? (pl.thumbCat || '')} onChange={(p) => setSelThumbCat((prev) => ({ ...prev, [pl.slug]: p }))} placeholder="选择图片路径..." width={420} />
                    <button type="button" onClick={() => updatePlantThumbField(pl.slug, 'thumbCat', selThumbCat[pl.slug] ?? (pl.thumbCat || ''))} disabled={!((selThumbCat[pl.slug] ?? (pl.thumbCat || '')))} style={{ padding: '6px 10px' }}>应用</button>
                    <div style={{ width: 110 }}>
                      {(selThumbCat[pl.slug] ?? (pl.thumbCat || '')) && (
                        <img src={selThumbCat[pl.slug] ?? (pl.thumbCat || '')} alt="预览" style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb' }} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      </>
      )}
      {activeTab === 'stats' && (
      <section style={{ marginTop: 24 }}>
        <h2>数据统计（30天）</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>每日访问次数</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 6 }}>
              {stats.map(s => (
                <div key={s.date} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 54px', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#555' }}>{s.date}</span>
                  <div style={{ background: '#f3f4f6', borderRadius: 999, overflow: 'hidden', height: 10 }}>
                    <div style={{ width: `${Math.max(2, Math.round((Number(s.count || 0) / maxCount) * 100))}%`, height: '100%', background: 'linear-gradient(90deg, #A8E6CF, #FFD3B6, #DCBFFF)' }}></div>
                  </div>
                  <span style={{ fontWeight: 600, textAlign: 'right' }}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}
      {activeTab === 'comments' && (
      <section style={{ marginTop: 24 }}>
        <h2>评论管理</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>待审核</div>
            <div style={{ display: 'grid', gap: 10 }}>
              {pendingComments.length === 0 && <div style={{ color: '#777' }}>暂无待审核评论</div>}
              {pendingComments.map((c) => (
                <div key={c.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 }}>
                  <div style={{ fontSize: 12, color: '#555' }}>{c.slug} • {c.author || 'Anonymous'} • {new Date(c.created_at).toLocaleString()}</div>
                  <div style={{ marginTop: 6 }}>{c.content}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button type="button" onClick={() => moderate(c.id, 'approve')}>通过</button>
                    <button type="button" onClick={() => moderate(c.id, 'delete')}>删除</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>已审核</div>
            <div style={{ display: 'grid', gap: 10 }}>
              {approvedComments.length === 0 && <div style={{ color: '#777' }}>暂无已审核评论</div>}
              {approvedComments.map((c) => (
                <div key={c.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 }}>
                  <div style={{ fontSize: 12, color: '#555' }}>{c.slug} • {c.author || 'Anonymous'} • {new Date(c.created_at).toLocaleString()}</div>
                  <div style={{ marginTop: 6 }}>{c.content}</div>
                  {Array.isArray(c.replies) && c.replies.length > 0 && (
                    <div style={{ marginTop: 8, display: 'grid', gap: 6 }}>
                      {c.replies.map((r) => (
                        <div key={r.id} style={{ border: '1px dashed #e5e7eb', borderRadius: 8, padding: 8 }}>
                          <div style={{ fontSize: 12, color: '#555' }}>{r.author || 'Admin'} • {new Date(r.created_at).toLocaleString()}</div>
                          <div style={{ marginTop: 4 }}>{r.content}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'grid', gap: 6, marginTop: 8 }}>
                    <textarea rows={2} placeholder="回复内容..." value={String((replyText || {})[c.id] || '')} onChange={(e) => setReplyText((prev) => ({ ...prev, [c.id]: e.target.value }))} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="button" onClick={() => submitReply(c.id)} disabled={!String((replyText || {})[c.id] || '').trim()}>回复</button>
                      <button type="button" onClick={() => moderate(c.id, 'delete')}>删除</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}
      {activeTab === 'tables' && (
      <>
      <section style={{ marginTop: 24 }}>
        <h2>数据表</h2>
        <div style={{ color: '#555', marginBottom: 8 }}>用户管理（待开发）</div>
        <div style={{ color: '#555' }}>更多数据类管理项可在此扩展。</div>
      </section>
      <section style={{ marginTop: 24 }}>
        <h2>后台账号设置</h2>
        <div style={{ display: 'grid', gap: 10, maxWidth: 420 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>用户名</span>
            <input value={credUser} onChange={(e) => setCredUser(e.target.value)} placeholder="" autoComplete="off" inputMode="text" spellCheck={false} autoCapitalize="none" onKeyDown={(e) => { if (e.key === 'Enter') updateCred(); }} />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>新密码</span>
            <input type="password" value={credPass} onChange={(e) => setCredPass(e.target.value)} placeholder="" autoComplete="new-password" spellCheck={false} onKeyDown={(e) => { if (e.key === 'Enter') updateCred(); }} />
          </label>
          <button type="button" onClick={updateCred} disabled={!credUser || !credPass}>更新后台账号</button>
          <div style={{ color: '#666' }}>更新后请退出并用新账号登录。</div>
          {credMsg && <div style={{ color: credMsg.includes('已更新') ? '#2e7d32' : '#c62828' }}>{credMsg}</div>}
        </div>
      </section>
      </>
      )}
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const cookie = req.headers.cookie || '';
  const authed = cookie.includes('psp_admin=1');
  if (!authed) {
    return { redirect: { destination: '/login', permanent: false } };
  }
  return { props: {} };
}
