const express = require('express');
const {
  getHackathonRankings,
  getTeamAnalytics,
  getHackathonStats,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.get('/rankings/:hackathonId', protect, getHackathonRankings);
router.get('/team/:teamId', protect, getTeamAnalytics);
router.get('/hackathon/:hackathonId/stats', protect, authorize('admin'), getHackathonStats);

module.exports = router;
