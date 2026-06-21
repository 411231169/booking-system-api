const { ResponseMessage } = require('../../utils/responseEnums');
const { StatusCodes } = require('http-status-codes');
const paymentService = require('./payment.service');
const { sendSuccessSingle, sendSuccessList } = require('../../utils/response');

class PaymentController {
  async createPayment(req, res, next) {
    try {
      const data = await paymentService.createPayment(req.user.id, req.body);
      return sendSuccessSingle(res, StatusCodes.CREATED, ResponseMessage.PAYMENT_SUBMITTED, data);
    } catch (error) {
      next(error);
    }
  }

  async getAllPayments(req, res, next) {
    try {
      const data = await paymentService.getAllPayments(req.query);
      return sendSuccessList(res, StatusCodes.OK, ResponseMessage.PAYMENTS_RETRIEVED, data, null);
    } catch (error) {
      next(error);
    }
  }

  async verifyPayment(req, res, next) {
    try {
      const data = await paymentService.updatePaymentStatus(req.params.id, req.user.id, 'VERIFIED');
      return sendSuccessSingle(res, StatusCodes.OK, ResponseMessage.PAYMENT_VERIFIED, data);
    } catch (error) {
      next(error);
    }
  }

  async rejectPayment(req, res, next) {
    try {
      const data = await paymentService.updatePaymentStatus(req.params.id, req.user.id, 'REJECTED');
      return sendSuccessSingle(res, StatusCodes.OK, ResponseMessage.PAYMENT_REJECTED, data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();
