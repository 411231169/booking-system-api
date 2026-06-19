const { Payment, Booking, User } = require('../../models');
const { getPagination, getPagingData } = require('../../utils/pagination');
const { AppError } = require('../../middlewares/error.middleware');

class PaymentService {
  async getAllPayments(query) {
    const { page, limit, status, sortBy = 'created_at', sortOrder = 'DESC' } = query;
    const { limit: limitValue, offset } = getPagination(page, limit);

    const condition = {};
    if (status) {
      condition.status = status;
    }

    const payments = await Payment.findAndCountAll({
      where: condition,
      limit: limitValue,
      offset,
      order: [[sortBy, sortOrder]],
      include: [
        { 
          model: Booking, 
          as: 'booking',
          include: [{ model: User, as: 'user', attributes: ['id', 'name'] }]
        },
        { model: User, as: 'verifier', attributes: ['id', 'name'] }
      ]
    });

    return getPagingData(payments, page, limitValue);
  }

  async getPaymentById(id) {
    const payment = await Payment.findByPk(id, {
      include: [
        { model: Booking, as: 'booking' },
        { model: User, as: 'verifier', attributes: ['id', 'name'] }
      ]
    });

    if (!payment) {
      throw new AppError('Payment not found', 404);
    }
    return payment;
  }

  async createPayment(userId, data) {
    const { booking_id, proof_url } = data;

    // Verify booking
    const booking = await Booking.findByPk(booking_id);
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }
    if (booking.user_id !== userId) {
      throw new AppError('You can only pay for your own booking', 403);
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ where: { booking_id } });
    if (existingPayment) {
      throw new AppError('Payment for this booking already exists', 400);
    }

    const payment = await Payment.create({
      booking_id,
      proof_url,
      status: 'PENDING'
    });

    return payment;
  }

  async updatePaymentStatus(id, adminId, status) {
    const payment = await this.getPaymentById(id);
    
    await payment.update({ 
      status,
      verified_by: adminId,
      verified_at: new Date()
    });

    // Optionally update booking status as well based on payment status
    if (status === 'VERIFIED') {
      const booking = await Booking.findByPk(payment.booking_id);
      if (booking) {
        await booking.update({ status: 'APPROVED' });
      }
    }

    return payment;
  }
}

module.exports = new PaymentService();
