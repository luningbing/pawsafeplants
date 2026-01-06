import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default function authMiddleware(handler) {
  return async (req, res) => {
    // Skip authentication for login page
    if (req.url === '/admin-login' || req.url === '/api/admin-login') {
      return handler(req, res);
    }

    // Check for token in Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Add user info to request
      req.user = decoded;
      
      // Continue to the requested handler
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}
