const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // User ka full name [cite: 10]
    email: { type: String, required: true, unique: true }, // Unique Email (Primary Key) [cite: 10]
    password: { type: String }, // Hashed password (Not required for Google users) [cite: 10]
    googleId: { type: String }, // Google OAuth unique ID [cite: 10]
    phone: { type: String }, // Contact number [cite: 10]
    profilePic: { type: String }, // Profile image URL [cite: 10]
    role: { type: String, enum: ['admin', 'customer', 'stylist'], default: 'customer' }, // Role [cite: 10]
    otp: { type: String }, // Verification code sent via Email [cite: 10]
    otpExpiry: { type: Date }, // Expiration time for OTP [cite: 10]
    isEmailVerified: { type: Boolean, default: false } // OTP verification status [cite: 10]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);