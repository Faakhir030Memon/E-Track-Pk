require('dotenv').config();
const mongoose = require('mongoose');
const crypto = require('crypto');
const TrustScore = require('./src/models/TrustScore');
const OrderActivity = require('./src/models/OrderActivity');
const Store = require('./src/models/Store');
const { hashPhone } = require('./src/utils/hashEngine');

/**
 * Realistic Data Seeder for E-Trust PK
 * Generates historical fraud data to simulate a live network
 */

const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala'];
const STATUSES = ['delivered', 'returned', 'refused', 'no_pick_up', 'fake_address', 'cancelled'];
const REASONS = [
  'Customer refused at doorstep',
  'Fake address - house does not exist',
  'Number not reachable after multiple attempts',
  'Customer said they never ordered',
  'Found on another blacklist',
  'Impulse buyer - cancelled within 1 hour',
  'Partial payment refused'
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🌱 Connected to MongoDB for seeding...');

    // 1. Clear existing data (Optional - for clean start)
    await TrustScore.deleteMany({});
    await OrderActivity.deleteMany({});
    console.log('🧹 Old data cleared.');

    // 2. Create some sample users (Hashed)
    const numUsers = 50;
    const users = [];

    for (let i = 0; i < numUsers; i++) {
      const phone = `03${Math.floor(100000000 + Math.random() * 900000000)}`;
      const hashedId = hashPhone(phone);
      
      // Randomly make some users "Bad" and some "Good"
      const isFraudulent = Math.random() < 0.2; // 20% fraud rate in seed data
      const score = isFraudulent ? Math.floor(15 + Math.random() * 30) : Math.floor(75 + Math.random() * 25);
      
      const user = await TrustScore.create({
        hashedId,
        globalScore: score,
        totalOrders: Math.floor(Math.random() * 20),
        successfulDeliveries: isFraudulent ? 1 : Math.floor(Math.random() * 15),
        returns: isFraudulent ? Math.floor(5 + Math.random() * 5) : Math.floor(Math.random() * 2),
        riskLevel: score < 50 ? 'high_risk' : score < 80 ? 'warning' : 'safe',
        flags: isFraudulent ? ['fake_address', 'repeat_offender'] : [],
        lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
      users.push(user);
    }

    // 3. Create historical order activities
    console.log('📦 Generating historical orders...');
    const numOrders = 300;
    for (let i = 0; i < numOrders; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const status = randomUser.globalScore < 40 ? 
        STATUSES[Math.floor(Math.random() * (STATUSES.length - 1)) + 1] : // Bias bad users to bad statuses
        Math.random() > 0.8 ? 'returned' : 'delivered'; // Good users mostly delivered

      await OrderActivity.create({
        orderId: `ORD-${1000 + i}`,
        hashedId: randomUser.hashedId,
        storeId: `store_${Math.floor(Math.random() * 5) + 1}`,
        status,
        orderValue: Math.floor(2000 + Math.random() * 45000),
        address: {
          city: CITIES[Math.floor(Math.random() * CITIES.length)],
          area: 'Sample Street, Phase ' + (Math.floor(Math.random() * 8) + 1),
          isComplete: Math.random() > 0.1
        },
        reason: ['delivered', 'pending'].includes(status) ? '' : REASONS[Math.floor(Math.random() * REASONS.length)],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }

    console.log(`✅ Seeding complete! Generated ${numUsers} users and ${numOrders} order records.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
