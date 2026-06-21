const { StatusCodes } = require('http-status-codes');
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
      return next(new AppError(ResponseMessage.UNAUTHORIZED, StatusCodes.UNAUTHORIZED));
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Check if user still exists
    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
      return next(new AppError(ResponseMessage.TOKEN_USER_DELETED, StatusCodes.UNAUTHORIZED));
    }
    
    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    next(new AppError(ResponseMessage.TOKEN_INVALID, StatusCodes.UNAUTHORIZED));
  }
};

module.exports = protect;
