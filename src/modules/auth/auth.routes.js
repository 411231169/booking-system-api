const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { registerValidation, loginValidation } = require('./auth.validation');
const validate = require('../../middlewares/validate.middleware');
const protect = require('../../middlewares/auth.middleware');

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.get('/profile', protect, authController.getProfile);

module.exports = router;
