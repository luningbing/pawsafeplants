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
    const isFlower = plantData.category === 'flower' || plantData.is_flower || false
    
    // 优化标题模板 - 针对花朵类植物
    const title = isFlower 
      ? `${plantData.title || '植物'} - Is it a Cat Safe Flower? | PawSafePlants`
      : `${plantData.title || '植物'} 对猫安全吗？- PawSafePlants`
    
    // 场景化长尾词
    const scenarioKeywords = isFlower ? [
      'cat safe flowers',
      'pet friendly bouquets',
      'cat safe arrangements',
      'non-toxic flowers for cats',
      'cat safe gift flowers',
      'pet friendly wedding flowers',
      'feline safe bouquets',
      'cat safe wedding flowers',
      'pet friendly valentines flowers',
      'cat safe anniversary flowers',
      'cat safe birthday flowers',
      'cat safe get well flowers',
      'cat safe sympathy flowers',
      'cat safe congratulations flowers'
    ] : [
      'cat safe plants',
      'pet friendly plants',
      'non-toxic plants for cats',
      'feline safe houseplants',
      'cat safe indoor plants'
    ]
    
    const description = isFlower
      ? `${plantData.title || '这种花朵'}${isSafe ? 'is completely safe for cats' : 'may be harmful to cats'} - Perfect for ${isSafe ? 'cat-safe bouquets, gifts, and floral arrangements' : 'avoiding in pet-friendly homes'}. ${toxicityLevel}. ${plantData.summary || 'Complete guide to using this flower safely around cats.'}`
      : `${plantData.title || '这种植物'}${isSafe ? '对猫咪是安全的' : '对猫咪有毒性'}。${toxicityLevel}。${plantData.summary || '查看详细的毒性信息和养护建议。'}`
    
    return {
      title,
      description,
      keywords: [
        plantData.title,
        toxicityLevel,
        ...scenarioKeywords,
        isFlower ? 'flowers, bouquets, arrangements, gifts, wedding, valentines' : 'plants, houseplants, indoor, garden',
        '猫咪安全',
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
  const isFlower = plantData.category === 'flower' || plantData.is_flower || false
  
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': isFlower ? 'Product' : 'Article',
    headline: isFlower 
      ? `${plantData.title || '花朵'} - Is it a Cat Safe Flower?`
      : `${plantData.title || '植物'} 对猫安全吗？`,
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
    }
  }

  if (isFlower) {
    // 花朵特定的结构化数据 - 增强版用于 Google Guides/Product Safety
    return {
      ...baseStructuredData,
      '@type': ['Product', 'Guide'],
      name: `${plantData.title || '花朵'} - Cat Safe Flower`,
      category: 'Flowers',
      audience: {
        '@type': 'Audience',
        audienceType: 'Cat Owners',
        geographicArea: ['United States', 'Canada', 'United Kingdom', 'Germany', 'European Union']
      },
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        priceCurrency: 'USD',
        description: 'Cat-safe flower information and safety guide',
        seller: {
          '@type': 'Organization',
          name: 'PawSafePlants',
          url: 'https://www.pawsafeplants.com'
        }
      },
      // Enhanced safety information for Google Product Safety snippets
      safetyLevel: isSafe ? 'Safe' : 'Hazardous',
      targetAudience: {
        '@type': 'Audience',
        audienceType: 'Pet Owners',
        species: 'Felis catus (Domestic Cat)'
      },
      species: {
        '@type': 'Thing',
        name: 'Felis catus',
        alternateName: ['Domestic Cat', 'House Cat', 'Feline']
      },
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Cat Safety',
          value: isSafe ? 'Safe for Cats' : 'Toxic to Cats',
          unitText: 'Safety Assessment'
        },
        {
          '@type': 'PropertyValue',
          name: 'Toxicity Level',
          value: toxicityLevel,
          unitText: 'Toxicity Classification'
        },
        {
          '@type': 'PropertyValue',
          name: 'Species Safety',
          value: isSafe ? 'Non-toxic to Felis catus' : 'Toxic to Felis catus',
          unitText: 'Species-Specific Safety'
        },
        {
          '@type': 'PropertyValue',
          name: 'Suitable for',
          value: 'Cat-safe bouquets, arrangements, gifts',
          unitText: 'Use Case'
        },
        {
          '@type': 'PropertyValue',
          name: 'Use Cases',
          value: 'Weddings, Valentine\'s Day, Birthdays, Anniversaries',
          unitText: 'Occasions'
        },
        {
          '@type': 'PropertyValue',
          name: 'Geographic Availability',
          value: ['North America', 'Europe'],
          unitText: 'Market Region'
        },
        {
          '@type': 'PropertyValue',
          name: 'Safety Verification',
          value: isSafe ? 'Verified Non-Toxic' : 'Confirmed Toxic',
          unitText: 'Verification Status'
        }
      ],
      // Guide-specific properties for Google Guide snippets
      guideCategory: 'Pet Safety',
      guideType: 'Product Safety Guide',
      safetyInformation: {
        '@type': 'SafetyInformation',
        safetyRisk: isSafe ? 'Low Risk' : 'High Risk',
        targetSpecies: 'Felis catus',
        precautions: isSafe 
          ? 'Generally safe for cats, monitor for individual sensitivities'
          : 'Keep away from cats, seek veterinary care if ingested'
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
          ? 'This flower is completely safe for cats and perfect for pet-friendly bouquets and arrangements. Verified as non-toxic for Felis catus species.'
          : 'This flower is toxic to cats and should be avoided in homes with feline pets. Confirmed hazardous for Felis catus species.'
      }
    }
  } else {
    // 普通植物的结构化数据
    return {
      ...baseStructuredData,
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
  }

  return structuredData
}
