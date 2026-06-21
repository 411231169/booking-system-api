const { StatusCodes } = require('http-status-codes');
const { User } = require('../../models');
const { getPagination, getPagingData } = require('../../utils/pagination');
const { AppError } = require('../../middlewares/error.middleware');
const { Op } = require('sequelize');

class UserService {
  async getAllUsers(query) {
    const { page, limit, search, sortBy = 'created_at', sortOrder = 'DESC' } = query;
    const { limit: limitValue, offset } = getPagination(page, limit);

    const condition = search ? {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ]
    } : null;

    const users = await User.findAndCountAll({
      where: condition,
      limit: limitValue,
      offset,
      order: [[sortBy, sortOrder]],
      attributes: { exclude: ['password'] }
    });

    return getPagingData(users, page, limitValue);
  }

  async getUserById(id) {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      throw new AppError(ResponseMessage.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    
    return user;
  }
}

module.exports = new UserService();
