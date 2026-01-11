/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // i18n 配置 - 针对北美和欧洲市场
  i18n: {
    locales: ['en-us', 'en-gb', 'de', 'en', 'zh', 'ja'],
    defaultLocale: 'en-us',
    localeDetection: true,
    domains: [
      {
        domain: 'www.pawsafeplants.com',
        defaultLocale: 'en-us',
      },
      {
        domain: 'us.pawsafeplants.com',
        defaultLocale: 'en-us',
      },
      {
        domain: 'uk.pawsafeplants.com',
        defaultLocale: 'en-gb',
      },
      {
        domain: 'de.pawsafeplants.com',
        defaultLocale: 'de',
      },
      {
        domain: 'eu.pawsafeplants.com',
        defaultLocale: 'de',
      },
      {
        domain: 'zh.pawsafeplants.com',
        defaultLocale: 'zh',
      },
      {
        domain: 'ja.pawsafeplants.com',
        defaultLocale: 'ja',
      },
    ],
    // Custom locale detection for North American and European markets
    localeDetection: true,
  },
  
  images: {
    domains: [
      'rczfbgzghwiqpxihlexs.supabase.co',
      'supabase.co',
      'images.unsplash.com',
      'localhost'
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 性能优化
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion'],
  },
  
  // 重定向规则 - 为未来的多语言路径做准备
  async redirects() {
    return [
      // 临时重定向，为多语言做准备
      {
        source: '/flowers',
        destination: '/en/flowers',
        permanent: false,
      },
      {
        source: '/cat-safe-flowers',
        destination: '/en/cat-safe-flowers',
        permanent: false,
      },
    ];
  },
  
  // 头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
