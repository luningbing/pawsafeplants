"use strict";(()=>{var e={};e.id=7318,e.ids=[7318],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},5900:e=>{e.exports=require("pg")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,n){return n in t?t[n]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,n)):"function"==typeof t&&"default"===n?t:void 0}}})},7355:(e,t,n)=>{n.r(t),n.d(t,{config:()=>p,default:()=>u,routeModule:()=>c});var s={};n.r(s),n.d(s,{default:()=>l});var o=n(1802),r=n(7153),a=n(6249),i=n(5900);async function l(e,t){if("GET"===e.method){if(!(e.cookies&&"1"===e.cookies.psp_admin||(e.headers.cookie||"").includes("psp_admin=1")))return t.status(401).json({error:"unauthorized"});let n=((process.env.SUPABASE_URL||"").match(/https?:\/\/([^.]+)\.supabase\.co/)||[])[1]||"",s=n?`db.${n}.supabase.co`:"",o={SUPABASE_DB_URL:!!process.env.SUPABASE_DB_URL,DATABASE_URL:!!process.env.DATABASE_URL,POSTGRES_URL:!!process.env.POSTGRES_URL,POSTGRES_PRISMA_URL:!!process.env.POSTGRES_PRISMA_URL,SUPABASE_URL:!!process.env.SUPABASE_URL},r=[process.env.SUPABASE_DB_URL,process.env.SUPABASE_POOLER_URL,process.env.PGBOUNCER_URL,process.env.DATABASE_URL,process.env.POSTGRES_URL,process.env.POSTGRES_PRISMA_URL].filter(Boolean),a=r[0]?r[0].split("@")[1]||r[0]:"";return t.status(200).json({ok:!0,has:o,example:s?`postgresql://postgres:<YOUR_PASSWORD>@${s}:5432/postgres`:void 0,chosen:a})}if("POST"!==e.method)return t.status(405).json({error:"Method not allowed"});if(!(e.cookies&&"1"===e.cookies.psp_admin||(e.headers.cookie||"").includes("psp_admin=1")))return t.status(401).json({error:"unauthorized"});try{let e=[process.env.SUPABASE_DB_URL,process.env.DATABASE_URL,process.env.POSTGRES_URL,process.env.POSTGRES_PRISMA_URL].filter(Boolean)[0]||"";if(!e){let e=((process.env.SUPABASE_URL||"").match(/https?:\/\/([^.]+)\.supabase\.co/)||[])[1]||"",n=e?`db.${e}.supabase.co`:"";return t.status(500).json({error:"SUPABASE_DB_URL missing",help:"在 Vercel 设置 SUPABASE_DB_URL=postgresql://postgres:<YOUR_PASSWORD>@<HOST>:5432/postgres",example:n?`postgresql://postgres:<YOUR_PASSWORD>@${n}:5432/postgres`:void 0})}let n=new i.Client({connectionString:e,ssl:{rejectUnauthorized:!1}});await n.connect();let s=`
      create table if not exists public.admin_credentials (
        username text primary key,
        hash text not null,
        salt text not null,
        iterations integer not null default 120000,
        algo text not null default 'pbkdf2-sha256',
        updated_at timestamptz
      );
      create table if not exists public.comments (
        id bigserial primary key,
        slug text not null,
        author text,
        content text not null,
        status text not null default 'pending',
        created_at timestamptz not null default now()
      );
      create table if not exists public.comment_replies (
        id bigserial primary key,
        comment_id bigint not null references public.comments(id) on delete cascade,
        author text,
        content text not null,
        created_at timestamptz not null default now()
      );
      create table if not exists public.analytics (
        path text not null,
        date date not null,
        created_at timestamptz not null default now()
      );
      create table if not exists public.site_config (
        key text primary key,
        value jsonb
      );
      create table if not exists public.plant_images (
        slug text primary key,
        image text,
        image2 text,
        image3 text,
        thumbPlant text,
        thumbCat text,
        updated_at timestamptz not null default now()
      );
    `;return await n.query(s),await n.end(),t.status(200).json({ok:!0})}catch(n){let e=String(n?.message||n);if(e.includes("ENOTFOUND"))return t.status(500).json({error:e,help:"无法解析数据库主机名。请在 Supabase Studio 复制官方 Connection string，或尝试 Connection pooling (端口 6543)。",hint_envs:["SUPABASE_DB_URL","SUPABASE_POOLER_URL","PGBOUNCER_URL","DATABASE_URL","POSTGRES_URL","POSTGRES_PRISMA_URL"]});return t.status(500).json({error:e})}}let u=(0,a.l)(s,"default"),p=(0,a.l)(s,"config"),c=new o.PagesAPIRouteModule({definition:{kind:r.x.PAGES_API,page:"/api/admin/bootstrap-db",pathname:"/api/admin/bootstrap-db",bundlePath:"",filename:""},userland:s})},7153:(e,t)=>{var n;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return n}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(n||(n={}))},1802:(e,t,n)=>{e.exports=n(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var n=t(t.s=7355);module.exports=n})();