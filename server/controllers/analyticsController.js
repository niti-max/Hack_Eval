const Evaluation = require('../models/Evaluation');
const Team = require('../models/Team');
const Submission = require('../models/Submission');
const Hackathon = require('../models/Hackathon');
const Feedback = require('../models/Feedback');

// @desc    Get hackathon rankings and analytics
// @route   GET /api/analytics/:hackathonId/rankings
// @access  Private
const getHackathonRankings = async (req, res, next) => {
  try {
    const { hackathonId } = req.params;

    const evaluations = await Evaluation.aggregate([
      { $match: { hackathon: require('mongoose').Types.ObjectId(hackathonId) } },
      {
        $group: {
          _id: '$team',
          totalScore: { $sum: '$totalScore' },
          judgeCount: { $sum: 1 },
          averageScore: { $avg: '$totalScore' },
        },
      },
      { $sort: { averageScore: -1 } },
    ]);

    // Populate team data
    const rankings = await Promise.all(
      evaluations.map(async (eval) => {
        const team = await Team.findById(eval._id).populate('leader', 'name email').populate('members', 'name');
        return {
          rank: evaluations.indexOf(eval) + 1,
          team,
          totalScore: eval.totalScore,
          averageScore: eval.averageScore.toFixed(2),
          judgeCount: eval.judgeCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: rankings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team analytics
// @route   GET /api/analytics/team/:teamId
// @access  Private
const getTeamAnalytics = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.teamId)
      .populate('leader', 'name email')
      .populate('members', 'name email');

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    const evaluations = await Evaluation.find({ team: req.params.teamId })
      .populate('judge', 'name email');

    const submission = await Submission.findOne({ team: req.params.teamId });

    const totalScore = evaluations.reduce((sum, eval) => sum + eval.totalScore, 0);
    const averageScore = evaluations.length > 0 ? (totalScore / evaluations.length).toFixed(2) : 0;

    const scoreByCriteria = {};
    evaluations.forEach(eval => {
      eval.scores.forEach(score => {
        if (!scoreByCriteria[score.criteriaName]) {
          scoreByCriteria[score.criteriaName] = [];
        }
        scoreByCriteria[score.criteriaName].push(score.score);
      });
    });

    const criteriaAverages = {};
    Object.keys(scoreByCriteria).forEach(criteria => {
      const scores = scoreByCriteria[criteria];
      criteriaAverages[criteria] = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
    });

    res.status(200).json({
      success: true,
      data: {
        team,
        evaluationCount: evaluations.length,
        totalScore,
        averageScore,
        criteriaAverages,
        evaluations,
        submission,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get hackathon statistics
// @route   GET /api/analytics/hackathon/:hackathonId/stats
// @access  Private/Admin
const getHackathonStats = async (req, res, next) => {
  try {
    const hackathonId = req.params.hackathonId;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }

    const teams = await Team.countDocuments({ hackathon: hackathonId });
    const submissions = await Submission.countDocuments({ hackathon: hackathonId });
    const evaluations = await Evaluation.countDocuments({ hackathon: hackathonId });
    const completedEvaluations = await Evaluation.countDocuments({
      hackathon: hackathonId,
      status: 'completed',
    });
    const lateSubmissions = await Submission.countDocuments({
      hackathon: hackathonId,
      isLate: true,
    });

    const averageScores = await Evaluation.aggregate([
      { $match: { hackathon: require('mongoose').Types.ObjectId(hackathonId) } },
      { $group: { _id: null, averageScore: { $avg: '$totalScore' } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        hackathon: {
          title: hackathon.title,
          status: hackathon.status,
          startDate: hackathon.startDate,
          endDate: hackathon.endDate,
        },
        statistics: {
          totalTeams: teams,
          totalSubmissions: submissions,
          totalEvaluations: evaluations,
          completedEvaluations,
          lateSubmissions,
          averageScore: averageScores.length > 0 ? averageScores[0].averageScore.toFixed(2) : 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHackathonRankings,
  getTeamAnalytics,
  getHackathonStats,
};
