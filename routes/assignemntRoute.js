const express = require('express');
const router = express.Router();
const classroomController = require('../controller/assignmentController');
// authorization middleware
const { auth, authorizeRoles } = require('../middlware/auth');
// router.post('/',auth, authorizeRoles("admin"), classroomController.addClassroom);
router.get('/',auth, classroomController.getAllAssignments);
router.post('/',auth,authorizeRoles('teacher'),classroomController.addAssignment)
router.get('/:id',auth, classroomController.getAssignmentById);
router.put('/:id',auth, authorizeRoles("teacher"), classroomController.updateAssignment);
router.delete('/:id',auth, authorizeRoles("teacher"), classroomController.deleteAssignment);
module.exports = router;