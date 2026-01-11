import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Custom404() {
  const [catPosition, setCatPosition] = useState({ x: 50, y: 50 })
  const [isSearching, setIsSearching] = useState(true)
  const [foundPlant, setFoundPlant] = useState(false)

  // 猫咪搜索动画
  useEffect(() => {
    const interval = setInterval(() => {
      if (isSearching) {
        setCatPosition({
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20
        })
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isSearching])

  // 3秒后找到植物
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSearching(false)
      setFoundPlant(true)
      setCatPosition({ x: 45, y: 40 })
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const safePlants = [
    '🌿 Spider Plant',
    '🌱 Boston Fern', 
    '🌾 Areca Palm',
    '🍃 Money Tree',
    '🌺 Orchid',
    '🌹 Roses'
  ]

  return (
    <>
      <Head>
        <title>404 - 猫咪迷路了 | PawSafePlants</title>
        <meta name="description" content="哎呀！猫咪在寻找安全的植物时迷路了。让我们帮它找到回家的路吧！" />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FAF7F2 0%, #87A96B20 50%, #FAF7F2 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 背景装饰 */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          fontSize: '40px',
          opacity: 0.1,
          transform: 'rotate(-15deg)'
        }}>🌿</div>
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          fontSize: '35px',
          opacity: 0.1,
          transform: 'rotate(20deg)'
        }}>🌱</div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '8%',
          fontSize: '45px',
          opacity: 0.1,
          transform: 'rotate(-10deg)'
        }}>🍃</div>
        <div style={{
          position: 'absolute',
          bottom: '25%',
          right: '5%',
          fontSize: '38px',
          opacity: 0.1,
          transform: 'rotate(15deg)'
        }}>🌺</div>

        {/* 主要内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            maxWidth: '600px',
            width: '100%',
            zIndex: 10
          }}
        >
          {/* 迷路的猫咪 */}
          <div style={{
            position: 'relative',
            height: '200px',
            marginBottom: '30px'
          }}>
            <motion.div
              animate={{
                x: isSearching ? [
                  { x: 0, y: 0 },
                  { x: 20, y: -10 },
                  { x: -15, y: 5 },
                  { x: 10, y: -5 },
                  { x: 0, y: 0 }
                ] : { x: 0, y: 0 },
                scale: foundPlant ? [1, 1.1, 1] : 1
              }}
              transition={{
                duration: isSearching ? 2 : 0.5,
                repeat: isSearching ? Infinity : 0,
                ease: "easeInOut"
              }}
              style={{
                fontSize: '80px',
                display: 'inline-block'
              }}
            >
              🐱
            </motion.div>
            
            {/* 搜索动画 */}
            {isSearching && (
              <motion.div
                animate={{
                  opacity: [0, 1, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '30px'
                }}
              >
              🔍
              </motion.div>
            )}

            {/* 找到植物 */}
            {foundPlant && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  top: '60%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '40px'
                }}
              >
                🌿
              </motion.div>
            )}
          </div>

          {/* 标题 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 'clamp(24px, 5vw, 36px)',
              fontWeight: 700,
              color: '#87A96B',
              marginBottom: '16px',
              lineHeight: 1.2
            }}
          >
            {foundPlant ? '😸 猫咪找到安全植物了！' : '😿 猫咪迷路了...'}
          </motion.h1>

          {/* 描述 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontSize: 'clamp(16px, 3vw, 18px)',
              color: '#666',
              marginBottom: '30px',
              lineHeight: 1.6
            }}
          >
            {foundPlant 
              ? '太好了！猫咪找到了一些对猫咪安全的植物。让我们一起探索更多吧！'
              : '哎呀！这个植物页面好像不存在。让猫咪帮你找一些对猫咪安全的植物吧！'
            }
          </motion.p>

          {/* 安全植物列表 */}
          {foundPlant && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '30px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                border: '2px solid #87A96B20'
              }}
            >
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#87A96B',
                marginBottom: '12px'
              }}>
                🐱 猫咪推荐的安全植物：
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '8px'
              }}>
                {safePlants.map((plant, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    style={{
                      background: '#FAF7F2',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: '#666',
                      border: '1px solid #87A96B20'
                    }}
                  >
                    {plant}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 按钮组 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 24px',
                background: '#87A96B',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '16px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(135, 169, 107, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(135, 169, 107, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(135, 169, 107, 0.3)'
              }}
            >
              🏠 回到首页
            </Link>

            <Link
              href="/plants/safe"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 24px',
                background: '#fff',
                color: '#87A96B',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '16px',
                transition: 'all 0.3s ease',
                border: '2px solid #87A96B'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#87A96B'
                e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff'
                e.currentTarget.style.color = '#87A96B'
              }}
            >
              🌿 查看安全植物
            </Link>
          </motion.div>
        </motion.div>

        {/* 底部装饰 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '12px',
            color: '#999',
            textAlign: 'center'
          }}
        >
          💕 猫咪和植物都要安全哦 💕
        </motion.div>
      </div>
    </>
  )
}
