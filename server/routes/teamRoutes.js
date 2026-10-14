const express = require('express');
const {
  createTeam,
  getTeams,
  getTeam,
  updateTeam,
  joinTeamByCode,
  removeMember,
  assignJudges,
} = require('../controllers/teamController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getTeams);
router.get('/:id', getTeam);

// Protected routes
router.post('/', protect, authorize('student'), createTeam);
router.put('/:id', protect, updateTeam);
router.post('/join/:joinCode', protect, joinTeamByCode);
router.post('/:id/remove-member', protect, removeMember);
router.post('/:id/assign-judges', protect, authorize('admin'), assignJudges);

module.exports = router;
