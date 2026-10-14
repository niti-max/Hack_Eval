const mongoose = require('mongoose');

// Evaluation Schema
const evaluationSchema = new mongoose.Schema({
  submission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission',
    required: true,
  },
  hackathon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hackathon',
    required: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  judge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scores: [{
    criteriaName: String,
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
  }],
  totalScore: {
    type: Number,
    default: 0,
  },
  feedback: {
    type: String,
    trim: true,
    default: '',
  },
  strengths: {
    type: String,
    trim: true,
    default: '',
  },
  improvements: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'rejected'],
    default: 'pending',
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  rejectionReason: {
    type: String,
    trim: true,
    default: null,
  },
  evaluatedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Calculate total score before saving
evaluationSchema.pre('save', function (next) {
  if (this.scores && this.scores.length > 0) {
    this.totalScore = this.scores.reduce((sum, item) => sum + item.score, 0);
  }
  if (this.status === 'completed' && !this.evaluatedAt) {
    this.evaluatedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
