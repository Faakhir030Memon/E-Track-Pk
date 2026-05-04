const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Store = require('./src/models/Store');

dotenv.config();

const approveAll = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/e-trust-pk');
    console.log('Connected to MongoDB...');

    // Approve all stores and set them to active growth plan
    // We use a loop to ensure we don't overwrite paymentDetails if they exist
    const stores = await Store.find({ role: 'store' });
    let updatedCount = 0;

    for (let store of stores) {
      store.isApproved = true;
      store.isActive = true;
      store.subscription.status = 'active';
      if (!store.subscription.plan || store.subscription.plan === 'free') {
        store.subscription.plan = 'growth';
      }
      await store.save();
      updatedCount++;
    }

    console.log(`Successfully updated ${updatedCount} stores.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

approveAll();
