const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/users/user.routes');
const fieldRoutes = require('../modules/fields/field.routes');
const bookingRoutes = require('../modules/bookings/booking.routes');
const paymentRoutes = require('../modules/payments/payment.routes');

router.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/fields', fieldRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;
