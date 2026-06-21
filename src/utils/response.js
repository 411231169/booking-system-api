const { StatusCodes } = require('http-status-codes');

// Generate APP-20001, APP-40001, etc.
const generateAppCode = (statusCode) => `APP-${statusCode}01`;

const sendSuccessSingle = (res, statusCode = StatusCodes.OK, message = 'Success', detail = {}) => {
  return res.status(statusCode).json({
    response_code: generateAppCode(statusCode),
    message,
    data: {
      detail
    },
    meta: null
  });
};

const sendSuccessList = (res, statusCode = StatusCodes.OK, message = 'Success', list = [], meta = null) => {
  return res.status(statusCode).json({
    response_code: generateAppCode(statusCode),
    message,
    data: {
      list
    },
    meta
  });
};

const sendValidationError = (res, message = 'Bad Request', errors = []) => {
  const statusCode = StatusCodes.BAD_REQUEST;
  return res.status(statusCode).json({
    response_code: generateAppCode(statusCode),
    message,
    data: {
      errors
    },
    meta: null
  });
};

const sendGeneralError = (res, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, message = 'Error message', errors = []) => {
  return res.status(statusCode).json({
    response_code: generateAppCode(statusCode),
    message,
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
