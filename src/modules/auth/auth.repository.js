const { User } = require('../../models');

class AuthRepository {
  async findUserByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async findUserById(id) {
    return await User.findByPk(id);
  }

  async createUser(userData) {
    return await User.create(userData);
  }
}

module.exports = new AuthRepository();
