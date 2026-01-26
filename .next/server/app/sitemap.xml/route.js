"use strict";(()=>{var e={};e.id=6717,e.ids=[6717],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},7147:e=>{e.exports=require("fs")},1017:e=>{e.exports=require("path")},9529:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>d,patchFetch:()=>w,requestAsyncStorage:()=>m,routeModule:()=>p,serverHooks:()=>u,staticGenerationAsyncStorage:()=>c});var a={};r.r(a),r.d(a,{GET:()=>n});var o=r(9303),l=r(8716),s=r(670),i=r(8381);async function n(){return new Response(await (0,i.N)(),{headers:{"Content-Type":"application/xml","Cache-Control":"public, max-age=3600, s-maxage=3600"}})}let p=new o.AppRouteRouteModule({definition:{kind:l.x.APP_ROUTE,page:"/sitemap.xml/route",pathname:"/sitemap.xml",filename:"route",bundlePath:"app/sitemap.xml/route"},resolvedPagePath:"E:\\paws\\pawsafeplants\\app\\sitemap.xml\\route.js",nextConfigOutput:"",userland:a}),{requestAsyncStorage:m,staticGenerationAsyncStorage:c,serverHooks:u}=p,d="/sitemap.xml/route";function w(){return(0,s.patchFetch)({serverHooks:u,staticGenerationAsyncStorage:c})}},8381:(e,t,r)=>{r.d(t,{N:()=>i,x:()=>n});var a=r(7147),o=r.n(a),l=r(1017),s=r.n(l);async function i(){let e="https://www.pawsafeplants.com",t=new Date().toISOString(),r=[{url:e,lastmod:t,changefreq:"daily",priority:1},{url:`${e}/cat-safe-flowers`,lastmod:t,changefreq:"weekly",priority:.9},{url:`${e}/plants/safe`,lastmod:t,changefreq:"weekly",priority:.8},{url:`${e}/plants/toxic`,lastmod:t,changefreq:"weekly",priority:.8},{url:`${e}/plants/caution`,lastmod:t,changefreq:"weekly",priority:.8},{url:`${e}/about`,lastmod:t,changefreq:"monthly",priority:.5}],a=[];try{let t=s().join(process.cwd(),"content/plants");for(let r of o().readdirSync(t).filter(e=>e.endsWith(".md"))){let l=r.replace(".md",""),i=s().join(t,r),n=o().statSync(i);a.push({url:`${e}/plants/${l}`,lastmod:n.mtime.toISOString(),changefreq:"monthly",priority:.7})}}catch(e){console.error("Error reading plants directory:",e)}return`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...r,...a].map(e=>`
  <url>
    <loc>${e.url}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join("")}
</urlset>`}function n(){return`User-agent: *
Allow: /

# Sitemap
Sitemap: https://www.pawsafeplants.com/sitemap.xml

# Block common bot paths
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /static/
Disallow: /*.json$

# Allow important content
Allow: /plants/
Allow: /api/atmosphere-images
Allow: /api/hero-carousel-db
Allow: /api/site-config

# Crawl delay (optional, be respectful)
Crawl-delay: 1`}}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[7176],()=>r(9529));module.exports=a})();