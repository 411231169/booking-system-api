const { ResponseMessage } = require('../../utils/responseEnums');
const { StatusCodes } = require('http-status-codes');
const bookingService = require('./booking.service');
const { sendSuccessSingle, sendSuccessList } = require('../../utils/response');

class BookingController {
  async createBooking(req, res, next) {
    try {
      const data = await bookingService.createBooking(req.user.id, req.body);
      return sendSuccessSingle(res, StatusCodes.CREATED, ResponseMessage.BOOKING_CREATED, data);
    } catch (error) {
      next(error);
    }
  }

  async getMyBookings(req, res, next) {
    try {
      const data = await bookingService.getAllBookings(req.query, req.user.id);
      return sendSuccessList(res, StatusCodes.OK, ResponseMessage.MY_BOOKINGS_RETRIEVED, data, null);
    } catch (error) {
      next(error);
    }
  }

  async getAllBookings(req, res, next) {
    try {
      const data = await bookingService.getAllBookings(req.query);
      return sendSuccessList(res, StatusCodes.OK, ResponseMessage.ALL_BOOKINGS_RETRIEVED, data, null);
    } catch (error) {
      next(error);
    }
  }

  async getBookingById(req, res, next) {
    try {
      const data = await bookingService.getBookingById(req.params.id, req.user.id, req.user.role);
      return sendSuccessSingle(res, StatusCodes.OK, ResponseMessage.BOOKING_RETRIEVED, data);
    } catch (error) {
      next(error);
    }
  }

  async approveBooking(req, res, next) {
    try {
      const data = await bookingService.updateBookingStatus(req.params.id, 'APPROVED');
      return sendSuccessSingle(res, StatusCodes.OK, ResponseMessage.BOOKING_APPROVED, data);
    } catch (error) {
      next(error);
    }
  }

  async rejectBooking(req, res, next) {
    try {
      const data = await bookingService.updateBookingStatus(req.params.id, 'REJECTED');
      return sendSuccessSingle(res, StatusCodes.OK, ResponseMessage.BOOKING_REJECTED, data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();
