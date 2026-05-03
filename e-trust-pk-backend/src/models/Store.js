const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const storeSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  storeId: {
    type: String,
    required: true,
    unique: true,
  },
  platform: {
    type: String,
    enum: ['shopify', 'woocommerce', 'custom', 'instagram', 'facebook', 'daraz', 'other'],
    default: 'custom',
  },
  webhookUrl: {
    type: String,
    default: '',
  },
  apiKey: {
    type: String,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  stats: {
    totalChecks: { type: Number, default: 0 },
    highRiskBlocked: { type: Number, default: 0 },
    moneySaved: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
});

// Hash password before saving
storeSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
storeSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Store', storeSchema);
