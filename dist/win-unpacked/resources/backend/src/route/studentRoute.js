const express = require('express');
const router = express.Router();
const StudentController = require('../controller/studentController');

router.get('/all', StudentController.getAllStudents);

module.exports = router;