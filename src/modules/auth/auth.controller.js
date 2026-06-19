const authService = require('./auth.service');
const { sendSuccess } = require('../../utils/response');

class AuthController {
  async register(req, res, next) {
    try {
      await authService.register(req.body);
      return sendSuccess(res, 201, 'Register successful');
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);
      return sendSuccess(res, 200, 'Login successful', data);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      return sendSuccess(res, 200, 'Profile retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
