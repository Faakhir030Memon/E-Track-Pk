const mongoose = require('mongoose');

const orderActivitySchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    index: true,
  },
  hashedId: {
    type: String,
    required: true,
    index: true,
  },
  storeId: {
    type: String,
    required: true,
    index: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['delivered', 'returned', 'cancelled', 'refused', 'no_pick_up', 'fake_address', 'partial', 'pending'],
    default: 'pending',
  },
  reason: {
    type: String,
    default: '',
  },
  orderValue: {
    type: Number,
    default: 0,
  },
  address: {
    city: String,
    area: String,
    isComplete: { type: Boolean, default: true },
  },
  scoreImpact: {
    type: Number,
    default: 0, // How much this order affected the user's score
  },
}, {
  timestamps: true,
});

// Compound indexes for cross-store analysis
orderActivitySchema.index({ hashedId: 1, createdAt: -1 });
orderActivitySchema.index({ storeId: 1, createdAt: -1 });
orderActivitySchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('OrderActivity', orderActivitySchema);
