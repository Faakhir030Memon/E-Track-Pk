const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Store = require('./src/models/Store');

dotenv.config();

const seedExpiredStore = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Delete existing dummy if it exists
    await Store.findOneAndDelete({ email: 'dummy@store.com' });

    const expiredStore = new Store({
      storeName: 'Dummy Expired Store',
      email: 'dummy@store.com',
      phone: '03000000000',
      password: 'dummy123',
      storeId: 'DUMMY-001',
      isApproved: true,
      isVerified: true,
      subscription: {
        status: 'expired',
        plan: 'starter',
        expiryDate: new Date('2026-04-01'), // Already expired
        lastPaymentDate: new Date('2026-03-01'),
      },
      securityQuestion: {
        question: 'What was your first number?',
        answer: '03142347664'
      }
    });

    await expiredStore.save();
    console.log('Dummy Expired Store created successfully!');
    console.log('Email: dummy@store.com');
    console.log('Password: dummy123');

    process.exit();
  } catch (error) {
    console.error('Error seeding store:', error);
    process.exit(1);
  }
};

seedExpiredStore();
