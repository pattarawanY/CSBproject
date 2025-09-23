const express = require('express');
const router = express.Router();
const TeacherController = require('../controller/teacherController');

router.get('/all', TeacherController.getAllTeachers);
router.get('/project-mentors', TeacherController.getMentorNamesForAllProjects);
router.post('/create', TeacherController.createTeacher);
router.get('/:id', TeacherController.getTeacherById);
router.put('/updateByProject/:projectId', TeacherController.updateMentorandCoMentorByProjectID);
router.put('/update/:id', TeacherController.updateTeacher);
router.delete('/delete/:id', TeacherController.deleteTeacher);

module.exports = router;