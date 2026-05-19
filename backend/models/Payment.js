const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }, // Ref: Booking ID [cite: 24]
    razorpay_order_id: { type: String, required: true }, // Order ID from Razorpay [cite: 24]
    razorpay_payment_id: { type: String }, // Payment ID after success [cite: 24]
    razorpay_signature: { type: String }, // Verification signature [cite: 24]
    amount: { type: Number, required: true }, // Transaction amount in INR [cite: 24]
    status: { 
        type: String, 
        enum: ['created', 'authorized', 'captured', 'failed', 'refunded'], 
        default: 'created' 
    } // Status enum [cite: 24]
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);