const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');
const { createPaymentValidation } = require('./payment.validation');
const validate = require('../../middlewares/validate.middleware');
const protect = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');

router.use(protect);

// Customer Route
router.post('/', authorize('CUSTOMER'), createPaymentValidation, validate, paymentController.createPayment);

// Admin Routes
router.get('/', authorize('ADMIN'), paymentController.getAllPayments);
router.patch('/:id/verify', authorize('ADMIN'), paymentController.verifyPayment);
router.patch('/:id/reject', authorize('ADMIN'), paymentController.rejectPayment);

module.exports = router;
