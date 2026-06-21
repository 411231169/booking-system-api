const { ResponseMessage } = require('../../utils/responseEnums');
const { StatusCodes } = require('http-status-codes');
const authService = require('./auth.service');
const { sendSuccessSingle, sendSuccessList } = require('../../utils/response');

class AuthController {
  async register(req, res, next) {
    try {
      await authService.register(req.body);
      return sendSuccessSingle(res, StatusCodes.CREATED, ResponseMessage.REGISTER_SUCCESS);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);
      return sendSuccessSingle(res, StatusCodes.OK, ResponseMessage.LOGIN_SUCCESS, data);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      return sendSuccessSingle(res, StatusCodes.OK, ResponseMessage.PROFILE_RETRIEVED, user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
