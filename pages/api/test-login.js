export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;
      
      // 验证凭据
      if (username === 'laifu' && password === 'lailaifu') {
        // 生成简单的token
        const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
        
        return res.status(200).json({
          success: true,
          token: token,
          username: username,
          timestamp: new Date().toISOString()
        });
      } else {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  // 如果是GET请求，显示使用说明
  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'Please use POST method to login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        username: 'laifu',
        password: 'lailaifu'
      }
    });
  }
  
  return res.status(405).json({
    error: 'Method Not Allowed'
  });
}
