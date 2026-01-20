const express = require('express');
const router = express.Router();

const { protectAdmin } = require('../middleware/adminAuth');
const UserProfile = require('../models/UserProfile');

/**
 * GET all users (Admin only)
 * GET /api/admin/users
 */
router.get('/users', protectAdmin, async (req, res) => {
  try {
    const users = await UserProfile.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/**
 * GET single user by phone (Admin only)
 * GET /api/admin/users/:phone
 */
router.get('/users/:phone', protectAdmin, async (req, res) => {
  try {
    const { phone } = req.params;

    const user = await UserProfile.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/**
 * BLOCK / UNBLOCK user (Admin only)
 * PUT /api/admin/users/:phone/status
 */
router.put('/users/:phone/status', protectAdmin, async (req, res) => {
  try {
    const { phone } = req.params;
    const { isActive } = req.body;

    const user = await UserProfile.findOneAndUpdate(
      { phone },
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'blocked'} successfully`,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/**
 * DELETE user permanently (Admin only)
 * DELETE /api/admin/users/:phone
 */
router.delete('/users/:phone', protectAdmin, async (req, res) => {
  try {
    const { phone } = req.params;

    const user = await UserProfile.findOneAndDelete({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User deleted permanently',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
