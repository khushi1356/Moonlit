/**
 * Run this once to fix your admin account:
 * node fix-admin.js
 *
 * It marks the user with role=admin as isEmailVerified=true
 * so they can log into the Admin Portal.
 */

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const fix = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Mark ALL admin & stylist users as verified
    const result = await User.updateMany(
      { role: { $in: ['admin', 'stylist'] } },
      { $set: { isEmailVerified: true } }
    );

    console.log(`✅ Updated ${result.modifiedCount} user(s) — admin/stylist accounts are now verified.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

fix();
