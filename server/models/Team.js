const mongoose = require('mongoose');

// Team Schema
const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: [true, 'Please provide a team name'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  hackathon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hackathon',
    required: true,
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  memberDetails: [{
    name: String,
    email: String,
    rollNumber: String,
    phone: String,
  }],
  assignedJudges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  logo: {
    type: String,
    default: null,
  },
  joinCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'disqualified'],
    default: 'active',
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

// Generate unique join code before saving
teamSchema.pre('save', function (next) {
  if (!this.joinCode) {
    this.joinCode = Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Team', teamSchema);
