const express =require('express');
const router = express.Router();
const studentController = require('../controller/studentController');
const { auth, authorizeRoles } = require('../middlware/auth');

router.post('/', auth, authorizeRoles("admin"),studentController.uploadStudentPhoto, studentController.addStudent);
router.get('/', auth,authorizeRoles('admin','teacher'), studentController.getAllStudents);
router.get('/:id', auth,authorizeRoles('admin','teacher'), studentController.getStudentById);

router.delete('/:id', auth, authorizeRoles("admin"), studentController.deleteStudent);
module.exports = router;