const userService = require('./user.service');
const { sendSuccess } = require('../../utils/response');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const data = await userService.getAllUsers(req.query);
      return sendSuccess(res, 200, 'Users retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const data = await userService.getUserById(req.params.id);
      return sendSuccess(res, 200, 'User retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
