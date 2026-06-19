const paymentService = require('./payment.service');
const { sendSuccess } = require('../../utils/response');

class PaymentController {
  async createPayment(req, res, next) {
    try {
      const data = await paymentService.createPayment(req.user.id, req.body);
      return sendSuccess(res, 201, 'Payment submitted successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async getAllPayments(req, res, next) {
    try {
      const data = await paymentService.getAllPayments(req.query);
      return sendSuccess(res, 200, 'Payments retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async verifyPayment(req, res, next) {
    try {
      const data = await paymentService.updatePaymentStatus(req.params.id, req.user.id, 'VERIFIED');
      return sendSuccess(res, 200, 'Payment verified successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async rejectPayment(req, res, next) {
    try {
      const data = await paymentService.updatePaymentStatus(req.params.id, req.user.id, 'REJECTED');
      return sendSuccess(res, 200, 'Payment rejected successfully', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();
