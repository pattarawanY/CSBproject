const express = require('express');
const router = express.Router();
const Project1Controller = require('../controller/project1Controller');

router.post('/create', Project1Controller.createPj1);
router.get('/', Project1Controller.getAll);
router.get('/status/pending', Project1Controller.getPj1PendingStatus);
router.get('/status/pass', Project1Controller.getPj1PassStatus);
router.get('/status/fail', Project1Controller.getPj1FailStatus);
router.get('/status/doccomplete', Project1Controller.getPj1DoccompleteStatus);
router.get('/:p_ID', Project1Controller.getByProjectId);
router.put('/update/:pj1_ID', Project1Controller.updatePj1);

module.exports = router;