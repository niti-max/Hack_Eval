const Hackathon = require('../models/Hackathon');
const User = require('../models/User');

// @desc    Create hackathon
// @route   POST /api/hackathons
// @access  Private/Admin
const createHackathon = async (req, res, next) => {
  try {
    const { 
      title, 
      description, 
      registrationStartDate,
      registrationEndDate,
      startDate, 
      endDate, 
      submissionDeadline, 
      evaluationDeadline, 
      location, 
      mode, 
      maxTeamSize, 
      maxTeams, 
      theme, 
      prize, 
      evaluationCriteria,
      judges
    } = req.body;

    // Validate required fields
    if (!title || !description || !registrationStartDate || !registrationEndDate || !startDate || !endDate || !submissionDeadline) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const hackathon = await Hackathon.create({
      title,
      description,
      registrationStartDate,
      registrationEndDate,
      startDate,
      endDate,
      submissionDeadline,
      evaluationDeadline,
      location,
      mode,
      maxTeamSize: maxTeamSize || 5,
      maxTeams: maxTeams || 100,
      theme,
      prize,
      judges: judges || [],
      createdBy: req.user.id,
      evaluationCriteria: evaluationCriteria || [
        { name: 'Creativity', maxScore: 100, description: 'Originality and innovation' },
        { name: 'Technical Quality', maxScore: 100, description: 'Code quality and implementation' },
        { name: 'Impact', maxScore: 100, description: 'Real-world applicability' },
      ],
    });

    res.status(201).json({
      success: true,
      data: hackathon,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all hackathons
// @route   GET /api/hackathons
// @access  Public
const getHackathons = async (req, res, next) => {
  try {
    const status = req.query.status;
    let query = {};

    if (status) {
      query.status = status;
    }

    const hackathons = await Hackathon.find(query)
      .populate('createdBy', 'name email')
      .populate('judges', 'name email')
      .sort({ createdAt: -1 });

    // Calculate team counts for each hackathon
    const Team = require('../models/Team');
    const hackathonsWithCounts = await Promise.all(hackathons.map(async (h) => {
      const teamsCount = await Team.countDocuments({ hackathon: h._id });
      return { ...h.toObject(), teamsCount };
    }));

    res.status(200).json({
      success: true,
      count: hackathons.length,
      data: hackathonsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hackathon
// @route   GET /api/hackathons/:id
// @access  Public
const getHackathon = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('judges', 'name email role');

    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }

    res.status(200).json({
      success: true,
      data: hackathon,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hackathon
// @route   PUT /api/hackathons/:id
// @access  Private/Admin
const updateHackathon = async (req, res, next) => {
  try {
    let hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }

    // Check authorization
    if (hackathon.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this hackathon' });
    }

    hackathon = await Hackathon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      data: hackathon,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hackathon
// @route   DELETE /api/hackathons/:id
// @access  Private/Admin
const deleteHackathon = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }

    // Check authorization
    if (hackathon.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this hackathon' });
    }

    await Hackathon.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Hackathon deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add judges to hackathon
// @route   POST /api/hackathons/:id/judges
// @access  Private/Admin
const addJudges = async (req, res, next) => {
  try {
    const { judgeIds } = req.body;

    let hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }

    // Validate judges exist and have judge role
    for (const judgeId of judgeIds) {
      const judge = await User.findById(judgeId);
      if (!judge || judge.role !== 'judge') {
        return res.status(400).json({ success: false, message: `User ${judgeId} is not a judge` });
      }
    }

    hackathon.judges = [...new Set([...hackathon.judges, ...judgeIds])];
    await hackathon.save();

    res.status(200).json({
      success: true,
      data: hackathon,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createHackathon,
  getHackathons,
  getHackathon,
  updateHackathon,
  deleteHackathon,
  addJudges,
};
