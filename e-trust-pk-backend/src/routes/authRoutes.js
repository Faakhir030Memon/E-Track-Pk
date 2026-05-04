const express = require('express');
const router = express.Router();
const { register, login, getMe, regenerateApiKey, submitPayment } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const { validateRegister, validateLogin } = require('../middlewares/validators');

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/me', authenticate, getMe);
router.post('/regenerate-key', authenticate, regenerateApiKey);
router.post('/submit-payment', authenticate, submitPayment);

module.exports = router;
