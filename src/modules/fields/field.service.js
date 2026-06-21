const { ResponseCode } = require('../../utils/responseEnums');
const { StatusCodes } = require('http-status-codes');
const { Field } = require('../../models');
const { getPagination, getPagingData } = require('../../utils/pagination');
const { AppError } = require('../../middlewares/error.middleware');
const { Op } = require('sequelize');

class FieldService {
  async getAllFields(query) {
    const { page, limit, search, sortBy = 'created_at', sortOrder = 'DESC', is_active } = query;
    const { limit: limitValue, offset } = getPagination(page, limit);

    const condition = {};
    if (search) {
      condition.name = { [Op.like]: `%${search}%` };
    }
    if (is_active !== undefined) {
      condition.is_active = is_active === 'true';
    }

    const fields = await Field.findAndCountAll({
      where: condition,
      limit: limitValue,
      offset,
      order: [[sortBy, sortOrder]]
    });

    return getPagingData(fields, page, limitValue);
  }

  async getFieldById(id) {
    const field = await Field.findByPk(id);
    if (!field) {
      throw new AppError(ResponseCode.FIELD_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    return field;
  }

  async createField(data) {
    return await Field.create(data);
  }

  async updateField(id, data) {
    const field = await this.getFieldById(id);
    return await field.update(data);
  }

  async deleteField(id) {
    const field = await this.getFieldById(id);
    // Hard delete or soft delete depending on business logic
    // We do hard delete as requested
    await field.destroy();
    return true;
  }
}

module.exports = new FieldService();
