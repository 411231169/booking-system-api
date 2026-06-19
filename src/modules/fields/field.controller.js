const fieldService = require('./field.service');
const { sendSuccess } = require('../../utils/response');

class FieldController {
  async getAllFields(req, res, next) {
    try {
      const data = await fieldService.getAllFields(req.query);
      return sendSuccess(res, 200, 'Fields retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async getFieldById(req, res, next) {
    try {
      const data = await fieldService.getFieldById(req.params.id);
      return sendSuccess(res, 200, 'Field retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async createField(req, res, next) {
    try {
      const data = await fieldService.createField(req.body);
      return sendSuccess(res, 201, 'Field created successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async updateField(req, res, next) {
    try {
      const data = await fieldService.updateField(req.params.id, req.body);
      return sendSuccess(res, 200, 'Field updated successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async deleteField(req, res, next) {
    try {
      await fieldService.deleteField(req.params.id);
      return sendSuccess(res, 200, 'Field deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FieldController();
