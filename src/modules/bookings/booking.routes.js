const express = require('express');
const router = express.Router();
const bookingController = require('./booking.controller');
const { createBookingValidation } = require('./booking.validation');
const validate = require('../../middlewares/validate.middleware');
const protect = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');

router.use(protect);

// Customer Routes
router.post('/', authorize('CUSTOMER'), createBookingValidation, validate, bookingController.createBooking);
router.get('/my', authorize('CUSTOMER'), bookingController.getMyBookings);

// Admin Routes
router.get('/', authorize('ADMIN'), bookingController.getAllBookings);
router.patch('/:id/approve', authorize('ADMIN'), bookingController.approveBooking);
router.patch('/:id/reject', authorize('ADMIN'), bookingController.rejectBooking);

// Accessible by both, controller handles logic to restrict if not owner
router.get('/:id', bookingController.getBookingById);

module.exports = router;
