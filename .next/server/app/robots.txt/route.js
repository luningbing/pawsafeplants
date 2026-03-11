"use strict";(()=>{var e={};e.id=3703,e.ids=[3703],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},7147:e=>{e.exports=require("fs")},1017:e=>{e.exports=require("path")},6560:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>m,patchFetch:()=>w,requestAsyncStorage:()=>c,routeModule:()=>p,serverHooks:()=>d,staticGenerationAsyncStorage:()=>u});var o={};r.r(o),r.d(o,{GET:()=>i});var a=r(9303),s=r(8716),n=r(670),l=r(8381);function i(){return new Response((0,l.x)(),{headers:{"Content-Type":"text/plain","Cache-Control":"public, max-age=86400, s-maxage=86400"}})}let p=new a.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/robots.txt/route",pathname:"/robots.txt",filename:"route",bundlePath:"app/robots.txt/route"},resolvedPagePath:"E:\\paws\\pawsafeplants\\app\\robots.txt\\route.js",nextConfigOutput:"",userland:o}),{requestAsyncStorage:c,staticGenerationAsyncStorage:u,serverHooks:d}=p,m="/robots.txt/route";function w(){return(0,n.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:u})}},8381:(e,t,r)=>{r.d(t,{N:()=>l,x:()=>i});var o=r(7147),a=r.n(o),s=r(1017),n=r.n(s);async function l(){let e="https://www.pawsafeplants.com",t=new Date().toISOString(),r=[{url:e,lastmod:t,changefreq:"daily",priority:1},{url:`${e}/safe-plants`,lastmod:t,changefreq:"weekly",priority:.9},{url:`${e}/toxic-plants`,lastmod:t,changefreq:"weekly",priority:.9},{url:`${e}/caution-plants`,lastmod:t,changefreq:"weekly",priority:.9}],o=[];try{let t=n().join(process.cwd(),"content/plants");for(let r of a().readdirSync(t).filter(e=>e.endsWith(".md"))){let s=r.replace(".md",""),l=n().join(t,r),i=a().statSync(l);o.push({url:`${e}/plants/${s}`,lastmod:i.mtime.toISOString(),changefreq:"monthly",priority:.7})}}catch(e){console.error("Error reading plants directory:",e)}return`<?xml version="1.0" encoding="UTF-8"?>
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