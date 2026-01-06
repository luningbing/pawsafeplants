import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const HeroCarousel = ({ slides = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false); // Stop auto-play when user manually navigates
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  if (!slides.length) {
    return (
      <div style={{
        width: '100%',
        height: '400px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, #87A96B20, #87A96B10)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
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
      height: '400px',
      borderRadius: '24px',
      position: 'relative',
      overflow: 'hidden',
      background: '#f5f5f5'
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{
            duration: 0.8,
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
          {/* Image with next/image and priority */}
          {currentSlide.imageUrl ? (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image
                src={currentSlide.imageUrl}
                alt={`Hero slide ${currentIndex + 1}`}
                fill
                priority={currentIndex === 0} // Priority for first slide
                style={{
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  // Fallback for image load errors
                  e.target.style.display = 'none';
                  e.target.parentElement.style.background = 'linear-gradient(135deg, #87A96B20, #87A96B10)';
                }}
              />
              
              {/* Overlay for text readability */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)'
              }} />
              
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2, // Delay text animation
                  ease: [0.4, 0, 0.2, 1]
                }}
                style={{
                  position: 'absolute',
                  bottom: '2rem',
                  left: '2rem',
                  right: '2rem',
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  zIndex: 2
                }}
              >
                <h2 style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  margin: '0 0 0.5rem 0',
                  lineHeight: '1.2'
                }}>
                  {currentSlide.title || 'Cat-Safe Plants'}
                </h2>
                <p style={{
                  fontSize: '1.25rem',
                  margin: '0 0 1rem 0',
                  lineHeight: '1.4',
                  opacity: 0.95
                }}>
                  {currentSlide.subtitle || 'Creating pet-friendly spaces'}
                </p>
                {currentSlide.link && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href={currentSlide.link}>
                      <div style={{
                        display: 'inline-block',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#87A96B',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(135, 169, 107, 0.3)',
                        cursor: 'pointer'
                      }}>
                        Learn More →
                      </div>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </div>
          ) : (
            // Fallback when no image
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #87A96B20, #87A96B10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2
                }}
                style={{ textAlign: 'center', color: '#87A96B' }}
              >
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🌿</div>
                <h2 style={{ fontSize: '24px', margin: 0 }}>
                  {currentSlide.title || 'Cat-Safe Plants'}
                </h2>
                <p style={{ fontSize: '16px', margin: '0.5rem 0', opacity: 0.8 }}>
                  {currentSlide.subtitle || 'Creating pet-friendly spaces'}
                </p>
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToPrevious}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: '#87A96B',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 3,
              transition: 'all 0.3s ease'
            }}
          >
            ←
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToNext}
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: '#87A96B',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 3,
              transition: 'all 0.3s ease'
            }}
          >
            →
          </motion.button>
        </>
      )}

      {/* Navigation Dots */}
      {slides.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 3
        }}>
          {slides.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => goToSlide(index)}
              style={{
                width: currentIndex === index ? '32px' : '12px',
                height: '12px',
                borderRadius: '6px',
                backgroundColor: currentIndex === index ? '#87A96B' : 'rgba(255, 255, 255, 0.5)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              layout
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
