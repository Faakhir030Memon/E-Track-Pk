const express = require('express');
const router = express.Router();
const {
  checkUser,
  reportOrder,
  getUserHistory,
  getBlacklist,
  getAnalytics,
  getActivityFeed,
  addToMyBlacklist,
  removeFromMyBlacklist,
} = require('../controllers/trustController');
const { authenticate, authenticateApiKey } = require('../middlewares/auth');
const { validateCheckUser, validateReportOrder } = require('../middlewares/validators');

// All routes require either JWT or API Key auth
// Dashboard calls → JWT auth
// Webhook/integration calls → API Key auth

// Check score — supports both auth methods
router.post('/check', authenticate, validateCheckUser, checkUser);
router.post('/check/webhook', authenticateApiKey, validateCheckUser, checkUser);

// Report order result (feedback loop) — supports both
router.post('/report', authenticate, validateReportOrder, reportOrder);
router.post('/report/webhook', authenticateApiKey, validateReportOrder, reportOrder);

// Dashboard-only endpoints (JWT protected)
router.get('/history/:hashedId', authenticate, getUserHistory);
router.get('/blacklist', authenticate, getBlacklist);
router.get('/analytics', authenticate, getAnalytics);
router.get('/feed', authenticate, getActivityFeed);

// Private Blacklist (Store-specific)
router.post('/my-blacklist', authenticate, addToMyBlacklist);
router.delete('/my-blacklist/:hashedId', authenticate, removeFromMyBlacklist);

module.exports = router;
