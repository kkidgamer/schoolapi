const express = require('express');
const router = express.Router();
const classroomController = require('../controller/classroomController');
// authorization middleware
const { auth, authorizeRoles } = require('../middlware/auth');
router.post('/',auth, authorizeRoles("admin"), classroomController.addClassroom);
router.get('/',auth, classroomController.getAllClassrooms);
router.get('/:id',auth, classroomController.getClassroomById);
router.put('/:id',auth, authorizeRoles("admin"), classroomController.updateClassroom);
router.delete('/:id',auth, authorizeRoles("admin"), classroomController.deleteClassroom);


module.exports = router;