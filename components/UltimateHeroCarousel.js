import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const UltimateHeroCarousel = ({ slides = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showPawPrint, setShowPawPrint] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-play with progress tracking
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setProgress(0); // Reset progress
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + (100 / 50); // Increment over 5 seconds (50 intervals * 100ms)
      });
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [isAutoPlaying, slides.length]);

  // Reset progress when slide changes
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  const goToSlide = (index) => {
    // Show paw print feedback
    setShowPawPrint(true);
    setTimeout(() => setShowPawPrint(false), 500);
    
    setCurrentIndex(index);
    setIsAutoPlaying(false); // Stop auto-play when user manually navigates
    
    // Restart auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setShowPawPrint(true);
    setTimeout(() => setShowPawPrint(false), 500);
    
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setShowPawPrint(true);
    setTimeout(() => setShowPawPrint(false), 500);
    
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (!slides || slides.length === 0) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        borderRadius: '0',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #87A96B20, #87A96B10)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#87A96B' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🌿</div>
          <h2 style={{ fontSize: '24px', margin: 0 }}>Cat-Safe Plants</h2>
          <p style={{ fontSize: '16px', margin: '0.5rem 0', opacity: 0.8 }}>Creating pet-friendly spaces</p>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: '#000'
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: -50 }}
          transition={{
            duration: 1.2,
            ease: [0.4, 0, 0.2, 1]
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        >
          {/* Ken Burns Effect Image */}
          {currentSlide.imageUrl && (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  x: [0, 20, 0],
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 5,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                style={{
                  position: 'absolute',
                  top: '-10%',
                  left: '-10%',
                  width: '120%',
                  height: '120%',
                }}
              >
                <Image
                  src={currentSlide.imageUrl}
                  alt={`Hero slide ${currentIndex + 1}`}
                  fill
                  priority={currentIndex === 0}
                  className="hero-pulse"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                    backgroundColor: '#f3f4f6'
                  }}
                  onError={(e) => {
                    console.error('Image load error:', currentSlide.imageUrl, e);
                    // 使用备用的高清Unsplash图片
                    const fallbackImages = [
                      'https://images.unsplash.com/photo-1574158610182-6e2bae4e4d3b?w=1920&h=1080&fit=crop',
                      'https://images.unsplash.com/photo-1518709594023-a7b5d2e4cf76?w=1920&h=1080&fit=crop',
                      'https://images.unsplash.com/photo-1545241047-6083a3684587?w=1920&h=1080&fit=crop'
                    ];
                    e.target.src = fallbackImages[currentIndex % fallbackImages.length];
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', currentSlide.imageUrl);
                  }}
                />
              </motion.div>
              
              {/* Dark overlay for text readability */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)'
              }} />
            </div>
          )}

          {/* Paw Print Feedback */}
          <AnimatePresence>
            {showPawPrint && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '80px',
                  color: 'rgba(255, 182, 193, 0.6)', // Light pink
                  zIndex: 20,
                  pointerEvents: 'none'
                }}
              >
                🐾
              </motion.div>
            )}
          </AnimatePresence>

          {/* Text Content with delay */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3, // Delay text animation
              ease: [0.4, 0, 0.2, 1]
            }}
            style={{
              position: 'absolute',
              bottom: '15%',
              left: '8%',
              right: '40%', // 改为左对齐，右侧留空
              zIndex: 10,
              color: 'white',
              textAlign: 'left', // 强制左对齐
              background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)', // 更柔和的半透明渐变
              padding: '40px 30px',
              borderRadius: '20px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              style={{
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                fontWeight: '700',
                margin: '0 0 1rem 0',
                lineHeight: '1.1',
                fontFamily: "'Playfair Display', serif",
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}
            >
              {currentSlide.title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                margin: '0 0 2rem 0',
                lineHeight: '1.4',
                maxWidth: '600px',
                fontFamily: "'Inter', sans-serif",
                textShadow: '0 1px 4px rgba(0,0,0,0.4)'
              }}
            >
              {currentSlide.subtitle}
            </motion.p>
            
            {currentSlide.link && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <Link href={currentSlide.link}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '1rem 2rem',
                      fontSize: '1.1rem',
                      backgroundColor: '#87A96B',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      boxShadow: '0 8px 32px rgba(135, 169, 107, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Explore More
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <motion.button
        onClick={goToPrevious}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'absolute',
          left: '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: 20,
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ‹
      </motion.button>

      <motion.button
        onClick={goToNext}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'absolute',
          right: '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: 20,
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ›
      </motion.button>

      {/* Progress Bar Navigation */}
      <div style={{
        position: 'absolute',
        bottom: '3rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '1rem',
        zIndex: 20
      }}>
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              width: currentIndex === index ? '120px' : '60px',
              height: '4px',
              backgroundColor: currentIndex === index ? '#87A96B' : 'rgba(255, 255, 255, 0.3)',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {currentIndex === index && (
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.6)'
                }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default UltimateHeroCarousel;
