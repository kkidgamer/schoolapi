const express = require('express');
const router = express.Router();
const loginController = require('../controller/loginController');
const { auth, authorizeRoles } = require('../middlware/auth');
router.post('/register', loginController.registerAdmin);
router.post('/', loginController.loginAdmin);
router.get('/',auth,authorizeRoles("admin"),loginController.getAllUsers)

module.exports = router;