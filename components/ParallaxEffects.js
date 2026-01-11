import { useEffect, useRef, useState } from 'react'

// 视差滚动组件，为氛围图添加轻微的视差效果
function ParallaxContainer({ children, speed = 0.5, className = '', style = {} }) {
  const [offsetY, setOffsetY] = useState(0)
  const elementRef = useRef()

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return
      
      const rect = elementRef.current.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const elementTop = rect.top + scrollTop
      
      // 计算视差偏移
      const scrolled = scrollTop - elementTop
      const parallax = scrolled * speed
      
      setOffsetY(parallax)
    }

    // 节流函数
    const throttledHandleScroll = () => {
      requestAnimationFrame(handleScroll)
    }

    window.addEventListener('scroll', throttledHandleScroll)
    handleScroll() // 初始化

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [speed])

  return (
    <div 
      ref={elementRef}
      className={className}
      style={{
        transform: `translateY(${offsetY}px)`,
        willChange: 'transform',
        ...style
      }}
    >
      {children}
    </div>
  )
}

// 氛围图视差组件
function AtmosphereParallax({ image, title, index, className = '' }) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <ParallaxContainer 
      speed={0.3 + (index * 0.1)} // 每张图片稍微不同的速度
      className={className}
      style={{
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '2px solid #f5f1e8',
        transform: `translateY(${isHovered ? '-12px' : '0'}) scale(${isHovered ? '1.02' : '1'})`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        height: '200px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <img
          src={image.url}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: `scale(${isHovered ? '1.1' : '1'})`,
            opacity: imageLoaded ? 1 : 0,
          }}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* 加载占位符 */}
        {!imageLoaded && (
          <div style={{
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
          }}>
            <div style={{ color: '#999', fontSize: '12px' }}>🌸 Loading...</div>
          </div>
        )}
        
        {/* 渐变遮罩 */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: `linear-gradient(to top, rgba(0,0,0,${isHovered ? '0.8' : '0.7'}) 0%, transparent 100%)`,
          color: '#fff',
          padding: '20px 16px 16px',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: 600,
            marginBottom: '4px',
            transform: `translateY(${isHovered ? '0' : '4px'})`,
            opacity: isHovered ? 1 : 0.9,
            transition: 'all 0.3s ease'
          }}>
            {title}
          </div>
          <div style={{
            fontSize: '12px',
            opacity: 0.8,
            transform: `translateY(${isHovered ? '0' : '8px'})`,
            transition: 'all 0.3s ease 0.1s'
          }}>
            营造温馨氛围 🌸
          </div>
        </div>
        
        {/* 悬停时的光晕效果 */}
        {isHovered && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, transparent 0%, rgba(135, 169, 107, 0.1) 100%)',
            pointerEvents: 'none'
          }} />
        )}
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </ParallaxContainer>
  )
}

export { ParallaxContainer, AtmosphereParallax }
