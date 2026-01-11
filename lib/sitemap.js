import fs from 'fs'
import path from 'path'

// 生成站点地图
export async function generateSitemap() {
  const baseUrl = 'https://www.pawsafeplants.com'
  const currentDate = new Date().toISOString()
  
  // 基础页面
  const staticPages = [
    {
      url: baseUrl,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/cat-safe-flowers`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/plants/safe`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/plants/toxic`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/plants/caution`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.5
    }
  ]

  // 动态植物页面
  const plantPages = []
  try {
    const plantsDir = path.join(process.cwd(), 'content/plants')
    const filenames = fs.readdirSync(plantsDir).filter(f => f.endsWith('.md'))
    
    for (const filename of filenames) {
      const slug = filename.replace('.md', '')
      const fullPath = path.join(plantsDir, filename)
      const stats = fs.statSync(fullPath)
      
      plantPages.push({
        url: `${baseUrl}/plants/${slug}`,
        lastmod: stats.mtime.toISOString(),
        changefreq: 'monthly',
        priority: 0.7
      })
    }
  } catch (error) {
    console.error('Error reading plants directory:', error)
  }

  // 生成 XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...plantPages].map(page => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`

  return sitemap
}

// 生成 robots.txt
export function generateRobotsTxt() {
  return `User-agent: *
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
Crawl-delay: 1`
}
