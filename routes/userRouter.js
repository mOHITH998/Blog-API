const express = require('express');
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const authController = require('../controllers/authController')

const router = express.Router();

router
.route('/')
.get(getAllUsers)

router
.route('/:id')
.get(authController.protect, getUser)

router
.route('/:id')
.put(authController.protect, updateUser)

router
.route('/:id')
.delete(authController.protect, deleteUser)

module.exports = router;
