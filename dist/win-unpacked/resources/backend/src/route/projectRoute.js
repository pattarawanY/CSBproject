const express = require('express');
const router = express.Router();
const ProjectController = require('../controller/projectController');

router.get('/all', ProjectController.getAllProject);
router.get('/:id', ProjectController.getProjectById);

router.post('/create', ProjectController.createProject);

router.put('/update/:id', ProjectController.updateProject);

router.delete('/delete/:id', ProjectController.deleteProject);

module.exports = router;