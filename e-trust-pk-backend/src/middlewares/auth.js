const jwt = require('jsonwebtoken');
const Store = require('../models/Store');

/**
 * JWT Authentication Middleware
 * Verifies Bearer token from Authorization header
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const store = await Store.findById(decoded.id).select('-password');
    if (!store) {
      return res.status(401).json({
        success: false,
        error: 'Store not found. Token invalid.',
      });
    }

    if (!store.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Store account is deactivated.',
      });
    }

    // Auto-expiry check
    if (store.role === 'store' && store.subscription?.expiryDate && new Date(store.subscription.expiryDate) < new Date()) {
      if (store.subscription.status !== 'expired') {
        store.subscription.status = 'expired';
        await store.save();
      }
      return res.status(403).json({
        success: false,
        error: 'Your subscription has expired. Please renew to continue.',
      });
    }

    // Approval check (allow profile and pricing routes)
    const allowedPaths = ['/api/v1/auth/me', '/api/v1/auth/submit-payment'];
    if (store.role === 'store' && !store.isApproved && !allowedPaths.includes(req.originalUrl)) {
      return res.status(403).json({
        success: false,
        error: 'Account pending approval.',
        status: 'pending_approval'
      });
    }

    req.store = store;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired. Please login again.',
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Invalid token.',
    });
  }
};

/**
 * API Key Authentication (for webhook integrations)
 * Checks x-api-key header
 */
const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'API key required.',
      });
    }

    const store = await Store.findOne({ apiKey, isActive: true });
    if (!store) {
      return res.status(401).json({
        success: false,
        error: 'Invalid API key.',
      });
    }

    req.store = store;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Authentication error.',
    });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.store.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Admin role required.',
    });
  }
  next();
};

module.exports = { authenticate, authenticateApiKey, authorizeAdmin };
