const { StatusCodes } = require('http-status-codes');
const { AppError } = require('./error.middleware');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(ResponseMessage.FORBIDDEN, StatusCodes.FORBIDDEN));
    }
    next();
  };
};

module.exports = authorize;
