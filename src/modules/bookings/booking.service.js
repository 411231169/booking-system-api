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
      throw new AppError('Booking not found', 404);
    }

    if (role === 'CUSTOMER' && booking.user_id !== userId) {
      throw new AppError('You do not have permission to view this booking', 403);
    }

    return booking;
  }

  async createBooking(userId, data) {
    const { field_id, booking_date, start_time, end_time, notes } = data;

    // Check if field exists and is active
    const field = await Field.findByPk(field_id);
    if (!field) {
      throw new AppError('Field not found', 404);
    }
    if (!field.is_active) {
      throw new AppError('Field is not active for booking', 400);
    }

    // Calculate duration in hours
    const start = new Date(`1970-01-01T${start_time}Z`);
    const end = new Date(`1970-01-01T${end_time}Z`);
    const duration = (end - start) / (1000 * 60 * 60);

    if (duration <= 0) {
      throw new AppError('End time must be after start time', 400);
    }

    // Check for double booking conflict
    const isConflict = await checkBookingConflict(field_id, booking_date, start_time, end_time);
    if (isConflict) {
      throw new AppError('Conflict Booking: The field is already booked for the selected time', 409);
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
        throw new AppError('Conflict Booking: Cannot approve as another booking overlaps', 409);
      }
    }

    await booking.update({ status });
    return booking;
  }
}

module.exports = new BookingService();
