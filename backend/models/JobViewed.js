const mongoose = require('mongoose');

const jobViewedSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  viewedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index for faster queries
jobViewedSchema.index({ userId: 1, jobId: 1 });

module.exports = mongoose.model('JobViewed', jobViewedSchema);
