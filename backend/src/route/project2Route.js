const express = require('express');
const router = express.Router();
const Project2Controller = require('../controller/project2Controller');

router.get('/', Project2Controller.getAll);
router.post('/', Project2Controller.create);
router.post('/create', Project2Controller.create);
router.put('/update/:pj2_ID', Project2Controller.update);
router.get('/:p_ID', Project2Controller.getByProjectId);
router.get('/by-pj1/:pj1_ID', Project2Controller.getByPj1Id);

module.exports = router;