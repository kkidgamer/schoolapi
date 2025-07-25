const express =require('express');
const router = express.Router();
const parentDash= require('../controller/parentDashController');
const parentController = require('../controller/parentController');

const { auth, authorizeRoles } = require('../middlware/auth');
router.post('/', auth, authorizeRoles("admin"), parentController.addParent);
router.get('/children', auth,authorizeRoles("parent"), parentDash.parentDash);
router.get('/assignments/:id', auth, parentDash.getMyClassAssignments);
router.get('/', auth, parentController.getAllParents);
router.put('/:id', auth, authorizeRoles("admin"), parentController.updateParent);
router.delete('/:id', auth, authorizeRoles("admin"), parentController.deleteParent);
module.exports=router