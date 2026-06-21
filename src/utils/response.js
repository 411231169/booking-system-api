const { StatusCodes } = require('http-status-codes');
const { ResponseCode } = require('./responseEnums');

const sendSuccessSingle = (res, statusCode = StatusCodes.OK, responseCode = ResponseCode.SUCCESS, detail = {}) => {
  return res.status(statusCode).json({
    response_code: responseCode.code,
    message: responseCode.message,
    data: {
      detail
    },
    meta: null
  });
};

const sendSuccessList = (res, statusCode = StatusCodes.OK, responseCode = ResponseCode.SUCCESS, list = [], meta = null) => {
  return res.status(statusCode).json({
    response_code: responseCode.code,
    message: responseCode.message,
    data: {
      list
    },
    meta
  });
};

const sendValidationError = (res, responseCode = ResponseCode.VALIDATION_ERROR, errors = []) => {
  return res.status(StatusCodes.BAD_REQUEST).json({
    response_code: responseCode.code,
    message: responseCode.message,
    data: {
      errors
    },
    meta: null
  });
};

const sendGeneralError = (res, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, responseCode = ResponseCode.INTERNAL_SERVER_ERROR, errors = []) => {
  return res.status(statusCode).json({
    response_code: responseCode.code,
    message: responseCode.message,
    data: {
      errors
    },
    meta: null
  });
};

module.exports = {
  sendSuccessSingle,
  sendSuccessList,
  sendValidationError,
  sendGeneralError
};
