const mongoose = require('mongoose');

// Hackathon Schema
const hackathonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  registrationStartDate: {
    type: Date,
    required: [true, 'Please provide a registration start date'],
  },
  registrationEndDate: {
    type: Date,
    required: [true, 'Please provide a registration end date'],
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date'],
  },
  submissionDeadline: {
    type: Date,
    required: [true, 'Please provide a submission deadline'],
  },
  evaluationDeadline: {
    type: Date,
    default: null,
  },
  location: {
    type: String,
    trim: true,
    default: 'Online',
  },
  mode: {
    type: String,
    enum: ['online', 'offline', 'hybrid'],
    default: 'online',
  },
  image: {
    type: String,
    default: null,
  },
  maxTeamSize: {
    type: Number,
    default: 5,
  },
  maxTeams: {
    type: Number,
    default: 100,
  },
  theme: {
    type: String,
    trim: true,
    default: '',
  },
  prize: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'evaluation', 'completed'],
    default: 'upcoming',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  judges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  evaluationCriteria: [{
    name: {
      type: String,
      required: true,
    },
    maxScore: {
      type: Number,
      required: true,
      default: 100,
    },
    description: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Hackathon', hackathonSchema);
