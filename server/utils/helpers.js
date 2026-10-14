const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Send Token Response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id, user.role);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// Check if submission is late
const isSubmissionLate = (submittedAt, deadline) => {
  return new Date(submittedAt) > new Date(deadline);
};

// Calculate average score for a team
const calculateAverageScore = (evaluations) => {
  if (evaluations.length === 0) return 0;
  const totalScore = evaluations.reduce((sum, eval) => sum + eval.totalScore, 0);
  return (totalScore / evaluations.length).toFixed(2);
};

// Format time remaining for deadline
const getTimeRemaining = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const difference = deadlineDate - now;

  if (difference <= 0) {
    return 'Deadline Passed';
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);

  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  } else {
    return `${minutes}m remaining`;
  }
};

module.exports = {
  generateToken,
  sendTokenResponse,
  isSubmissionLate,
  calculateAverageScore,
  getTimeRemaining,
};
