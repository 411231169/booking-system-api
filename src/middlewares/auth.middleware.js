const { verifyToken } = require('../utils/jwt');
const { AppError } = require('./error.middleware');
const { User } = require('../models');

const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Check if user still exists
    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }
    
    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    next(new AppError('Authentication failed, invalid or expired token', 401));
  }
};

module.exports = protect;
