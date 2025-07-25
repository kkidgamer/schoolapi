express= require('express');
const router = express.Router();
const adminDash= require('../controller/adminDash');
// authorization middleware
const { auth, authorizeRoles } = require('../middlware/auth');

router.get('/stats', auth, authorizeRoles('admin'), adminDash.adminDashStats);
module.exports = router;