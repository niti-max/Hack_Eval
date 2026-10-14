const express = require('express');
const {
  createFeedback,
  getHackathonFeedback,
  getFeedbackAnalytics,
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.post('/', protect, createFeedback);
router.get('/', protect, authorize('admin'), getHackathonFeedback);
router.get('/analytics/:hackathonId', protect, authorize('admin'), getFeedbackAnalytics);

module.exports = router;
