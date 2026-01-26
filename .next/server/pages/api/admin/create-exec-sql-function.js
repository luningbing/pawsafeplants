"use strict";(()=>{var e={};e.id=3126,e.ids=[3126],e.modules={2885:e=>{e.exports=require("@supabase/supabase-js")},9344:e=>{e.exports=require("jsonwebtoken")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},669:(e,t,r)=>{r.r(t),r.d(t,{config:()=>l,default:()=>c,routeModule:()=>d});var s={};r.r(s),r.d(s,{default:()=>u});var n=r(1802),o=r(7153),i=r(6249),a=r(2885);async function u(e,t){try{if(t.setHeader("Access-Control-Allow-Origin","*"),t.setHeader("Access-Control-Allow-Methods","GET, POST, OPTIONS"),t.setHeader("Access-Control-Allow-Headers","Content-Type, Authorization"),"OPTIONS"===e.method)return t.status(200).end();if("POST"!==e.method)return t.status(405).json({error:"Method not allowed"});let s=e.headers.authorization;if(!s||!s.startsWith("Bearer "))return t.status(401).json({error:"Unauthorized"});let n=s.substring(7);try{if(!r(9344).verify(n,process.env.JWT_SECRET||"your-secret-key-change-in-production").username)return t.status(401).json({error:"Invalid token"})}catch(e){return t.status(401).json({error:"Invalid token"})}let o=(0,a.createClient)("https://rczfbgzghwiqpxihlexs.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY||"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjemZiZ3pnaHdpcXB4aWhsZXhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk5NDUwMSwiZXhwIjoyMDc5NTcwNTAxfQ.uF3IofVn0ZkFSM6aSYsWCmOWHl26ybxv_bwMST3Zsio",{auth:{autoRefreshToken:!1,persistSession:!1}});console.log("\uD83D\uDD04 创建exec_sql函数...");let i=`
      CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
      RETURNS TABLE(result text)
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        -- 执行动态SQL并返回结果
        RETURN QUERY EXECUTE sql;
      END;
      $$;
    `;try{let{data:e,error:r}=await o.from("blog_posts").select("*").limit(1);return console.log("\uD83D\uDCCA 测试数据库连接:",{data:e,error:r}),t.status(200).json({success:!0,message:"exec_sql function creation SQL generated",sql:i,instructions:`
请在Supabase SQL Editor中执行以下SQL来创建exec_sql函数：

${i}

执行完成后，数据库设置功能将正常工作。
        `})}catch(e){return console.error("\uD83D\uDCA5 创建函数失败:",e),t.status(500).json({error:"Function creation failed",details:e.message})}}catch(e){return console.error("\uD83D\uDEA8 Create exec_sql function API error:",e),t.status(500).json({error:"Internal server error",details:e.message})}}let c=(0,i.l)(s,"default"),l=(0,i.l)(s,"config"),d=new n.PagesAPIRouteModule({definition:{kind:o.x.PAGES_API,page:"/api/admin/create-exec-sql-function",pathname:"/api/admin/create-exec-sql-function",bundlePath:"",filename:""},userland:s})},7153:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},1802:(e,t,r)=>{e.exports=r(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var r=t(t.s=669);module.exports=r})();