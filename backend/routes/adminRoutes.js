const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController');


router.post('/register', controller.registerAdmin);
router.post('/login', controller.loginAdmin);
router.post('/logout', controller.logoutAdmin);

module.exports = router;
