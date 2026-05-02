const mongoose = require('mongoose');

const trustScoreSchema = new mongoose.Schema({
  hashedId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  globalScore: {
    type: Number,
    default: 70, // Neutral-positive start
    min: 0,
    max: 100,
  },
  totalOrders: {
    type: Number,
    default: 0,
  },
  successfulDeliveries: {
    type: Number,
    default: 0,
  },
  returns: {
    type: Number,
    default: 0,
  },
  cancellations: {
    type: Number,
    default: 0,
  },
  refusals: {
    type: Number,
    default: 0,
  },
  flags: [{
    type: String,
    enum: ['fake_address', 'no_pick_up', 'repeat_offender', 'impulse_buyer', 'cod_abuser', 'address_mismatch'],
  }],
  riskLevel: {
    type: String,
    enum: ['safe', 'warning', 'high_risk', 'blacklisted'],
    default: 'safe',
  },
  reportedByStores: [{
    storeId: String,
    reason: String,
    reportedAt: { type: Date, default: Date.now },
  }],
  firstSeen: {
    type: Date,
    default: Date.now,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Compound index for efficient queries
trustScoreSchema.index({ globalScore: 1, riskLevel: 1 });
trustScoreSchema.index({ lastActivity: -1 });

module.exports = mongoose.model('TrustScore', trustScoreSchema);
