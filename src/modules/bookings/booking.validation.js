const { body } = require('express-validator');

const createBookingValidation = [
  body('field_id').notEmpty().withMessage('Field ID is required').isInt(),
  body('booking_date').notEmpty().withMessage('Booking date is required').isDate(),
  body('start_time').notEmpty().withMessage('Start time is required').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time format (HH:mm)'),
  body('end_time').notEmpty().withMessage('End time is required').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid end time format (HH:mm)'),
  body('notes').optional().isString()
];

module.exports = {
  createBookingValidation
};
