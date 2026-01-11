"use strict";(()=>{var e={};e.id=6008,e.ids=[6008],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},7147:e=>{e.exports=require("fs")},1017:e=>{e.exports=require("path")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},7771:(e,t,r)=>{r.r(t),r.d(t,{config:()=>$,default:()=>c,routeModule:()=>f});var n={};r.r(n),r.d(n,{default:()=>d});var s=r(1802),i=r(7153),a=r(6249),o=r(7147),u=r.n(o),l=r(1017),p=r.n(l);async function d(e,t){if("POST"!==e.method)return t.status(405).json({error:"Method Not Allowed"});let{title:r,scientific_name:n,toxicity_level:s,care_difficulty:i,summary:a,image:o,slug:l,symptoms:d,what_to_do:c,aspca_link:$,care_tips:f,water_needs:h,light_needs:m,temperature:P}=e.body;if(!r||!s||!i||!a||!l)return t.status(400).json({error:"Missing required fields (title, toxicity_level, care_difficulty, summary, slug)"});let g=l.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-*|-*$/g,"");if(!g)return t.status(400).json({error:"Invalid plant name for slug generation."});let y=[];y.push(`title: "${r}"`),n&&y.push(`scientific_name: "${n}"`),y.push(`toxicity_level: "${s}"`),y.push(`care_difficulty: "${i}"`),y.push(`summary: "${a}"`),o&&y.push(`image: "${o}"`),d&&d.length>0&&(y.push("symptoms:"),d.forEach(e=>{y.push(`  - "${e}"`)})),c&&y.push(`what_to_do: "${c}"`),$&&y.push(`aspca_link: "${$}"`),f&&y.push(`care_tips: "${f}"`),h&&y.push(`water_needs: "${h}"`),m&&y.push(`light_needs: "${m}"`),P&&y.push(`temperature: "${P}"`);let A=`---
${y.join("\n")}
---

${a}

${n?`
**Scientific Name:** ${n}`:""}

## Toxicity Level
${s}

${d&&d.length>0?`
## Symptoms
${d.map(e=>`- ${e}`).join("\n")}
`:""}

${c?`
## What to Do
${c}
`:""}

${i?`
## Care Difficulty
${i}
`:""}

${h?`
## Water Needs
${h}
`:""}

${m?`
## Light Needs
${m}
`:""}

${P?`
## Temperature
${P}
`:""}

${f?`
## Care Tips
${f}
`:""}

${$?`
## Additional Resources
[ASPCA Plant Guide](${$})
`:""}
`,_=p().join(process.cwd(),"content/plants",`${g}.md`);try{u().writeFileSync(_,A),t.status(200).json({message:"Plant saved successfully!",slug:g,filePath:`/content/plants/${g}.md`})}catch(e){console.error("Failed to write plant Markdown file:",e),t.status(500).json({error:"Failed to save plant data."})}}let c=(0,a.l)(n,"default"),$=(0,a.l)(n,"config"),f=new s.PagesAPIRouteModule({definition:{kind:i.x.PAGES_API,page:"/api/save-plant",pathname:"/api/save-plant",bundlePath:"",filename:""},userland:n})},7153:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},1802:(e,t,r)=>{e.exports=r(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var r=t(t.s=7771);module.exports=r})();