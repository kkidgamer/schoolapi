const express =require('express');
const router = express.Router();
const teacherController = require('../controller/teacherController');

const { auth, authorizeRoles } = require('../middlware/auth');
router.post('/', auth, authorizeRoles("admin"), teacherController.addTeacher);
// router.get('/', auth, teacherController.getAllTeachers);
router.get('/:id', auth, teacherController.getTeacherById);
router.get('/', auth, authorizeRoles("teacher"), teacherController.getMyClasses);
router.put('/:id', auth, authorizeRoles("admin","teacher"), teacherController.updateTeacher);
router.delete('/:id', auth, authorizeRoles("admin"), teacherController.deleteTeacher);
module.exports=router