const { body } = require('express-validator');

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').notEmpty().withMessage('Phone is required').trim(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

module.exports = {
  registerValidation,
  loginValidation
};
