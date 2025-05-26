const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');

router.get('/all', UserController.getAllUsers);

module.exports = router;