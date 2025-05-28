const express = require('express');
const router = express.Router();
const Project2Controller = require('../controller/project2Controller');

router.get('/:p_ID', Project2Controller.getByProjectId);
router.post('/create', Project2Controller.create);
router.put('/update/:pj2_ID', Project2Controller.update);

module.exports = router;