import { generateSitemap, generateRobotsTxt } from '../../lib/sitemap'

export async function GET() {
  const sitemap = await generateSitemap()
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
