import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware function to protect admin routes
export default function middleware(req, res) {
  // Skip authentication for login page and login API
  if (req.url === '/login' || req.url === '/api/login') {
    return;
  }

  // Check for admin routes
  if (req.url?.startsWith('/admin') || req.url?.startsWith('/api/admin')) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      // Redirect to login page for browser requests
      if (req.method === 'GET') {
        res.writeHead(302, {
          Location: '/login'
        });
        res.end();
        return;
      } else {
        // Return 401 for API requests
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
    }

    try {
      // Verify token
      jwt.verify(token, JWT_SECRET);
      // Token is valid, continue
    } catch (error) {
      // Token is invalid
      if (req.method === 'GET') {
        res.writeHead(302, {
          Location: '/login'
        });
        res.end();
        return;
      } else {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }
    }
  }
}
