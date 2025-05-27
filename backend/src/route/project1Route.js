const express = require('express');
const router = express.Router();
const Project1Controller = require('../controller/project1Controller');

router.get('/:p_ID', Project1Controller.getByProjectId);
router.post('/create', Project1Controller.create);
router.put('/update/:pj1_ID', Project1Controller.update);

module.exports = router;