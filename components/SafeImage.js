import React, { useState, useCallback } from 'react';
import Image from 'next/image';

const SafeImage = ({ 
  src, 
  alt, 
  width = 800, 
  height = 600, 
  className = '', 
  priority = false,
  fallbackSrc = '/images/plant-placeholder.jpg',
  maxRetries = 3 
}) => {
  const [retryCount, setRetryCount] = useState(0);
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    if (retryCount < maxRetries) {
      // 增加重试延迟
      const delay = Math.pow(2, retryCount) * 1000; // 指数退避
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setImageSrc(src); // 重试原始URL
        setHasError(false);
      }, delay);
    } else {
      // 达到最大重试次数，使用备用图片
      setImageSrc(fallbackSrc);
      setHasError(true);
    }
    setIsLoading(false);
  }, [src, retryCount, maxRetries, fallbackSrc]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${hasError ? 'opacity-50' : ''} ${className}`}
        priority={priority}
        onError={handleError}
        onLoad={handleLoad}
        unoptimized={true} // 禁用Next.js图片优化，直接使用原始URL
      />
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center p-4">
            <div className="text-gray-500 text-sm mb-2">Image unavailable</div>
            <div className="text-gray-400 text-xs">Plant: {alt}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafeImage;
