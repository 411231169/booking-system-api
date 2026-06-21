const { StatusCodes } = require('http-status-codes');
const logger = require('../config/logger');
const { sendGeneralError, sendValidationError } = require('../utils/response');
const { ResponseCode } = require('../utils/responseEnums');

class AppError extends Error {
  constructor(responseCodeEnum, statusCode) {
    super(responseCodeEnum && responseCodeEnum.message ? responseCodeEnum.message : responseCodeEnum);
    this.statusCode = statusCode;
    this.responseCodeEnum = responseCodeEnum;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorMiddleware = (err, req, res, next) => {
  let { statusCode, responseCodeEnum } = err;
  
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
    return sendValidationError(res, ResponseCode.VALIDATION_ERROR, formatErrors);
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = StatusCodes.UNAUTHORIZED;
    responseCodeEnum = ResponseCode.TOKEN_INVALID;
  } else if (err.name === 'TokenExpiredError') {
    statusCode = StatusCodes.UNAUTHORIZED;
    responseCodeEnum = ResponseCode.TOKEN_INVALID;
  }

  // Fallback to INTERNAL_SERVER_ERROR if no specific enum is provided
  const finalResponseCode = responseCodeEnum || ResponseCode.INTERNAL_SERVER_ERROR;
  const errorsArray = [];
  
  return sendGeneralError(res, statusCode, finalResponseCode, errorsArray);
};

module.exports = {
  AppError,
  errorMiddleware
};
