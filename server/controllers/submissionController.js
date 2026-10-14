const Submission = require('../models/Submission');
const Team = require('../models/Team');
const Hackathon = require('../models/Hackathon');
const { isSubmissionLate } = require('../utils/helpers');
const path = require('path');

// @desc    Create/Update submission
// @route   POST /api/submissions
// @access  Private/Team
const createSubmission = async (req, res, next) => {
  try {
    console.log('--- New Submission Request ---');
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const { teamId, hackathonId, title, description, videoUrl, githubLink, liveLink } = req.body;

    if (!teamId || !hackathonId || !title) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Check if user is team leader
    if (team.leader.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to submit for this team' });
    }

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }

    // Prepare file data if uploaded
    const fileData = req.file ? {
      filename: req.file.originalname,
      url: `/uploads/submissions/${req.file.filename}`,
      fileType: path.extname(req.file.filename).substring(1),
    } : null;

    // Check if submission already exists
    let submission = await Submission.findOne({ team: teamId, hackathon: hackathonId });

    if (submission) {
      // Update existing submission
      submission.title = title;
      submission.description = description;
      submission.videoUrl = videoUrl;
      submission.githubLink = githubLink;
      submission.liveLink = liveLink;
      if (fileData) {
        submission.files = [fileData]; // For now, replacing with latest file
      }
      submission.updatedAt = new Date();
      submission.status = 'submitted';
    } else {
      // Create new submission
      submission = new Submission({
        team: teamId,
        hackathon: hackathonId,
        title,
        description,
        videoUrl,
        githubLink,
        liveLink,
        files: fileData ? [fileData] : [],
        isLate: isSubmissionLate(new Date(), hackathon.submissionDeadline),
        status: 'submitted'
      });
    }

    await submission.save();
    await submission.populate([
      { path: 'team', select: 'teamName' },
      { path: 'hackathon', select: 'title' }
    ]);

    res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all submissions for a hackathon
// @route   GET /api/submissions?hackathonId=:id
// @access  Private/Admin/Judge
const getSubmissions = async (req, res, next) => {
  try {
    const { hackathonId, status } = req.query;
    let query = {};

    if (hackathonId) {
      query.hackathon = hackathonId;
    }

    if (status) {
      query.status = status;
    }

    const submissions = await Submission.find(query)
      .populate('team', 'teamName leader')
      .populate('hackathon', 'title')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single submission
// @route   GET /api/submissions/:id
// @access  Private
const getSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('team', 'teamName leader members')
      .populate('hackathon', 'title submissionDeadline');

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team's submission
// @route   GET /api/submissions/team/:teamId
// @access  Private
const getTeamSubmission = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ team: req.params.teamId })
      .populate('team', 'teamName')
      .populate('hackathon', 'title');

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update submission status
// @route   PUT /api/submissions/:id/status
// @access  Private/Admin
const updateSubmissionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['draft', 'submitted', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve late submission
// @route   PUT /api/submissions/:id/approve-late
// @access  Private/Admin
const approveLateSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { isLate: false, status: 'approved' },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmission,
  getTeamSubmission,
  updateSubmissionStatus,
  approveLateSubmission,
};
