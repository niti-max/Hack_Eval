const Team = require('../models/Team');
const Hackathon = require('../models/Hackathon');
const User = require('../models/User');

// @desc    Create team
// @route   POST /api/teams
// @access  Private/Student
const createTeam = async (req, res, next) => {
  try {
    const { teamName, hackathonId, description, memberDetails, logo } = req.body;

    if (!teamName || !hackathonId) {
      return res.status(400).json({ success: false, message: 'Please provide team name and hackathon' });
    }

    // Check if hackathon exists
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }

    const team = await Team.create({
      teamName,
      hackathon: hackathonId,
      leader: req.user.id,
      members: [req.user.id],
      memberDetails: memberDetails || [],
      description,
      logo,
    });

    await team.populate([
      { path: 'leader', select: 'name email' },
      { path: 'members', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all teams for a hackathon
// @route   GET /api/teams?hackathonId=:id
// @access  Public
const getTeams = async (req, res, next) => {
  try {
    const { hackathonId } = req.query;
    let query = {};

    if (hackathonId) {
      query.hackathon = hackathonId;
    }

    const teams = await Team.find(query)
      .populate('leader', 'name email')
      .populate('members', 'name email')
      .populate('assignedJudges', 'name email')
      .sort({ createdAt: -1 });

    // Fetch submission and evaluation status for each team
    const Submission = require('../models/Submission');
    const Evaluation = require('../models/Evaluation');
    const teamsWithStatus = await Promise.all(teams.map(async (team) => {
      const submission = await Submission.findOne({ team: team._id }).select('_id status title createdAt');
      
      // Fetch evaluation status
      let evaluation = null;
      if (req.user) {
        if (req.user.role === 'judge') {
          // If judge, find their specific evaluation
          evaluation = await Evaluation.findOne({ 
            team: team._id, 
            judge: req.user.id 
          }).select('_id totalScore status');
        } else if (req.user.role === 'student') {
          // If student, find any completed evaluation for their team
          evaluation = await Evaluation.findOne({ 
            team: team._id,
            status: 'completed'
          }).select('_id totalScore status evaluatedAt feedback');
        }
      }

      return {
        ...team.toObject(),
        submission: submission || null,
        userEvaluation: evaluation || null
      };
    }));

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teamsWithStatus,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single team
// @route   GET /api/teams/:id
// @access  Public
const getTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leader', 'name email')
      .populate('members', 'name email')
      .populate('assignedJudges', 'name email')
      .populate('hackathon', 'title');

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private/Team Leader
const updateTeam = async (req, res, next) => {
  try {
    let team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Check authorization
    if (team.leader.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this team' });
    }

    team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('leader', 'name email')
      .populate('members', 'name email');

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add member to team using join code
// @route   POST /api/teams/join/:joinCode
// @access  Private/Student
const joinTeamByCode = async (req, res, next) => {
  try {
    const team = await Team.findOne({ joinCode: req.params.joinCode });

    if (!team) {
      return res.status(404).json({ success: false, message: 'Invalid join code' });
    }

    if (team.members.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: 'You are already a member of this team' });
    }

    if (team.members.length >= 5) {
      return res.status(400).json({ success: false, message: 'Team is full' });
    }

    team.members.push(req.user.id);
    await team.save();
    await team.populate([
      { path: 'leader', select: 'name email' },
      { path: 'members', select: 'name email' }
    ]);

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from team
// @route   POST /api/teams/:id/remove-member
// @access  Private/Team Leader
const removeMember = async (req, res, next) => {
  try {
    const { memberId } = req.body;
    let team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Check authorization
    if (team.leader.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to manage this team' });
    }

    team.members = team.members.filter(m => m.toString() !== memberId);
    await team.save();
    await team.populate([
      { path: 'leader', select: 'name email' },
      { path: 'members', select: 'name email' }
    ]);

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign judges to team
// @route   POST /api/teams/:id/assign-judges
// @access  Private/Admin
const assignJudges = async (req, res, next) => {
  try {
    const { judgeIds } = req.body;
    let team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    team.assignedJudges = judgeIds;
    await team.save();
    await team.populate('assignedJudges', 'name email');

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeam,
  getTeams,
  getTeam,
  updateTeam,
  joinTeamByCode,
  removeMember,
  assignJudges,
};
