const express = require('express');
const router = express.Router();
const fieldController = require('./field.controller');
const { createFieldValidation, updateFieldValidation } = require('./field.validation');
const validate = require('../../middlewares/validate.middleware');
const protect = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');

// Public routes
router.get('/', fieldController.getAllFields);
router.get('/:id', fieldController.getFieldById);

// Admin routes
router.use(protect);
router.use(authorize('ADMIN'));

router.post('/', createFieldValidation, validate, fieldController.createField);
router.put('/:id', updateFieldValidation, validate, fieldController.updateField);
router.delete('/:id', fieldController.deleteField);

module.exports = router;
