const { body } = require('express-validator');

const createPaymentValidation = [
  body('booking_id').notEmpty().withMessage('Booking ID is required').isInt(),
  body('proof_url').notEmpty().withMessage('Proof URL is required').isURL().withMessage('Must be a valid URL')
];

module.exports = {
  createPaymentValidation
};
