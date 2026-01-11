import Image from 'next/image'
import { useState } from 'react'

// 优化的图片组件，支持 WebP/Avif 转换和性能优化
function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false,
  loading = 'lazy',
  className = '',
  style = {},
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  ...props 
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // 自动设置加载策略：priority=true时使用eager，否则使用lazy
  const loadingStrategy = priority ? 'eager' : loading

  // 生成 blurDataURL (简单的占位符)
  const generateBlurDataURL = (width, height) => {
    const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null
    if (!canvas) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmMGYwZjAiLz48L3N2Zz4='
    
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, width, height)
    
    return canvas.toDataURL('image/jpeg', 0.1)
  }

  const blurDataURL = generateBlurDataURL(width || 400, height || 300)

  if (error) {
    return (
      <div 
        className={className}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          color: '#6c757d',
          fontSize: '14px',
          minHeight: height || '200px'
        }}
      >
        🌿 图片加载失败
      </div>
    )
  }

  return (
    <div className={className} style={{ position: 'relative', ...style }}>
      <Image
        src={src}
        alt={alt}
        width={width || 400}
        height={height || 300}
        priority={priority}
        loading={loadingStrategy}
        sizes={sizes}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => setError(true)}
        style={{
          objectFit: 'cover',
          width: '100%',
          height: '100%'
        }}
        {...props}
      />
      
      {isLoading && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ color: '#999', fontSize: '12px' }}>加载中...</div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}

export default OptimizedImage
