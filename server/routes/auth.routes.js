const express  = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  register,
  verifyEmail,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  resendVerification,
} = require('../controllers/auth.controller');

const router = express.Router();

// POST /api/auth/register
router.post('/register', [
  body('full_name').trim().notEmpty().withMessage('Full name is required'),
  body('matric_no').trim().notEmpty().withMessage('Matric number is required'),
  body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], validate, register);

// GET /api/auth/verify-email?token=xxx
router.get('/verify-email', verifyEmail);

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
], validate, login);

// GET /api/auth/me  (protected)
router.get('/me', protect, getMe);

// POST /api/auth/forgot-password
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
], validate, forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], validate, resetPassword);

// POST /api/auth/resend-verification
router.post('/resend-verification', [
  body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
], validate, resendVerification);

module.exports = router;
