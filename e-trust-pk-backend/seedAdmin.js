const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const Store = require('./src/models/Store');
const { generateStoreId, generateApiKey } = require('./src/utils/hashEngine');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/e-trust-pk');
    console.log('Connected to MongoDB...');

    const adminEmail = 'MymnSaaB@admin.com';
    const existingAdmin = await Store.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin account already exists. Updating credentials...');
      const salt = await bcrypt.genSalt(12);
      existingAdmin.password = 'Mymn@access.com'; 
      existingAdmin.role = 'admin';
      existingAdmin.isApproved = true;
      existingAdmin.securityQuestion = {
        question: 'What was your first number?',
        answer: '03142347664'
      };
      await existingAdmin.save();
    } else {
      console.log('Creating new admin account...');
      await Store.create({
        storeName: 'E-Trust Admin',
        email: adminEmail,
        phone: '03142347664',
        password: 'Mymn@access.com',
        storeId: 'ADMIN-001',
        apiKey: generateApiKey(),
        role: 'admin',
        isApproved: true,
        isVerified: true,
        securityQuestion: {
          question: 'What was your first number?',
          answer: '03142347664'
        }
      });
    }

    console.log('Admin seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedAdmin();
