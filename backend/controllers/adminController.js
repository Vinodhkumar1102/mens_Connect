const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

/**
 * Generate JWT
 */
const generateToken = (adminId) => {
  return jwt.sign(
    { id: adminId },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

/**
 * Register Admin (run once)
 * POST /api/admin/register
 */
// const Admin = require('../models/Admin');

exports.registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required',
      });
    }

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists',
      });
    }

    const admin = await Admin.create({ email, password });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/**
 * Admin Login
 * POST /api/admin/login
 */

/**
 * ADMIN LOGOUT
 * POST /api/admin/logout
 */
exports.logoutAdmin = async (req, res) => {
  try {
    // JWT is stateless → nothing to destroy on server
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    res.json({
      success: true,
      token: generateToken(admin._id),
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
