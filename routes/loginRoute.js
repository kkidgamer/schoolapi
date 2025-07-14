const express = require('express');
const router = express.Router();
const loginController = require('../controller/loginController');
router.post('/register', loginController.registerAdmin);

module.exports = router;