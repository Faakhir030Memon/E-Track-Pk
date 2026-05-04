const express = require('express');
const router = express.Router();
const { register, login, getMe, regenerateApiKey, submitPayment, forgotPassword, verifySecurityAnswer, resetPassword, verify2FA } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const { validateRegister, validateLogin } = require('../middlewares/validators');

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-security-answer', verifySecurityAnswer);
router.post('/reset-password', resetPassword);
router.post('/verify-2fa', verify2FA);

// Protected routes
router.get('/me', authenticate, getMe);
router.post('/regenerate-key', authenticate, regenerateApiKey);
router.post('/submit-payment', authenticate, submitPayment);

module.exports = router;
