/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Performance optimizations for <1.5s load time
  images: {
    domains: [
      'images.unsplash.com',
      'images.pexels.com',
      'lh3.googleusercontent.com',
      '*.supabase.co', // 允许所有 supabase 子域名
      'your-project-id.supabase.co', // 替换为你真实的 supabase 项目ID
      'rczfbgzghwiqpxihlexs.supabase.co/storage/v1/object/public' // 添加Supabase存储路径
    ],
    formats: ['image/webp', 'image/avif'],
    // Enable image optimization for faster loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable minimum cache TTL for faster subsequent loads
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  // Compression for faster load times
  compress: true,
  
  // Enable static optimization
  generateEtags: true,
  
  // Power header configurations for caching and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300' // 5 minutes for API responses
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          }
        ],
      },
    ];
  },
}

module.exports = nextConfig
