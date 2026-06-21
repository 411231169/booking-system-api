const { StatusCodes } = require('http-status-codes');
const logger = require('../config/logger');
const { sendGeneralError, sendValidationError } = require('../utils/response');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorMiddleware = (err, req, res, next) => {
  let { statusCode, message } = err;
  
  if (!statusCode) statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  
  if (process.env.NODE_ENV !== 'test') {
    logger.error(err);
  }

  // Handle Specific Errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const formatErrors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    return sendValidationError(res, 'Validation Error', formatErrors);
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = 'Token expired';
  }

  const finalMessage = statusCode === StatusCodes.INTERNAL_SERVER_ERROR && process.env.NODE_ENV === 'production' ? 'Internal Server Error' : (message || 'Internal Server Error');
  const errorsArray = [];
  
  // Optional: Send stack trace in dev mode as an error detail
  if (process.env.NODE_ENV === 'development' && err.stack) {
    // We could push stack trace to errors array, but template expects field/message
    // errorsArray.push({ field: 'stack', message: err.stack });
  }

  return sendGeneralError(res, statusCode, finalMessage, errorsArray);
};

module.exports = {
  AppError,
  errorMiddleware
};
