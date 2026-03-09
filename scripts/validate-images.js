#!/usr/bin/env node

/**
 * Validate Image URLs
 * 验证图片URL的可用性
 */

const https = require('https');

function checkImage(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      resolve({
        url,
        statusCode: res.statusCode,
        contentType: res.headers['content-type'],
        success: res.statusCode === 200
      });
    });
    
    req.on('error', () => {
      resolve({
        url,
        statusCode: 0,
        success: false
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        url,
        statusCode: 0,
        success: false
      });
    });
  });
}

async function validateImages() {
  const urls = [
    'https://images.unsplash.com/photo-1416879595882-d33bcbe8c131?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1494537176433-7aecd67984ab?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1520302618106-4e2f8dc772b1?w=800&h=600&fit=crop'
  ];
  
  console.log('🔍 验证图片URL可用性');
  console.log('');
  
  for (const url of urls) {
    try {
      const result = await checkImage(url);
      console.log(`${result.success ? '✅' : '❌'} ${result.statusCode} - ${url.substring(50, 90)}...`);
    } catch (error) {
      console.log(`❌ 错误 - ${url.substring(50, 90)}...`);
    }
  }
}

if (require.main === module) {
  validateImages();
}
