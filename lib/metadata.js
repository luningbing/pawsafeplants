import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// 动态生成植物页面的 metadata
export async function generateMetadata({ params }) {
  try {
    const { slug } = params
    const plantsDir = path.join(process.cwd(), 'content/plants')
    const fullPath = path.join(plantsDir, `${slug}.md`)
    
    let plantData = null
    try {
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)
      plantData = data
    } catch (error) {
      console.error(`Failed to read plant data for ${slug}:`, error)
    }

    if (!plantData) {
      return {
        title: '植物详情 | PawSafePlants',
        description: '查看详细的植物安全信息和养护建议。',
      }
    }

    const toxicityLevel = plantData.toxicity_level || '未知'
    const isSafe = toxicityLevel.toLowerCase().includes('safe')
    
    const title = `${plantData.title || '植物'} 对猫安全吗？- PawSafePlants`
    const description = `${plantData.title || '这种植物'}${isSafe ? '对猫咪是安全的' : '对猫咪有毒性'}。${toxicityLevel}。${plantData.summary || '查看详细的毒性信息和养护建议。'}`
    
    return {
      title,
      description,
      keywords: [
        plantData.title,
        '猫咪安全',
        toxicityLevel,
        '宠物植物',
        '室内植物',
        '猫咪毒性'
      ].filter(Boolean).join(', '),
      openGraph: {
        title,
        description,
        type: 'article',
        images: plantData.image ? [
          {
            url: plantData.image,
            width: 800,
            height: 600,
            alt: `${plantData.title} - 毒性等级: ${toxicityLevel}`,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: plantData.image ? [plantData.image] : [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: '植物详情 | PawSafePlants',
      description: '查看详细的植物安全信息和养护建议。',
    }
  }
}

// 生成 JSON-LD 结构化数据
export function generateStructuredData(plantData, slug) {
  if (!plantData) return null

  const toxicityLevel = plantData.toxicity_level || '未知'
  const isSafe = toxicityLevel.toLowerCase().includes('safe')
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${plantData.title || '植物'} 对猫安全吗？`,
    description: plantData.summary || '查看详细的植物安全信息',
    image: plantData.image ? [plantData.image] : [],
    datePublished: plantData.created_at || new Date().toISOString(),
    dateModified: plantData.updated_at || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'PawSafePlants',
      url: 'https://www.pawsafeplants.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'PawSafePlants',
      url: 'https://www.pawsafeplants.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.pawsafeplants.com/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.pawsafeplants.com/plants/${slug}`
    },
    about: {
      '@type': 'Thing',
      name: plantData.title,
      description: `毒性等级: ${toxicityLevel}`,
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: '对猫咪安全性',
          value: isSafe ? '安全' : '有毒'
        },
        {
          '@type': 'PropertyValue',
          name: '毒性等级',
          value: toxicityLevel
        }
      ]
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: isSafe ? '5' : '1',
        bestRating: '5',
        worstRating: '1'
      },
      author: {
        '@type': 'Organization',
        name: 'PawSafePlants'
      },
      reviewBody: isSafe 
        ? '这种植物对猫咪是安全的，可以放心饲养。'
        : '这种植物对猫咪有毒性，需要避免接触。'
    }
  }

  return structuredData
}
