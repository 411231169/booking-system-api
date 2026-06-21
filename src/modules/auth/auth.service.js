const { ResponseCode } = require('../../utils/responseEnums');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const authRepository = require('./auth.repository');
const { generateToken } = require('../../utils/jwt');
const { AppError } = require('../../middlewares/error.middleware');

class AuthService {
  async register(data) {
    const existingUser = await authRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new AppError(ResponseCode.EMAIL_IN_USE, StatusCodes.BAD_REQUEST);
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = await authRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };
  }

  async login(email, password) {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError(ResponseCode.INVALID_CREDENTIALS, StatusCodes.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError(ResponseCode.INVALID_CREDENTIALS, StatusCodes.UNAUTHORIZED);
    }

    const token = generateToken({ id: user.id, role: user.role });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  async getProfile(userId) {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new AppError(ResponseCode.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };
  }
}

module.exports = new AuthService();
