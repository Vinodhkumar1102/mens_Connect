const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getUnreadJobs,
  markJobAsViewed,
} = require('../controllers/jobController');

router.post('/', createJob);                    // Admin - create job
router.get('/', getJobs);                       // User - get all jobs
router.get('/unread/:userId', getUnreadJobs);   // User - get unread jobs
router.post('/mark-viewed', markJobAsViewed);   // User - mark job as viewed

module.exports = router;

