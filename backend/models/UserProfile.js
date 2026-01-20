const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema(
  {
    // 👤 Basic Info
    fullName: {
      type: String,
      trim: true,
      default: '',
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/, // Indian number without +91
      index: true,
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'other', ''],
      default: '',
    },

    dob: {
      type: String, // YYYY-MM-DD (kept string to match UI)
      default: '',
    },

    // 🖼 Avatar (image URL / local upload later)
    avatar: {
      type: String,
      default: null,
    },

    // 🔐 Auth & Status
    isVerified: {
      type: Boolean,
      default: false, // set true after OTP verification
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // 📱 Device / App Info (optional, future use)
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

module.exports = mongoose.model('UserProfile', UserProfileSchema);
