# 产品需求文档（PRD）

## 当前进度
- 已实现：PRD 预览页（/docs/prd）与后台入口；远程图片上传接口；首页大图读取配置；站点配置接口；图片上传与列表接口；植物列表与图片更新接口；评论审核接口；访问统计接口；后台登出接口；埋点上报接口与页面接入；评论提交接口与前台评论组件；首页布局第一屏（导航+大图+精选）与第二屏（全部植物列表+分页）；新增植物内容：Sunflowers、Carnations、Tulips、Chrysanthemums、Roses、Daffodils、Oleander、ZZ Plant、Sago Palm、Pothos、Philodendron。
- 部署：支持通过更新构建触发文件进行干净构建。

## 1. 背景与目标
- 项目目标：打造一个温馨可爱的宠物安全植物指南网站，支持用户评论、访问埋点，并做好本地 SEO。
- 成功度量：搜索流量增长、页面停留、评论互动数、本地关键词排名。

## 2. 用户与场景
- 目标用户：养猫用户（查询植物安全性）、站点管理员（维护内容与图片）。
- 典型场景：
  - 用户搜索进入首页，浏览分类与植物详情，必要时查看“处理建议”。
  - 管理员在后台上传图片、设置首页大图、维护植物封面与缩略图。

## 3. 功能需求
- 必做（MVP）：
  - 首页展示与可配置的 Hero 图片。
  - 植物列表与详情内容展示（安全/有毒/注意）。
  - 后台图片管理：上传并应用到首页/植物封面/缩略图。
  - PRD 文档可在线预览。
- 迭代增强：
  - 用户评论提交与后台审核。
  - 访问埋点与可视化统计。
  - 本地 SEO 优化与结构化数据。
- 非目标（当前阶段）：
  - 支付、电商、复杂社交功能。

## 4. 业务规则
- 管理员登录后方可进行后台操作与配置更新。
- 图片上传限制：规范文件名，限制类型与大小，失败重试与提示。
- 评论需审核后展示，保留基本反垃圾策略。

## 5. 信息架构与数据
- 核心实体：植物（名称、毒性等级、摘要、图片、缩略图、链接等）；评论；访问记录；站点配置（Hero）。
- 表结构示例：

| 表 | 字段 | 类型 |
|---|---|---|
| comments | id | UUID |
|  | plant_id | text |
|  | user_name | text |
|  | content | text |
|  | is_approved | boolean |
|  | created_at | timestamp |
| page_views | page_path | text |
|  | referrer | text |
|  | user_agent | text |
|  | viewed_at | timestamp |

## 6. 交互与 UI
- 视觉风格：萌系卡片布局、猫爪背景、粉色主色、圆角卡片与悬停动画。
- 移动端：卡片分组、标签样式列表、避免拥挤与换行混乱。

示例代码：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PawSafePlants</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: url('https://i.imgur.com/7XZKq3Q.png') repeat; margin: 0; padding: 20px; color: #555; }
    .container { max-width: 90%; margin: 0 auto; background-color: rgba(255,255,255,0.8); border-radius: 15px; padding: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
    .category-box { margin-bottom: 15px; background: #fff; border-radius: 12px; padding: 10px; border: 2px solid #ffe6f2; box-shadow: 0 2px 6px rgba(255,100,150,0.1); }
    .category-title { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #e67e22; margin-bottom: 8px; }
    .plant-list { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
    .plant-item { font-size: 12px; color: #000; text-decoration: none; padding: 3px 6px; background: #f0f8ff; border-radius: 8px; transition: all 0.2s ease; }
    .plant-item:hover { background: #e6f7ff; transform: scale(1.05); }
    .view-all-btn { background: #ff99cc; color: #fff; border: none; border-radius: 8px; padding: 4px 10px; font-size: 12px; cursor: pointer; }
    .view-all-btn:hover { background: #ff66aa; }
  </style>
  </head>
  <body>
    <div class="container">
      <div class="category-box">
        <div class="category-title">💖 Safe</div>
        <div class="plant-list">
          <a href="#" class="plant-item">Roses (玫瑰)</a>
          <a href="#" class="plant-item">Spider Plant (吊兰)</a>
          <a href="#" class="plant-item">Sunflowers (向日葵)</a>
        </div>
        <button class="view-all-btn">View All →</button>
      </div>
      <div class="category-box">
        <div class="category-title">🚫 Toxic</div>
        <div class="plant-list">
          <a href="#" class="plant-item">Lilies (百合/萱草)</a>
          <a href="#" class="plant-item">Oleander (夹竹桃)</a>
          <a href="#" class="plant-item">Sago Palm (苏铁)</a>
          <a href="#" class="plant-item">Tulips (郁金香)</a>
        </div>
        <button class="view-all-btn">View All →</button>
      </div>
      <div class="category-box">
        <div class="category-title">⚠️ Caution</div>
        <div class="plant-list">
          <a href="#" class="plant-item">Aloe Vera (芦荟)</a>
          <a href="#" class="plant-item">Carnations (康乃馨)</a>
        </div>
        <button class="view-all-btn">View All →</button>
      </div>
    </div>
  </body>
</html>
```

## 7. 技术方案
- 前端：Next.js（SSR/SSG），页面路由与数据读取。
- 后端：接口统一为 API 路由，采用文件存储或 Supabase（开源 BaaS）实现评论与埋点。
- 部署：Vercel，支持干净构建触发；环境变量管理；日志与监控。
- 示例调用：

```javascript
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('YOUR_URL', 'YOUR_ANON_KEY')
await supabase.from('comments').insert({ plant_id: 'lilies', user_name: '小明', content: '有用！' })
await supabase.from('page_views').insert({ page_path: '/plants/lilies' })
```

## 8. 依赖与风险
- 第三方依赖：Supabase、Vercel、React/Next.js。
- 风险：免费额度限制、API 配额、评论审核负担、隐私合规（IP 处理与哈希）。

## 9. 验收与度量
- 关键用例：首页与详情可正常渲染；后台能上传与应用图片；PRD 可预览。
- 指标：PV/UV、页面停留、评论数量、通过率、核心关键词排名与点击。

## 10. 里程碑与计划
- MVP：首页/详情/后台图片管理/PRD 预览。
- v1：评论系统（提交流程、审核后台）、访问埋点统计与图表。
- v2：本地 SEO 深化、多语言、PWA 与离线访问。

---

### 填写提示
- 逐段补充关键信息；如需表格/流程图可直接用 Markdown。
- 完成后告知，我将按文档逐项实现与验证，并把已上线的内容同步到本文件。
