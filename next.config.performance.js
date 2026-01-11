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
  
  // Performance optimizations for <1.5s load time
  images: {
    domains: [
      'rczfbgzghwiqpxihlexs.supabase.co',
      'supabase.co',
      'images.unsplash.com',
      'localhost'
    ],
    formats: ['image/webp', 'image/avif'],
    // Enable image optimization for faster loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable placeholder generation
    placeholder: 'blur',
    // Enable minimum cache TTL for faster subsequent loads
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion'],
    // Enable App Router optimizations
    appDir: true,
    // Enable ISR for better performance
    isrMemoryCacheSize: 50,
    // Enable streaming for better perceived performance
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
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
          }
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable' // 1 year for optimized images
          }
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400' // 1 day for sitemap
          }
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400' // 1 day for robots.txt
          }
        ],
      }
    ]
  },
  
  // Rewrites for performance and SEO
  async rewrites() {
    return [
      // Rewrite occasion URLs to API for better caching
      {
        source: '/occasions/:slug',
        destination: '/api/occasions?occasion=:slug'
      },
      // Rewrite cat-safe-flowers to API for better caching
      {
        source: '/cat-safe-flowers',
        destination: '/api/cat-safe-flowers'
      }
    ]
  },
  
  // Redirects for SEO and user experience
  async redirects() {
    return [
      // Legacy redirects
      {
        source: '/flowers',
        destination: '/cat-safe-flowers',
        permanent: true,
      },
      {
        source: '/cat-safe-flowers',
        destination: '/en-us/cat-safe-flowers',
        permanent: false,
      },
      // Market-specific redirects
      {
        source: '/us/:path*',
        destination: '/en-us/:path*',
        permanent: false,
      },
      {
        source: '/uk/:path*',
        destination: '/en-gb/:path*',
        permanent: false,
      },
      {
        source: '/de/:path*',
        destination: '/de/:path*',
        permanent: false,
      }
    ]
  },
  
  // Webpack optimizations for faster builds
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
            return `npm.${packageName.replace('@', '')}`
          },
          priority: -10,
          chunks: 'all',
        },
      },
    }
    
    return config
  },
  
  // Enable build optimizations
  poweredByHeader: false,
  
  // Output optimization
  output: 'standalone',
  
  // Enable trailing slash for better SEO
  trailingSlash: true,
}

module.exports = nextConfig
