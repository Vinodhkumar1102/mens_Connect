const express = require('express');
const router = express.Router();
const controller = require('../controllers/userProfileController');
const uploadAvatar = require('../config/multer');

// ✅ GET ALL USERS (ADMIN)
// MUST BE FIRST
router.get('/', controller.getAllProfiles);

// CREATE / SAVE profile
router.post('/', uploadAvatar.single('avatar'), controller.saveProfile);

// UPDATE profile
router.put('/:phone', uploadAvatar.single('avatar'), controller.updateProfile);

// GET single profile
router.get('/:phone', controller.getProfile);

// DELETE profile (soft)
router.delete('/:phone', controller.deleteProfile);

module.exports = router;
