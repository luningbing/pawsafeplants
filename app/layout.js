import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://www.pawsafeplants.com'),
  title: {
    default: 'PawSafePlants - 猫咪安全植物指南',
    template: '%s | PawSafePlants'
  },
  description: '专业的猫咪安全植物指南，帮助猫主人识别和选择对猫咪无害的室内植物。提供详细的毒性信息和养护建议。',
  keywords: ['猫咪安全植物', '猫有毒植物', '宠物友好植物', '室内植物猫咪', '猫咪植物安全指南'],
  authors: [{ name: 'PawSafePlants Team' }],
  creator: 'PawSafePlants',
  publisher: 'PawSafePlants',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://www.pawsafeplants.com',
    title: 'PawSafePlants - 猫咪安全植物指南',
    description: '专业的猫咪安全植物指南，帮助猫主人识别和选择对猫咪无害的室内植物。',
    siteName: 'PawSafePlants',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PawSafePlants - 猫咪安全植物指南',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PawSafePlants - 猫咪安全植物指南',
    description: '专业的猫咪安全植物指南，帮助猫主人识别和选择对猫咪无害的室内植物。',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="canonical" href="https://www.pawsafeplants.com" />
        
        {/* Hreflang tags for international SEO */}
        <link rel="alternate" hreflang="en" href="https://www.pawsafeplants.com/en" />
        <link rel="alternate" hreflang="zh-CN" href="https://www.pawsafeplants.com" />
        <link rel="alternate" hreflang="zh" href="https://www.pawsafeplants.com/zh" />
        <link rel="alternate" hreflang="ja" href="https://www.pawsafeplants.com/ja" />
        <link rel="alternate" hreflang="x-default" href="https://www.pawsafeplants.com" />
        
        {/* Domain-specific alternates for future subdomain strategy */}
        <link rel="alternate" hreflang="en" href="https://www.pawsafeplants.com" />
        <link rel="alternate" hreflang="zh-CN" href="https://zh.pawsafeplants.com" />
        <link rel="alternate" hreflang="ja" href="https://ja.pawsafeplants.com" />
        
        {/* Flower-specific hreflang for cat-safe-flowers pages */}
        <link rel="alternate" hreflang="en" href="https://www.pawsafeplants.com/cat-safe-flowers" />
        <link rel="alternate" hreflang="zh-CN" href="https://www.pawsafeplants.com/cat-safe-flowers" />
        <link rel="alternate" hreflang="ja" href="https://www.pawsafeplants.com/cat-safe-flowers" />
        
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
