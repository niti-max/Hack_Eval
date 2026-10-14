const express = require('express');
const {
  createHackathon,
  getHackathons,
  getHackathon,
  updateHackathon,
  deleteHackathon,
  addJudges,
} = require('../controllers/hackathonController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getHackathons);
router.get('/:id', getHackathon);

// Protected routes
router.post('/', protect, authorize('admin'), createHackathon);
router.put('/:id', protect, authorize('admin'), updateHackathon);
router.delete('/:id', protect, authorize('admin'), deleteHackathon);
router.post('/:id/judges', protect, authorize('admin'), addJudges);

module.exports = router;
