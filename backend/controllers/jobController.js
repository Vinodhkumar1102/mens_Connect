const Job = require('../models/Job');
const Notification = require('../models/Notification');
const JobViewed = require('../models/JobViewed');
const sendPushNotification = require('../utilis/push');

// CREATE JOB (ADMIN)
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);

    // Create notification
    const notification = await Notification.create({
      title: 'New Job Alert 🚀',
      message: `${job.title} at ${job.company}`,
      jobId: job._id,
    });

    // Send push notification to all users
    const notificationData = {
      jobId: job._id.toString(),
      title: job.title,
      company: job.company,
      type: 'job_alert',
    };

    sendPushNotification(
      notification.title,
      notification.message,
      notificationData
    );

    res.status(201).json({
      success: true,
      message: 'Job created & notification sent',
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL JOBS (USER)
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET UNREAD JOBS FOR USER
exports.getUnreadJobs = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required',
      });
    }

    // Get all viewed job IDs for this user
    const viewedJobs = await JobViewed.find({ userId }).select('jobId');
    const viewedJobIds = viewedJobs.map(v => v.jobId);

    // Get jobs that haven't been viewed
    const unreadJobs = await Job.find({
      _id: { $nin: viewedJobIds }
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: unreadJobs.length,
      data: unreadJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// MARK JOB AS VIEWED
exports.markJobAsViewed = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    if (!userId || !jobId) {
      return res.status(400).json({
        success: false,
        message: 'userId and jobId are required',
      });
    }

    // Check if already marked as viewed
    const existing = await JobViewed.findOne({ userId, jobId });
    
    if (existing) {
      return res.json({
        success: true,
        message: 'Job already marked as viewed',
      });
    }

    // Mark as viewed
    await JobViewed.create({ userId, jobId });

    res.json({
      success: true,
      message: 'Job marked as viewed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
