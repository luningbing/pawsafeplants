import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  // If no slides, show default hero
  if (slides.length === 0) {
    return (
      <div style={{
        position: 'relative',
        width: '100%',
        height: '500px',
        backgroundColor: '#87A96B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '0 0 24px 24px',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #87A96B 0%, #6B8553 100%)',
          opacity: 0.9
        }} />
        <div style={{
          position: 'relative',
          textAlign: 'center',
          color: 'white',
          padding: '2rem',
          maxWidth: '800px'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            🐱 PawSafePlants
          </h1>
          <p style={{
            fontSize: '1.5rem',
            marginBottom: '2rem',
            opacity: 0.9,
            lineHeight: 1.6
          }}>
            Keep your cats safe around houseplants
          </p>
          <Link
            href="/plants"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              backgroundColor: 'white',
              color: '#87A96B',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: '600',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            }}
          >
            Explore Plants →
          </Link>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '500px',
      borderRadius: '0 0 24px 24px',
      overflow: 'hidden',
      backgroundColor: '#f5f5f5'
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {currentSlide.image ? (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <img
                src={currentSlide.image}
                alt={`Hero slide ${currentIndex + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  textAlign: 'center',
                  color: 'white',
                  padding: '2rem',
                  maxWidth: '800px'
                }}>
                  <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }}>
                    🐱 PawSafePlants
                  </h1>
                  <p style={{
                    fontSize: '1.5rem',
                    marginBottom: '2rem',
                    opacity: 0.9,
                    lineHeight: 1.6
                  }}>
                    Keep your cats safe around houseplants
                  </p>
                  {currentSlide.link ? (
                    <Link
                      href={currentSlide.link}
                      style={{
                        display: 'inline-block',
                        padding: '1rem 2rem',
                        backgroundColor: 'white',
                        color: '#87A96B',
                        textDecoration: 'none',
                        borderRadius: '50px',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                      }}
                    >
                      Learn More →
                    </Link>
                  ) : (
                    <Link
                      href="/plants"
                      style={{
                        display: 'inline-block',
                        padding: '1rem 2rem',
                        backgroundColor: 'white',
                        color: '#87A96B',
                        textDecoration: 'none',
                        borderRadius: '50px',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                      }}
                    >
                      Explore Plants →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Fallback when no image is provided
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #87A96B 0%, #6B8553 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                textAlign: 'center',
                color: 'white',
                padding: '2rem',
                maxWidth: '800px'
              }}>
                <h1 style={{
                  fontSize: '3.5rem',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  🐱 PawSafePlants
                </h1>
                <p style={{
                  fontSize: '1.5rem',
                  marginBottom: '2rem',
                  opacity: 0.9,
                  lineHeight: 1.6
                }}>
                  Keep your cats safe around houseplants
                </p>
                <Link
                  href="/plants"
                  style={{
                    display: 'inline-block',
                    padding: '1rem 2rem',
                    backgroundColor: 'white',
                    color: '#87A96B',
                    textDecoration: 'none',
                    borderRadius: '50px',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                  }}
                >
                  Explore Plants →
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: '#87A96B',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              zIndex: 10
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            ‹
          </button>

          <button
            onClick={goToNext}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: '#87A96B',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              zIndex: 10
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            ›
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 10
        }}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: index === currentIndex 
                  ? 'white' 
                  : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: index === currentIndex 
                  ? '0 2px 8px rgba(0,0,0,0.3)' 
                  : '0 2px 4px rgba(0,0,0,0.2)'
              }}
              onMouseOver={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                }
              }}
              onMouseOut={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
