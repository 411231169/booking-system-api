const { StatusCodes } = require('http-status-codes');
const { Booking, Field, User } = require('../../models');
const { getPagination, getPagingData } = require('../../utils/pagination');
const { AppError } = require('../../middlewares/error.middleware');
const { checkBookingConflict } = require('../../utils/bookingValidator');
const { Op } = require('sequelize');

class BookingService {
  async getAllBookings(query, userId = null) {
    const { page, limit, status, sortBy = 'created_at', sortOrder = 'DESC' } = query;
    const { limit: limitValue, offset } = getPagination(page, limit);

    const condition = {};
    if (status) {
      condition.status = status;
    }
    if (userId) {
      condition.user_id = userId;
    }

    const bookings = await Booking.findAndCountAll({
      where: condition,
      limit: limitValue,
      offset,
      order: [[sortBy, sortOrder]],
      include: [
        { model: Field, as: 'field', attributes: ['id', 'name', 'price_per_hour'] },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ]
    });

    return getPagingData(bookings, page, limitValue);
  }

  async getBookingById(id, userId = null, role = null) {
    const booking = await Booking.findByPk(id, {
      include: [
        { model: Field, as: 'field' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }
      ]
    });

    if (!booking) {
      throw new AppError(ResponseMessage.BOOKING_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    if (role === 'CUSTOMER' && booking.user_id !== userId) {
      throw new AppError(ResponseMessage.NO_PERMISSION_BOOKING, StatusCodes.FORBIDDEN);
    }

    return booking;
  }

  async createBooking(userId, data) {
    const { field_id, booking_date, start_time, end_time, notes } = data;

    // Check if field exists and is active
    const field = await Field.findByPk(field_id);
    if (!field) {
      throw new AppError(ResponseMessage.FIELD_NOT_FOUND, StatusCodes.NOT_FOUND);
    }
    if (!field.is_active) {
      throw new AppError(ResponseMessage.FIELD_NOT_ACTIVE, StatusCodes.BAD_REQUEST);
    }

    // Calculate duration in hours
    const start = new Date(`1970-01-01T${start_time}Z`);
    const end = new Date(`1970-01-01T${end_time}Z`);
    const duration = (end - start) / (1000 * 60 * 60);

    if (duration <= 0) {
      throw new AppError(ResponseMessage.END_TIME_ERROR, StatusCodes.BAD_REQUEST);
    }

    // Check for double booking conflict
    const isConflict = await checkBookingConflict(field_id, booking_date, start_time, end_time);
    if (isConflict) {
      throw new AppError(ResponseMessage.CONFLICT_BOOKING, StatusCodes.CONFLICT);
    }

    const total_price = field.price_per_hour * duration;

    const booking = await Booking.create({
      user_id: userId,
      field_id,
      booking_date,
      start_time,
      end_time,
      duration,
      total_price,
      notes,
      status: 'PENDING'
    });

    return booking;
  }

  async updateBookingStatus(id, status) {
    const booking = await this.getBookingById(id);
    
    // Additional logic can be added here, e.g. checking conflict again before approval
    if (status === 'APPROVED' && booking.status !== 'APPROVED') {
      const isConflict = await checkBookingConflict(
        booking.field_id, 
        booking.booking_date, 
        booking.start_time, 
        booking.end_time, 
        booking.id
      );
      if (isConflict) {
        throw new AppError(ResponseMessage.CONFLICT_APPROVE, StatusCodes.CONFLICT);
      }
    }

    await booking.update({ status });
    return booking;
  }
}

module.exports = new BookingService();
