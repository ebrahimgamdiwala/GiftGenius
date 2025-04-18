const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to verify JWT token and set user in request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const verifyToken = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    if (!req.headers.authorization) {
      console.log('No Authorization header found');
      return res.status(401).json({ message: 'No Authorization header provided' });
    }

    // Extract token from Authorization header
    const authParts = req.headers.authorization.split(' ');
    if (authParts.length !== 2 || authParts[0] !== 'Bearer') {
      console.log('Invalid Authorization format:', req.headers.authorization);
      return res.status(401).json({ message: 'Invalid Authorization format. Use: Bearer <token>' });
    }

    const token = authParts[1];
    if (!token) {
      console.log('Empty token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify JWT token
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId) {
      console.log('Token missing userId:', decoded);
      return res.status(401).json({ message: 'Invalid token structure' });
    }

    // Find user in database
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log('User not found for ID:', decoded.userId);
      return res.status(401).json({ message: 'User not found' });
    }

    // Set user ID in request object
    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token: ' + error.message });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = { verifyToken };
