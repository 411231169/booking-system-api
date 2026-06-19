const bookingService = require('./booking.service');
const { sendSuccess } = require('../../utils/response');

class BookingController {
  async createBooking(req, res, next) {
    try {
      const data = await bookingService.createBooking(req.user.id, req.body);
      return sendSuccess(res, 201, 'Booking created successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async getMyBookings(req, res, next) {
    try {
      const data = await bookingService.getAllBookings(req.query, req.user.id);
      return sendSuccess(res, 200, 'My bookings retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async getAllBookings(req, res, next) {
    try {
      const data = await bookingService.getAllBookings(req.query);
      return sendSuccess(res, 200, 'All bookings retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async getBookingById(req, res, next) {
    try {
      const data = await bookingService.getBookingById(req.params.id, req.user.id, req.user.role);
      return sendSuccess(res, 200, 'Booking retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async approveBooking(req, res, next) {
    try {
      const data = await bookingService.updateBookingStatus(req.params.id, 'APPROVED');
      return sendSuccess(res, 200, 'Booking approved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async rejectBooking(req, res, next) {
    try {
      const data = await bookingService.updateBookingStatus(req.params.id, 'REJECTED');
      return sendSuccess(res, 200, 'Booking rejected successfully', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();
