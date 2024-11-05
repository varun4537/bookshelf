const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    // Check for Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'No Authorization header' });
    }

    // Extract token from Bearer
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      next();
    } catch (err) {
      console.log('Token verification failed:', err.message);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.log('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Authentication required' });
  }
};

module.exports = auth;