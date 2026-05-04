const jwt = require('jsonwebtoken');
const Store = require('../models/Store');
const { generateApiKey, generateStoreId } = require('../utils/hashEngine');
const NotificationService = require('../services/notificationService');

/**
 * Register a new store
 * POST /api/v1/auth/register
 */
const register = async (req, res) => {
  try {
    const { storeName, email, phone, password, platform } = req.body;

    // Check if store already exists
    const existingStore = await Store.findOne({ email });
    if (existingStore) {
      return res.status(400).json({
        success: false,
        error: 'A store with this email already exists.',
      });
    }

    // Create store with generated IDs
    const store = await Store.create({
      storeName,
      email,
      phone,
      password,
      storeId: generateStoreId(),
      apiKey: generateApiKey(),
      platform: platform || 'custom',
    });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send via SMS and WhatsApp
    await NotificationService.sendOTP(phone || email, otp);

    // Generate JWT
    const token = jwt.sign(
      { id: store._id, storeId: store.storeId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        store: {
          id: store._id,
          storeName: store.storeName,
          email: store.email,
          storeId: store.storeId,
          apiKey: store.apiKey,
          platform: store.platform,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error during registration.',
      debug: error.message 
    });
  }
};

/**
 * Login store
 * POST /api/v1/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const store = await Store.findOne({ email });
    if (!store) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    const isMatch = await store.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    if (!store.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Store account is deactivated.',
      });
    }

    if (store.twoFactor?.enabled) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await NotificationService.sendOTP(store.phone || store.email, otp);
      
      // Store OTP temporarily in memory or a simple collection (for now, let's just use a short-lived JWT)
      const partialToken = jwt.sign(
        { id: store._id, purpose: '2fa_verification', otp },
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
      );

      return res.json({
        success: true,
        data: {
          require2FA: true,
          partialToken,
          method: store.phone ? 'SMS/WhatsApp' : 'Email'
        }
      });
    }

    const token = jwt.sign(
      { id: store._id, storeId: store.storeId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      data: {
        store: {
          id: store._id,
          storeName: store.storeName,
          email: store.email,
          storeId: store.storeId,
          platform: store.platform,
          stats: store.stats,
          subscription: store.subscription,
          role: store.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server error during login.' });
  }
};

/**
 * Get current store profile
 * GET /api/v1/auth/me
 */
const getMe = async (req, res) => {
  try {
    const store = await Store.findById(req.store._id).select('-password');
    res.json({
      success: true,
      data: store,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

/**
 * Submit payment for subscription
 * POST /api/v1/auth/submit-payment
 */
const submitPayment = async (req, res) => {
  try {
    const { plan, transactionId, screenshotUrl } = req.body;

    await Store.findByIdAndUpdate(req.store._id, {
      'subscription.status': 'pending_approval',
      'subscription.plan': plan,
      'subscription.paymentDetails': {
        transactionId,
        screenshotUrl,
        submittedAt: new Date(),
      }
    });

    res.json({
      success: true,
      message: 'Payment submitted for approval.',
    });
  } catch (error) {
    console.error('Submit payment error:', error);
    res.status(500).json({ success: false, error: 'Server error during payment submission.' });
  }
};

/**
 * Forgot Password - Step 1: Get Security Question
 * POST /api/v1/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const store = await Store.findOne({ email });
    
    if (!store) {
      return res.status(404).json({ success: false, error: 'Store not found.' });
    }

    if (!store.securityQuestion?.question) {
      return res.status(400).json({ 
        success: false, 
        error: 'No security question set for this account. Please contact support.' 
      });
    }

    res.json({
      success: true,
      data: { question: store.securityQuestion.question }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

/**
 * Forgot Password - Step 2: Verify Answer
 * POST /api/v1/auth/verify-security-answer
 */
const verifySecurityAnswer = async (req, res) => {
  try {
    const { email, answer } = req.body;
    const store = await Store.findOne({ email });

    if (!store || store.securityQuestion.answer !== answer) {
      return res.status(401).json({ success: false, error: 'Incorrect answer.' });
    }

    // Generate a short-lived reset token
    const resetToken = jwt.sign(
      { id: store._id, purpose: 'reset_password' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({
      success: true,
      data: { resetToken }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

/**
 * Forgot Password - Step 3: Reset Password
 * POST /api/v1/auth/reset-password
 */
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

    if (decoded.purpose !== 'reset_password') {
      return res.status(401).json({ success: false, error: 'Invalid reset token.' });
    }

    const store = await Store.findById(decoded.id);
    if (!store) return res.status(404).json({ success: false, error: 'Store not found.' });

    store.password = newPassword;
    await store.save();

    res.json({
      success: true,
      message: 'Password reset successfully. You can now login.',
    });
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }
};

/**
 * Verify 2FA OTP
 * POST /api/v1/auth/verify-2fa
 */
const verify2FA = async (req, res) => {
  try {
    const { partialToken, otp } = req.body;
    const decoded = jwt.verify(partialToken, process.env.JWT_SECRET);

    if (decoded.purpose !== '2fa_verification') {
      return res.status(401).json({ success: false, error: 'Invalid token.' });
    }

    if (decoded.otp !== otp) {
      return res.status(401).json({ success: false, error: 'Invalid OTP.' });
    }

    const store = await Store.findById(decoded.id);
    if (!store) return res.status(404).json({ success: false, error: 'Store not found.' });

    const token = jwt.sign(
      { id: store._id, storeId: store.storeId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      data: {
        store: {
          id: store._id,
          storeName: store.storeName,
          email: store.email,
          storeId: store.storeId,
          role: store.role,
          subscription: store.subscription,
        },
        token,
      },
    });
  } catch (error) {
    res.status(401).json({ success: false, error: 'Token expired or invalid.' });
  }
};

/**
 * Toggle 2FA
 * POST /api/v1/auth/toggle-2fa
 */
const toggle2FA = async (req, res) => {
  try {
    const store = await Store.findById(req.store._id);
    store.twoFactor.enabled = !store.twoFactor.enabled;
    await store.save();

    res.json({
      success: true,
      data: { enabled: store.twoFactor.enabled },
      message: `2FA has been ${store.twoFactor.enabled ? 'enabled' : 'disabled'}.`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

module.exports = { register, login, getMe, regenerateApiKey, submitPayment, forgotPassword, verifySecurityAnswer, resetPassword, verify2FA, toggle2FA };
