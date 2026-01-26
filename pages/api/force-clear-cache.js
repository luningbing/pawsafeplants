export default async function handler(req, res) {
  // 强制清除缓存的响应头
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  
  res.status(200).json({ 
    success: true,
    message: 'Cache cleared successfully',
    timestamp: new Date().toISOString(),
    buildId: process.env.NEXT_BUILD_ID || 'unknown'
  });
}
