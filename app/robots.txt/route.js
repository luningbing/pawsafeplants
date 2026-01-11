import { generateRobotsTxt } from '../../lib/sitemap'

export function GET() {
  const robotsTxt = generateRobotsTxt()
  
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
