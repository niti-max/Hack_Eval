const express = require('express');
const {
  createEvaluation,
  getSubmissionEvaluations,
  getTeamEvaluations,
  getJudgeEvaluations,
  getHackathonEvaluations,
  approveEvaluation,
} = require('../controllers/evaluationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.post('/', protect, authorize('judge'), createEvaluation);
router.get('/submission/:submissionId', protect, getSubmissionEvaluations);
router.get('/team/:teamId', protect, getTeamEvaluations);
router.get('/judge/assignments', protect, authorize('judge'), getJudgeEvaluations);
router.get('/', protect, authorize('admin'), getHackathonEvaluations);
router.put('/:id/approve', protect, authorize('admin'), approveEvaluation);

module.exports = router;
