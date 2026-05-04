const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Store = require('./src/models/Store');

dotenv.config();

const approveAll = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/e-trust-pk');
    console.log('Connected to MongoDB...');

    const result = await Store.updateMany(
      { role: 'store' },
      { 
        isApproved: true, 
        'subscription.status': 'active',
        'subscription.plan': 'growth' 
      }
    );

    console.log(`Successfully approved ${result.modifiedCount} stores.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

approveAll();
