/**
 * E-Trust PK Scoring Constants
 * Weightage system for Trust Score calculation
 */

const SCORE_WEIGHTS = {
  SUCCESSFUL_DELIVERY: +5,
  RETURN: -10,
  FAKE_ADDRESS: -20,
  NO_PICK_UP: -15,
  CANCELLED_BY_CUSTOMER: -8,
  PARTIAL_DELIVERY: -3,
  COD_REFUSED: -25,
  REPEAT_OFFENDER_MULTIPLIER: 1.5, // Applied when same behavior repeated 3+ times
};

const SCORE_THRESHOLDS = {
  GREEN: 80,   // Safe customer — auto-confirm
  YELLOW: 50,  // Risky — requires seller confirmation
  RED: 0,      // High risk — hold order + verification required
};

const RISK_LEVELS = {
  SAFE: 'safe',
  WARNING: 'warning',
  HIGH_RISK: 'high_risk',
  BLACKLISTED: 'blacklisted',
};

const DEFAULT_SCORE = 70; // New users start with neutral-positive score

const RECENCY_DECAY = {
  DAYS_THRESHOLD: 180,  // 6 months
  DECAY_FACTOR: 0.5,    // Old negative points worth 50% after threshold
};

const ORDER_STATUSES = {
  DELIVERED: 'delivered',
  RETURNED: 'returned',
  CANCELLED: 'cancelled',
  REFUSED: 'refused',
  NO_PICK_UP: 'no_pick_up',
  FAKE_ADDRESS: 'fake_address',
  PARTIAL: 'partial',
};

module.exports = {
  SCORE_WEIGHTS,
  SCORE_THRESHOLDS,
  RISK_LEVELS,
  DEFAULT_SCORE,
  RECENCY_DECAY,
  ORDER_STATUSES,
};
