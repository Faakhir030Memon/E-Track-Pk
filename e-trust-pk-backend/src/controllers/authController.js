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
 * Regenerate API key
 * POST /api/v1/auth/regenerate-key
 */
const regenerateApiKey = async (req, res) => {
  try {
    const newKey = generateApiKey();
    await Store.findByIdAndUpdate(req.store._id, { apiKey: newKey });
    res.json({
      success: true,
      data: { apiKey: newKey },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error.' });
  }
};

module.exports = { register, login, getMe, regenerateApiKey };
