const express = require('express');
const router = express.Router();
const loginController = require('../controller/loginController');
router.post('/register', loginController.registerAdmin);
router.post('/', loginController.loginAdmin);

module.exports = router;