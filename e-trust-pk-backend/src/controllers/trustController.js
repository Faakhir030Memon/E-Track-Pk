const ScoringEngine = require('../services/scoringEngine');
const TrustScore = require('../models/TrustScore');
const OrderActivity = require('../models/OrderActivity');
const { hashPhone } = require('../utils/hashEngine');
const Store = require('../models/Store');

/**
 * Check user trust score
 * POST /api/v1/trust/check
 * Body: { phone, orderValue?, address? }
 */
const checkUser = async (req, res) => {
  try {
    const { phone, orderValue, address } = req.body;
    const hashedId = hashPhone(phone);

    const result = await ScoringEngine.checkScore(hashedId, orderValue, address);

    // Increment store's check count
    await Store.findByIdAndUpdate(req.store._id, {
      $inc: { 'stats.totalChecks': 1 },
    });

    // If high risk, increment blocked count
    if (result.riskLevel === 'high_risk') {
      await Store.findByIdAndUpdate(req.store._id, {
        $inc: {
          'stats.highRiskBlocked': 1,
          'stats.moneySaved': orderValue || 0,
        },
      });
    }

    // Check if in store's private blacklist
    const isPrivateBlacklisted = req.store.myBlacklist.some(item => item.hashedId === hashedId);

    res.json({
      success: true,
      data: {
        hashedId,
        ...result,
        isPrivateBlacklisted,
        checkedAt: new Date(),
        checkedBy: req.store.storeId,
      },
    });
  } catch (error) {
    console.error('Check user error:', error);
    res.status(500).json({ success: false, error: 'Error checking user score.' });
  }
};

/**
 * Report order status (the feedback loop)
 * POST /api/v1/trust/report
 * Body: { phone, orderId, status, orderValue?, reason?, address? }
 */
const reportOrder = async (req, res) => {
  try {
    const { phone, orderId, status, orderValue, reason, address } = req.body;
    const hashedId = hashPhone(phone);

    const result = await ScoringEngine.updateScore(
      hashedId,
      status,
      req.store.storeId,
      orderId,
      orderValue,
      reason,
      address
    );

    res.json({
      success: true,
      data: {
        ...result,
        orderId,
        updatedAt: new Date(),
        reportedBy: req.store.storeId,
      },
    });
  } catch (error) {
    console.error('Report order error:', error);
    res.status(500).json({ success: false, error: 'Error reporting order status.' });
  }
};

/**
 * Get user history (for dashboard detail view)
 * GET /api/v1/trust/history/:hashedId
 */
const getUserHistory = async (req, res) => {
  try {
    const { hashedId } = req.params;

    const trustScore = await TrustScore.findOne({ hashedId });
    if (!trustScore) {
      return res.status(404).json({
        success: false,
        error: 'No records found for this user.',
      });
    }

    const activities = await OrderActivity.find({ hashedId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: {
        profile: trustScore,
        activities,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching user history.' });
  }
};

/**
 * Get global blacklist (users with score < 30 reported by 2+ stores)
 * GET /api/v1/trust/blacklist
 */
const getBlacklist = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const blacklisted = await TrustScore.find({
      globalScore: { $lt: 30 },
      'reportedByStores.1': { $exists: true }, // At least 2 store reports
    })
      .sort({ globalScore: 1 })
      .skip(skip)
      .limit(limit);

    const total = await TrustScore.countDocuments({
      globalScore: { $lt: 30 },
      'reportedByStores.1': { $exists: true },
    });

    res.json({
      success: true,
      data: {
        users: blacklisted,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching blacklist.' });
  }
};

/**
 * Dashboard analytics for a store
 * GET /api/v1/trust/analytics
 */
const getAnalytics = async (req, res) => {
  try {
    const storeId = req.store.storeId;
    const days = parseInt(req.query.days) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get store's order activities
    const activities = await OrderActivity.find({
      storeId,
      createdAt: { $gte: since },
    });

    const totalOrders = activities.length;
    const delivered = activities.filter(a => a.status === 'delivered').length;
    const returned = activities.filter(a => a.status === 'returned').length;
    const refused = activities.filter(a => a.status === 'refused').length;
    const cancelled = activities.filter(a => a.status === 'cancelled').length;
    const fakeAddress = activities.filter(a => a.status === 'fake_address').length;

    // Revenue impact
    const returnedValue = activities
      .filter(a => ['returned', 'refused', 'fake_address'].includes(a.status))
      .reduce((sum, a) => sum + (a.orderValue || 0), 0);

    const deliveredValue = activities
      .filter(a => a.status === 'delivered')
      .reduce((sum, a) => sum + (a.orderValue || 0), 0);

    // Daily breakdown for chart
    const dailyBreakdown = {};
    activities.forEach(a => {
      const day = a.createdAt.toISOString().split('T')[0];
      if (!dailyBreakdown[day]) {
        dailyBreakdown[day] = { delivered: 0, returned: 0, refused: 0, total: 0 };
      }
      dailyBreakdown[day].total++;
      if (dailyBreakdown[day][a.status] !== undefined) {
        dailyBreakdown[day][a.status]++;
      }
    });

    // Risk distribution
    const uniqueUsers = [...new Set(activities.map(a => a.hashedId))];
    let safeCount = 0, warningCount = 0, highRiskCount = 0;

    if (uniqueUsers.length > 0) {
      const userScores = await TrustScore.find({ hashedId: { $in: uniqueUsers } });
      userScores.forEach(u => {
        if (u.globalScore >= 80) safeCount++;
        else if (u.globalScore >= 50) warningCount++;
        else highRiskCount++;
      });
    }

    // Store stats
    const store = await Store.findById(req.store._id);

    res.json({
      success: true,
      data: {
        period: `${days} days`,
        overview: {
          totalOrders,
          delivered,
          returned,
          refused,
          cancelled,
          fakeAddress,
          deliveryRate: totalOrders > 0 ? Math.round((delivered / totalOrders) * 100) : 0,
          returnRate: totalOrders > 0 ? Math.round((returned / totalOrders) * 100) : 0,
        },
        revenue: {
          deliveredValue,
          returnedValue,
          potentialSavings: returnedValue,
        },
        riskDistribution: {
          safe: safeCount,
          warning: warningCount,
          highRisk: highRiskCount,
        },
        dailyBreakdown: Object.entries(dailyBreakdown)
          .map(([date, data]) => ({ date, ...data }))
          .sort((a, b) => a.date.localeCompare(b.date)),
        storeStats: store ? store.stats : {},
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, error: 'Error fetching analytics.' });
  }
};

/**
 * Get recent activity feed for the dashboard
 * GET /api/v1/trust/feed
 */
const getActivityFeed = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Return global recent "risky" activities for the feed
    // This makes the dashboard feel alive with real platform data
    const activities = await OrderActivity.find({
      status: { $in: ['returned', 'refused', 'fake_address', 'no_pick_up'] }
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching feed.' });
  }
};

/**
 * Add user to store's private blacklist
 * POST /api/v1/trust/my-blacklist
 */
const addToMyBlacklist = async (req, res) => {
  try {
    const { phone, reason } = req.body;
    const hashedId = hashPhone(phone);

    await Store.findByIdAndUpdate(req.store._id, {
      $addToSet: { myBlacklist: { hashedId, reason } }
    });

    res.json({
      success: true,
      message: 'User added to your private blacklist.',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error blacklisting user.' });
  }
};

/**
 * Remove user from store's private blacklist
 * DELETE /api/v1/trust/my-blacklist/:hashedId
 */
const removeFromMyBlacklist = async (req, res) => {
  try {
    await Store.findByIdAndUpdate(req.store._id, {
      $pull: { myBlacklist: { hashedId: req.params.hashedId } }
    });

    res.json({
      success: true,
      message: 'User removed from your private blacklist.',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error removing user from blacklist.' });
  }
};

module.exports = {
  checkUser,
  reportOrder,
  getUserHistory,
  getBlacklist,
  getAnalytics,
  getActivityFeed,
  addToMyBlacklist,
  removeFromMyBlacklist,
};
