"use strict";(()=>{var e={};e.id=3703,e.ids=[3703],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},7147:e=>{e.exports=require("fs")},1017:e=>{e.exports=require("path")},6560:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>d,patchFetch:()=>w,requestAsyncStorage:()=>c,routeModule:()=>p,serverHooks:()=>m,staticGenerationAsyncStorage:()=>u});var o={};r.r(o),r.d(o,{GET:()=>i});var a=r(9303),l=r(8716),s=r(670),n=r(8381);function i(){return new Response((0,n.x)(),{headers:{"Content-Type":"text/plain","Cache-Control":"public, max-age=86400, s-maxage=86400"}})}let p=new a.AppRouteRouteModule({definition:{kind:l.x.APP_ROUTE,page:"/robots.txt/route",pathname:"/robots.txt",filename:"route",bundlePath:"app/robots.txt/route"},resolvedPagePath:"E:\\paws\\pawsafeplants\\app\\robots.txt\\route.js",nextConfigOutput:"",userland:o}),{requestAsyncStorage:c,staticGenerationAsyncStorage:u,serverHooks:m}=p,d="/robots.txt/route";function w(){return(0,s.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:u})}},8381:(e,t,r)=>{r.d(t,{N:()=>n,x:()=>i});var o=r(7147),a=r.n(o),l=r(1017),s=r.n(l);async function n(){let e="https://www.pawsafeplants.com",t=new Date().toISOString(),r=[{url:e,lastmod:t,changefreq:"daily",priority:1},{url:`${e}/cat-safe-flowers`,lastmod:t,changefreq:"weekly",priority:.9},{url:`${e}/plants/safe`,lastmod:t,changefreq:"weekly",priority:.8},{url:`${e}/plants/toxic`,lastmod:t,changefreq:"weekly",priority:.8},{url:`${e}/plants/caution`,lastmod:t,changefreq:"weekly",priority:.8},{url:`${e}/about`,lastmod:t,changefreq:"monthly",priority:.5}],o=[];try{let t=s().join(process.cwd(),"content/plants");for(let r of a().readdirSync(t).filter(e=>e.endsWith(".md"))){let l=r.replace(".md",""),n=s().join(t,r),i=a().statSync(n);o.push({url:`${e}/plants/${l}`,lastmod:i.mtime.toISOString(),changefreq:"monthly",priority:.7})}}catch(e){console.error("Error reading plants directory:",e)}return`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...r,...o].map(e=>`
  <url>
    <loc>${e.url}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join("")}
</urlset>`}function i(){return`User-agent: *
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
Crawl-delay: 1`}}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[7176],()=>r(6560));module.exports=o})();