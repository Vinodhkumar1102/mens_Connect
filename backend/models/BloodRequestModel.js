const mongoose = require('mongoose');

const BloodRequestSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    },

    hospital: {
      type: String,
      required: true,
      trim: true,
    },

    contact: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    urgency: {
      type: String,
      enum: ['critical', 'urgent', 'normal'],
      default: 'normal',
    },

    // ✅ NEW FIELD
    additionalNotes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },

    userId: {
      type: String,
      default: 'anonymous',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ✅ Status field for approve/decline
    status: {
      type: String,
      enum: ['pending', 'approved', 'declined'],
      default: 'pending',
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    approvedBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('BloodRequest', BloodRequestSchema);
