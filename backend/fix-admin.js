

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const fix = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

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
