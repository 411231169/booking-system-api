const { ResponseCode } = require('../../utils/responseEnums');
const { StatusCodes } = require('http-status-codes');
const userService = require('./user.service');
const { sendSuccessSingle, sendSuccessList } = require('../../utils/response');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const data = await userService.getAllUsers(req.query);
      return sendSuccessList(res, StatusCodes.OK, ResponseCode.USERS_RETRIEVED, data, null);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const data = await userService.getUserById(req.params.id);
      return sendSuccessSingle(res, StatusCodes.OK, ResponseCode.USER_RETRIEVED, data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
