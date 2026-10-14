const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  createSubmission,
  getSubmissions,
  getSubmission,
  getTeamSubmission,
  updateSubmissionStatus,
  approveLateSubmission,
} = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/auth');

// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/submissions/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|ppt|pptx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) return cb(null, true);
    cb(new Error('Only PDF and PPT files are allowed!'));
  }
});

const router = express.Router();

// Public routes
router.get('/', getSubmissions);
router.get('/:id', getSubmission);

// Protected routes
router.post('/', protect, upload.single('file'), createSubmission);
router.get('/team/:teamId', protect, getTeamSubmission);
router.put('/:id/status', protect, authorize('admin'), updateSubmissionStatus);
router.put('/:id/approve-late', protect, authorize('admin'), approveLateSubmission);

module.exports = router;
