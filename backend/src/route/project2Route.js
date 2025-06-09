const express = require('express');
const router = express.Router();
const Project2Controller = require('../controller/project2Controller');

router.post('/', Project2Controller.create);
router.post('/create', Project2Controller.create);
router.put('/update/:pj2_ID', Project2Controller.update);
router.get('/:p_ID', Project2Controller.getByProjectId);

module.exports = router;