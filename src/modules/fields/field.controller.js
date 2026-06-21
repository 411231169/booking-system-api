const { ResponseCode } = require('../../utils/responseEnums');
const { StatusCodes } = require('http-status-codes');
const fieldService = require('./field.service');
const { sendSuccessSingle, sendSuccessList } = require('../../utils/response');

class FieldController {
  async getAllFields(req, res, next) {
    try {
      const data = await fieldService.getAllFields(req.query);
      return sendSuccessList(res, StatusCodes.OK, ResponseCode.FIELDS_RETRIEVED, data, null);
    } catch (error) {
      next(error);
    }
  }

  async getFieldById(req, res, next) {
    try {
      const data = await fieldService.getFieldById(req.params.id);
      return sendSuccessSingle(res, StatusCodes.OK, ResponseCode.FIELD_RETRIEVED, data);
    } catch (error) {
      next(error);
    }
  }

  async createField(req, res, next) {
    try {
      const data = await fieldService.createField(req.body);
      return sendSuccessSingle(res, StatusCodes.CREATED, ResponseCode.FIELD_CREATED, data);
    } catch (error) {
      next(error);
    }
  }

  async updateField(req, res, next) {
    try {
      const data = await fieldService.updateField(req.params.id, req.body);
      return sendSuccessSingle(res, StatusCodes.OK, ResponseCode.FIELD_UPDATED, data);
    } catch (error) {
      next(error);
    }
  }

  async deleteField(req, res, next) {
    try {
      await fieldService.deleteField(req.params.id);
      return sendSuccessSingle(res, StatusCodes.OK, ResponseCode.FIELD_DELETED);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FieldController();
