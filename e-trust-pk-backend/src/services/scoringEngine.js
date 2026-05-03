const TrustScore = require('../models/TrustScore');
const OrderActivity = require('../models/OrderActivity');
const { SCORE_WEIGHTS, SCORE_THRESHOLDS, RISK_LEVELS, DEFAULT_SCORE, RECENCY_DECAY, ORDER_STATUSES } = require('../config/constants');
const { validateAddress } = require('../utils/addressValidator');

/**
 * E-Trust PK Scoring Engine
 * Calculates Trust Scores based on:
 *   - Past behavior (60% weightage)
 *   - Address integrity (20% weightage)
 *   - Order value risk (20% weightage)
 */

class ScoringEngine {

  /**
   * Check user score — the main API brain
   * Called when a new order comes in
   */
  static async checkScore(hashedId, orderValue = 0, address = '') {
    let userRecord = await TrustScore.findOne({ hashedId });
    const isNewUser = !userRecord;

    if (isNewUser) {
      // New user — create with default neutral score
      userRecord = await TrustScore.create({
        hashedId,
        globalScore: DEFAULT_SCORE,
        totalOrders: 0,
        successfulDeliveries: 0,
        returns: 0,
        cancellations: 0,
        refusals: 0,
        flags: [],
        riskLevel: RISK_LEVELS.SAFE,
      });
    }

    // --- FACTOR 1: Past Behavior (60% weight) ---
    const behaviorScore = this.calculateBehaviorScore(userRecord);

    // --- FACTOR 2: Address Integrity (20% weight) ---
    const addressResult = validateAddress(address);
    const addressScore = addressResult.addressScore;

    // --- FACTOR 3: Order Value Risk (20% weight) ---
    const valueScore = this.calculateValueRisk(orderValue, userRecord);

    // Weighted final score
    const rawScore = (behaviorScore * 0.6) + (addressScore * 0.2) + (valueScore * 0.2);
    const finalScore = Math.round(Math.max(0, Math.min(100, rawScore)));

    // Determine risk level and action
    const riskLevel = this.getRiskLevel(finalScore);
    const action = this.getAction(riskLevel);

    // Cross-store analysis
    const crossStoreData = await this.getCrossStoreAnalysis(hashedId);

    return {
      score: finalScore,
      riskLevel,
      action,
      isNewUser,
      breakdown: {
        behaviorScore: Math.round(behaviorScore),
        addressScore: Math.round(addressScore),
        valueScore: Math.round(valueScore),
        addressFlags: addressResult.flags,
      },
      history: {
        totalOrders: userRecord.totalOrders,
        successfulDeliveries: userRecord.successfulDeliveries,
        returns: userRecord.returns,
        refusals: userRecord.refusals,
        flags: userRecord.flags,
      },
      crossStore: crossStoreData,
    };
  }

  /**
   * Calculate behavior score from past history
   * Includes recency decay — old negatives lose weight over time
   */
  static calculateBehaviorScore(user) {
    if (user.totalOrders === 0) return DEFAULT_SCORE;

    const successRate = user.successfulDeliveries / user.totalOrders;
    let score = successRate * 100;

    // Apply penalties for specific bad behaviors
    if (user.returns > 0) {
      const returnPenalty = Math.min(user.returns * 5, 30); // Cap at -30
      score -= returnPenalty;
    }

    if (user.refusals > 0) {
      const refusalPenalty = Math.min(user.refusals * 8, 40); // Cap at -40
      score -= refusalPenalty;
    }

    if (user.cancellations > 0) {
      const cancelPenalty = Math.min(user.cancellations * 3, 15); // Cap at -15
      score -= cancelPenalty;
    }

    // Recency decay — if last negative was > 6 months ago, reduce penalties
    if (user.lastActivity) {
      const daysSinceActivity = (Date.now() - new Date(user.lastActivity).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceActivity > RECENCY_DECAY.DAYS_THRESHOLD) {
        // Bring score back toward neutral
        const decayBoost = (DEFAULT_SCORE - score) * RECENCY_DECAY.DECAY_FACTOR;
        score += decayBoost;
      }
    }

    // Repeat offender check
    if (user.flags.includes('repeat_offender')) {
      score -= 15;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate risk based on order value
   * High-value first-time orders are riskier
   */
  static calculateValueRisk(orderValue, user) {
    if (!orderValue || orderValue <= 0) return 80; // Neutral

    let score = 100;

    // High value order from new/low-history user
    if (orderValue > 30000 && user.totalOrders < 3) {
      score -= 30; // High risk
    } else if (orderValue > 50000 && user.totalOrders < 5) {
      score -= 40;
    } else if (orderValue > 15000 && user.totalOrders === 0) {
      score -= 20;
    }

    // Very high value always gets some scrutiny
    if (orderValue > 100000) {
      score -= 15;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Determine risk level from final score
   */
  static getRiskLevel(score) {
    if (score >= SCORE_THRESHOLDS.GREEN) return RISK_LEVELS.SAFE;
    if (score >= SCORE_THRESHOLDS.YELLOW) return RISK_LEVELS.WARNING;
    return RISK_LEVELS.HIGH_RISK;
  }

  /**
   * Get recommended action based on risk level
   */
  static getAction(riskLevel) {
    switch (riskLevel) {
      case RISK_LEVELS.SAFE:
        return { type: 'auto_confirm', message: 'Safe customer. Auto-confirm order.' };
      case RISK_LEVELS.WARNING:
        return { type: 'verify_call', message: 'Risky customer. Call to confirm before shipping.' };
      case RISK_LEVELS.HIGH_RISK:
        return { type: 'hold_verify', message: 'High risk! Hold order. Request advance payment or OTP verification.' };
      case RISK_LEVELS.BLACKLISTED:
        return { type: 'reject', message: 'Blacklisted customer. Reject order.' };
      default:
        return { type: 'manual_review', message: 'Manual review required.' };
    }
  }

  /**
   * Cross-store analysis — check how many different stores reported this user
   */
  static async getCrossStoreAnalysis(hashedId) {
    const activities = await OrderActivity.find({ hashedId }).sort({ createdAt: -1 }).limit(50);

    if (activities.length === 0) {
      return { storesInteracted: 0, negativeReports: 0, recentActivity: [] };
    }

    const uniqueStores = [...new Set(activities.map(a => a.storeId))];
    const negativeStatuses = ['returned', 'refused', 'no_pick_up', 'fake_address', 'cancelled'];
    const negativeReports = activities.filter(a => negativeStatuses.includes(a.status)).length;

    const recentActivity = activities.slice(0, 5).map(a => ({
      status: a.status,
      date: a.createdAt,
      storeId: a.storeId,
    }));

    return {
      storesInteracted: uniqueStores.length,
      negativeReports,
      totalRecords: activities.length,
      recentActivity,
    };
  }

  /**
   * Update score after delivery result (the feedback loop)
   * Called when courier confirms delivery/return status
   */
  static async updateScore(hashedId, status, storeId, orderId, orderValue = 0, reason = '', address = '') {
    let userRecord = await TrustScore.findOne({ hashedId });

    if (!userRecord) {
      userRecord = await TrustScore.create({
        hashedId,
        globalScore: DEFAULT_SCORE,
      });
    }

    // Calculate score impact
    let scoreImpact = 0;
    const updates = { lastActivity: new Date() };

    switch (status) {
      case ORDER_STATUSES.DELIVERED:
        scoreImpact = SCORE_WEIGHTS.SUCCESSFUL_DELIVERY;
        updates.$inc = {
          totalOrders: 1,
          successfulDeliveries: 1,
          'stats.totalChecks': 0,
        };
        break;

      case ORDER_STATUSES.RETURNED:
        scoreImpact = SCORE_WEIGHTS.RETURN;
        updates.$inc = { totalOrders: 1, returns: 1 };
        break;

      case ORDER_STATUSES.REFUSED:
        scoreImpact = SCORE_WEIGHTS.COD_REFUSED;
        updates.$inc = { totalOrders: 1, refusals: 1 };
        break;

      case ORDER_STATUSES.NO_PICK_UP:
        scoreImpact = SCORE_WEIGHTS.NO_PICK_UP;
        updates.$inc = { totalOrders: 1, refusals: 1 };
        if (!userRecord.flags.includes('no_pick_up')) {
          updates.$addToSet = { flags: 'no_pick_up' };
        }
        break;

      case ORDER_STATUSES.FAKE_ADDRESS:
        scoreImpact = SCORE_WEIGHTS.FAKE_ADDRESS;
        updates.$inc = { totalOrders: 1, returns: 1 };
        if (!userRecord.flags.includes('fake_address')) {
          updates.$addToSet = { flags: 'fake_address' };
        }
        break;

      case ORDER_STATUSES.CANCELLED:
        scoreImpact = SCORE_WEIGHTS.CANCELLED_BY_CUSTOMER;
        updates.$inc = { totalOrders: 1, cancellations: 1 };
        break;

      case ORDER_STATUSES.PARTIAL:
        scoreImpact = SCORE_WEIGHTS.PARTIAL_DELIVERY;
        updates.$inc = { totalOrders: 1 };
        break;

      default:
        scoreImpact = 0;
        updates.$inc = { totalOrders: 1 };
    }

    // Check for repeat offender
    const negativeCount = (userRecord.returns || 0) + (userRecord.refusals || 0);
    if (negativeCount >= 3 && !userRecord.flags.includes('repeat_offender')) {
      if (!updates.$addToSet) updates.$addToSet = {};
      updates.$addToSet.flags = 'repeat_offender';
      scoreImpact *= SCORE_WEIGHTS.REPEAT_OFFENDER_MULTIPLIER;
    }

    // Apply score change
    let newScore = Math.round(Math.max(0, Math.min(100, userRecord.globalScore + scoreImpact)));
    updates.globalScore = newScore;
    updates.riskLevel = this.getRiskLevel(newScore);

    // Update TrustScore
    await TrustScore.findOneAndUpdate({ hashedId }, updates, { new: true });

    // Log the activity
    const addressResult = validateAddress(address);
    await OrderActivity.create({
      orderId,
      hashedId,
      storeId,
      status,
      reason,
      orderValue,
      address: {
        city: addressResult.city,
        area: address,
        isComplete: addressResult.isComplete,
      },
      scoreImpact,
    });

    // Add store report if negative
    const negativeStatuses = ['returned', 'refused', 'no_pick_up', 'fake_address'];
    if (negativeStatuses.includes(status)) {
      await TrustScore.findOneAndUpdate({ hashedId }, {
        $push: {
          reportedByStores: {
            storeId,
            reason: reason || status,
            reportedAt: new Date(),
          },
        },
      });
    }

    return {
      hashedId,
      previousScore: userRecord.globalScore,
      newScore,
      scoreImpact: Math.round(scoreImpact),
      riskLevel: this.getRiskLevel(newScore),
    };
  }
}

module.exports = ScoringEngine;
