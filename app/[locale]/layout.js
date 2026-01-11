import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// Market-specific metadata
const marketMetadata = {
  'en-us': {
    title: 'PawSafePlants - Cat-Safe Plant Guide for US & Canada',
    description: 'Complete guide to cat-safe plants for North American pet owners. Expert advice on non-toxic flowers, houseplants, and garden plants.',
    keywords: ['cat safe plants US', 'non-toxic plants Canada', 'pet friendly plants North America', 'cat safe flowers USA'],
    market: 'US & Canada',
    currency: 'USD',
    domain: 'www.pawsafeplants.com'
  },
  'en-gb': {
    title: 'PawSafePlants - Cat-Safe Plant Guide for UK & Europe',
    description: 'Expert guide to cat-safe plants for UK and European pet owners. Find non-toxic flowers, houseplants, and garden plants.',
    keywords: ['cat safe plants UK', 'non-toxic plants Britain', 'pet friendly plants Europe', 'cat safe flowers United Kingdom'],
    market: 'UK & Europe',
    currency: 'GBP',
    domain: 'uk.pawsafeplants.com'
  },
  'de': {
    title: 'PawSafePlants - Katzensichere Pflanzen Führer für Deutschland',
    description: 'Kompletter Leitfaden für katzensichere Pflanzen für deutsche Haustierbesitzer. Expertenrat zu ungiftigen Blumen und Zimmerpflanzen.',
    keywords: ['katzensichere Pflanzen Deutschland', 'ungiftige Pflanzen für Katzen', 'katzenfreundliche Pflanzen', 'sichere Blumen für Katzen'],
    market: 'Deutschland & EU',
    currency: 'EUR',
    domain: 'de.pawsafeplants.com'
  }
}

export async function generateMetadata({ params }) {
  const locale = params.locale || 'en-us'
  const metadata = marketMetadata[locale] || marketMetadata['en-us']
  
  return {
    metadataBase: new URL(`https://${metadata.domain}`),
    title: {
      default: metadata.title,
      template: '%s | PawSafePlants'
    },
    description: metadata.description,
    keywords: metadata.keywords.join(', '),
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
      locale: locale,
      url: `https://${metadata.domain}`,
      title: metadata.title,
      description: metadata.description,
      siteName: 'PawSafePlants',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
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
    alternates: {
      canonical: `https://${metadata.domain}`,
      languages: {
        'en-US': `https://www.pawsafeplants.com`,
        'en-GB': `https://uk.pawsafeplants.com`,
        'de': `https://de.pawsafeplants.com`,
        'en': `https://www.pawsafeplants.com`,
        'x-default': `https://www.pawsafeplants.com`
      }
    }
  }
}

export default function RootLayout({
  children,
  params
}) {
  const locale = params.locale || 'en-us'
  const metadata = marketMetadata[locale] || marketMetadata['en-us']
  
  return (
    <html lang={locale} dir="ltr">
      <head>
        <link rel="canonical" href={`https://${metadata.domain}`} />
        
        {/* Hreflang tags for international SEO */}
        <link rel="alternate" hreflang="en-us" href="https://www.pawsafeplants.com" />
        <link rel="alternate" hreflang="en-gb" href="https://uk.pawsafeplants.com" />
        <link rel="alternate" hreflang="de" href="https://de.pawsafeplants.com" />
        <link rel="alternate" hreflang="en" href="https://www.pawsafeplants.com" />
        <link rel="alternate" hreflang="x-default" href="https://www.pawsafeplants.com" />
        
        {/* Market-specific hreflang for flower pages */}
        <link rel="alternate" hreflang="en-us" href={`https://www.pawsafeplants.com/cat-safe-flowers`} />
        <link rel="alternate" hreflang="en-gb" href={`https://uk.pawsafeplants.com/cat-safe-flowers`} />
        <link rel="alternate" hreflang="de" href={`https://de.pawsafeplants.com/cat-safe-flowers`} />
        
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://rczfbgzghwiqpxihlexs.supabase.co" />
        
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Market-specific meta tags */}
        <meta name="market" content={metadata.market} />
        <meta name="currency" content={metadata.currency} />
        <meta name="geo.region" content={locale === 'en-us' ? 'US' : locale === 'en-gb' ? 'GB' : 'DE'} />
      </head>
      <body className={inter.className}>
        {/* Market-specific header */}
        <div style={{
          background: 'linear-gradient(90deg, #87A96B, #6B8553)',
          color: '#fff',
          padding: '8px 16px',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          🌸 Serving {metadata.market} | Currency: {metadata.currency}
        </div>
        
        {children}
        
        {/* Market-specific footer */}
        <div style={{
          background: '#f8f9fa',
          padding: '16px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#6c757d',
          borderTop: '1px solid #dee2e6'
        }}>
          <p>
            © 2024 PawSafePlants | {metadata.market} | 
            <a 
              href={`https://${metadata.domain}/privacy`}
              style={{ color: '#87A96B', textDecoration: 'none', margin: '0 8px' }}
            >
              Privacy
            </a>
            <a 
              href={`https://${metadata.domain}/terms`}
              style={{ color: '#87A96B', textDecoration: 'none', margin: '0 8px' }}
            >
              Terms
            </a>
          </p>
          <p style={{ marginTop: '8px', fontSize: '11px' }}>
            ⚠️ Always consult with your veterinarian for plant safety concerns.
          </p>
        </div>
      </body>
    </html>
  )
}
