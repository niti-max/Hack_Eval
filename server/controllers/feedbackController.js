const Feedback = require('../models/Feedback');
const Hackathon = require('../models/Hackathon');

// @desc    Create feedback
// @route   POST /api/feedback
// @access  Private
const createFeedback = async (req, res, next) => {
  try {
    const { hackathonId, rating, category, comment, suggestions, isAnonymous, teamId } = req.body;

    if (!hackathonId || !rating) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }

    // Check if user already gave feedback
    const existingFeedback = await Feedback.findOne({
      hackathon: hackathonId,
      user: req.user.id,
    });

    if (existingFeedback) {
      return res.status(400).json({ success: false, message: 'You have already provided feedback for this event' });
    }

    const feedback = await Feedback.create({
      hackathon: hackathonId,
      user: req.user.id,
      team: teamId || null,
      rating,
      category: category || 'overall',
      comment,
      suggestions,
      isAnonymous,
    });

    res.status(201).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all feedback for a hackathon
// @route   GET /api/feedback?hackathonId=:id
// @access  Private/Admin
const getHackathonFeedback = async (req, res, next) => {
  try {
    const { hackathonId, category } = req.query;
    let query = {};

    if (hackathonId) {
      query.hackathon = hackathonId;
    }

    if (category) {
      query.category = category;
    }

    const feedback = await Feedback.find(query)
      .populate('user', 'name email')
      .populate('hackathon', 'title')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalRating = feedback.reduce((sum, f) => sum + f.rating, 0);
    const averageRating = feedback.length > 0 ? (totalRating / feedback.length).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      count: feedback.length,
      averageRating,
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get feedback analytics
// @route   GET /api/feedback/analytics/:hackathonId
// @access  Private/Admin
const getFeedbackAnalytics = async (req, res, next) => {
  try {
    const feedback = await Feedback.find({ hackathon: req.params.hackathonId });

    const ratingDistribution = {
      5: feedback.filter(f => f.rating === 5).length,
      4: feedback.filter(f => f.rating === 4).length,
      3: feedback.filter(f => f.rating === 3).length,
      2: feedback.filter(f => f.rating === 2).length,
      1: feedback.filter(f => f.rating === 1).length,
    };

    const categoryRatings = {};
    feedback.forEach(f => {
      if (!categoryRatings[f.category]) {
        categoryRatings[f.category] = [];
      }
      categoryRatings[f.category].push(f.rating);
    });

    const categoryAverages = {};
    Object.keys(categoryRatings).forEach(key => {
      const ratings = categoryRatings[key];
      categoryAverages[key] = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2);
    });

    const totalRating = feedback.reduce((sum, f) => sum + f.rating, 0);
    const averageRating = feedback.length > 0 ? (totalRating / feedback.length).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalFeedback: feedback.length,
        averageRating,
        ratingDistribution,
        categoryAverages,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFeedback,
  getHackathonFeedback,
  getFeedbackAnalytics,
};
