const bcrypt = require('bcrypt');
const authRepository = require('./auth.repository');
const { generateToken } = require('../../utils/jwt');
const { AppError } = require('../../middlewares/error.middleware');

class AuthService {
  async register(data) {
    const existingUser = await authRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email already in use', 400);
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
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
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
      throw new AppError('User not found', 404);
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
