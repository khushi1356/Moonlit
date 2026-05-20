const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    password: { type: String }, 
    googleId: { type: String }, 
    phone: { type: String }, 
    profilePic: { type: String }, 
    role: { type: String, enum: ['admin', 'customer', 'stylist'], default: 'customer' }, 
    otp: { type: String }, 
    otpExpiry: { type: Date }, 
    isEmailVerified: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);