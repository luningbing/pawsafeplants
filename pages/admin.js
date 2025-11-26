import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Admin() {
  const [images, setImages] = useState([]);
  const [plants, setPlants] = useState([]);
  const [site, setSite] = useState({ heroImage: '' });
  const [heroSelection, setHeroSelection] = useState('');
  const [selPlant, setSelPlant] = useState({});
  const [selThumbPlant, setSelThumbPlant] = useState({});
  const [selThumbCat, setSelThumbCat] = useState({});
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const [stats, setStats] = useState([]);
  const maxCount = Math.max(1, ...stats.map((s) => Number(s.count || 0)));
  const [pendingComments, setPendingComments] = useState([]);
  const [credUser, setCredUser] = useState('');
  const [credPass, setCredPass] = useState('');
  const [credMsg, setCredMsg] = useState('');

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
    const noop = () => {};
    noop();
  }, []);

  const moderate = async (id, action) => {
    try {
      await fetch('/api/admin/comments/moderate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action }) });
      const r = await fetch('/api/admin/comments/pending');
      const j = await r.json();
      setPendingComments(j.comments || []);
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
      <h1>后台：图片管理</h1>
      <p><Link href="/">← 返回首页</Link></p>
      {msg && <div style={{ margin: '8px 0', color: '#2e7d32' }}>{msg}</div>}
      <form onSubmit={async (e) => { e.preventDefault(); await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/login'; }}>
        <button type="submit" style={{ marginTop: 8 }}>退出登录</button>
      </form>

      <section style={{ marginTop: 20 }}>
        <h2>首页大图（Hero）</h2>
        <p>当前：<code>{site?.heroImage || '未设置'}</code></p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select value={heroSelection} onChange={(e) => setHeroSelection(e.target.value)} style={{ minWidth: 360 }}>
            <option value="">选择图片路径...</option>
            {images.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <button type="button" onClick={() => updateHero(heroSelection)} disabled={!heroSelection}>确认应用到首页</button>
          <button type="button" onClick={applyAndPreviewHero} disabled={!heroSelection}>应用并预览首页</button>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <input type="file" accept="image/*" onChange={(e) => onUploadForHero(e.target.files?.[0])} />
            {uploading ? '上传中...' : '上传并应用到首页'}
          </label>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>植物图片（详情页封面）</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {plants.map((pl) => (
            <div key={pl.slug} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 }}>
              <div style={{ fontWeight: 600 }}>{pl.title || pl.slug}</div>
              <div style={{ fontSize: 12, color: '#555' }}>当前图片：<code>{pl.image || '未设置'}</code></div>
              <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
                <select value={selPlant[pl.slug] ?? (pl.image || '')} onChange={(e) => setSelPlant((prev) => ({ ...prev, [pl.slug]: e.target.value }))} style={{ minWidth: 320 }}>
                  <option value="">选择图片路径...</option>
                  {images.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <button type="button" onClick={() => updatePlantImage(pl.slug, selPlant[pl.slug] ?? (pl.image || ''))} disabled={!(selPlant[pl.slug] ?? (pl.image || ''))}>确认应用到该植物</button>
                <button type="button" onClick={() => applyAndPreviewPlant(pl.slug)} disabled={!(selPlant[pl.slug] ?? (pl.image || ''))}>应用并预览该植物</button>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <input type="file" accept="image/*" onChange={(e) => onUploadForPlant(pl.slug, e.target.files?.[0])} />
                  {uploading ? '上传中...' : '上传并应用到该植物'}
                </label>
              </div>
              <div style={{ marginTop: 12, borderTop: '1px dashed #e5e7eb', paddingTop: 10 }}>
                <div style={{ fontSize: 12, color: '#555', marginBottom: 6 }}>当前缩略图：<code>{pl.thumbPlant || '未设置'}</code> ／ 猫咪缩略图：<code>{pl.thumbCat || '未设置'}</code></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <select value={selThumbPlant[pl.slug] ?? (pl.thumbPlant || '')} onChange={(e) => setSelThumbPlant((prev) => ({ ...prev, [pl.slug]: e.target.value }))} style={{ minWidth: 280 }}>
                      <option value="">选择植物缩略图路径...</option>
                      {images.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => updatePlantThumbField(pl.slug, 'thumbPlant', selThumbPlant[pl.slug] ?? (pl.thumbPlant || ''))} disabled={!(selThumbPlant[pl.slug] ?? (pl.thumbPlant || ''))}>应用植物缩略图</button>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <input type="file" accept="image/*" onChange={(e) => onUploadForThumb(pl.slug, 'thumbPlant', e.target.files?.[0])} />
                      {uploading ? '上传中...' : '上传并应用'}
                    </label>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <select value={selThumbCat[pl.slug] ?? (pl.thumbCat || '')} onChange={(e) => setSelThumbCat((prev) => ({ ...prev, [pl.slug]: e.target.value }))} style={{ minWidth: 280 }}>
                      <option value="">选择猫咪缩略图路径...</option>
                      {images.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => updatePlantThumbField(pl.slug, 'thumbCat', selThumbCat[pl.slug] ?? (pl.thumbCat || ''))} disabled={!(selThumbCat[pl.slug] ?? (pl.thumbCat || ''))}>应用猫咪缩略图</button>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <input type="file" accept="image/*" onChange={(e) => onUploadForThumb(pl.slug, 'thumbCat', e.target.files?.[0])} />
                      {uploading ? '上传中...' : '上传并应用'}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>访问统计（30天）</h2>
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

      <section style={{ marginTop: 24 }}>
        <h2>评论审核（待处理）</h2>
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