const Evaluation = require('../models/Evaluation');
const Submission = require('../models/Submission');
const Team = require('../models/Team');
const Hackathon = require('../models/Hackathon');

// @desc    Create/Update evaluation
// @route   POST /api/evaluations
// @access  Private/Judge
const createEvaluation = async (req, res, next) => {
  try {
    const { teamId, hackathonId, criteriaScores, comments } = req.body;

    if (!teamId || !hackathonId || !criteriaScores) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Find the submission for this team in this hackathon
    const submission = await Submission.findOne({ team: teamId, hackathon: hackathonId });
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Project submission not found for this team' });
    }

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }

    // Check if user is an assigned judge for this hackathon
    const isJudge = hackathon.judges.some(j => j.toString() === req.user.id);
    if (!isJudge && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to evaluate this hackathon' });
    }

    // Check if evaluation already exists
    let evaluation = await Evaluation.findOne({
      team: teamId,
      hackathon: hackathonId,
      judge: req.user.id,
    });

    if (evaluation) {
      // Update existing evaluation
      evaluation.scores = criteriaScores;
      evaluation.feedback = comments;
      evaluation.status = 'completed';
      evaluation.evaluatedAt = new Date();
    } else {
      // Create new evaluation
      evaluation = new Evaluation({
        submission: submission._id,
        team: teamId,
        hackathon: hackathonId,
        judge: req.user.id,
        scores: criteriaScores,
        feedback: comments,
        status: 'completed',
        evaluatedAt: new Date(),
        isApproved: true // Auto-approve expert evaluations for now
      });
    }

    await evaluation.save();
    
    res.status(201).json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    console.error('Evaluation Error:', error);
    next(error);
  }
};

// @desc    Get all evaluations for a submission
// @route   GET /api/evaluations/submission/:submissionId
// @access  Private
const getSubmissionEvaluations = async (req, res, next) => {
  try {
    const evaluations = await Evaluation.find({ submission: req.params.submissionId })
      .populate('judge', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: evaluations.length,
      data: evaluations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all evaluations for a team
// @route   GET /api/evaluations/team/:teamId
// @access  Private
const getTeamEvaluations = async (req, res, next) => {
  try {
    const evaluations = await Evaluation.find({ team: req.params.teamId })
      .populate('judge', 'name email')
      .populate('submission', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: evaluations.length,
      data: evaluations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get judge's evaluations
// @route   GET /api/evaluations/judge/assignments
// @access  Private/Judge
const getJudgeEvaluations = async (req, res, next) => {
  try {
    const evaluations = await Evaluation.find({ judge: req.user.id })
      .populate('team', 'teamName')
      .populate('submission', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: evaluations.length,
      data: evaluations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get evaluations for a hackathon
// @route   GET /api/evaluations?hackathonId=:id
// @access  Private/Admin
const getHackathonEvaluations = async (req, res, next) => {
  try {
    const { hackathonId } = req.query;
    let query = {};

    if (hackathonId) {
      query.hackathon = hackathonId;
    }

    const evaluations = await Evaluation.find(query)
      .populate('team', 'teamName')
      .populate('judge', 'name email')
      .populate('submission', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: evaluations.length,
      data: evaluations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Reject evaluation
// @route   PUT /api/evaluations/:id/approve
// @access  Private/Admin
const approveEvaluation = async (req, res, next) => {
  try {
    const { isApproved, rejectionReason } = req.body;

    const evaluation = await Evaluation.findByIdAndUpdate(
      req.params.id,
      { isApproved, rejectionReason: !isApproved ? rejectionReason : null },
      { new: true }
    );

    if (!evaluation) {
      return res.status(404).json({ success: false, message: 'Evaluation not found' });
    }

    res.status(200).json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvaluation,
  getSubmissionEvaluations,
  getTeamEvaluations,
  getJudgeEvaluations,
  getHackathonEvaluations,
  approveEvaluation,
};
