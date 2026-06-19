const { body } = require('express-validator');

const createFieldValidation = [
  body('name').notEmpty().withMessage('Field name is required').trim(),
  body('price_per_hour').isNumeric().withMessage('Price per hour must be a number'),
  body('description').optional().isString(),
  body('is_active').optional().isBoolean()
];

const updateFieldValidation = [
  body('name').optional().notEmpty().withMessage('Field name cannot be empty').trim(),
  body('price_per_hour').optional().isNumeric().withMessage('Price per hour must be a number'),
  body('description').optional().isString(),
  body('is_active').optional().isBoolean()
];

module.exports = {
  createFieldValidation,
  updateFieldValidation
};
