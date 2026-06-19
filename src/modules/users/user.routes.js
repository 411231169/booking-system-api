const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const protect = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');

// All user routes are restricted to ADMIN only based on requirements
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

module.exports = router;
