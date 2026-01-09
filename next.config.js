/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'rczfbgzghwiqpxihlexs.supabase.co',
      'supabase.co'
    ],
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig
