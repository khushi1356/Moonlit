const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }, 
    razorpay_order_id: { type: String, required: true }, 
    razorpay_payment_id: { type: String }, 
    razorpay_signature: { type: String }, 
    amount: { type: Number, required: true }, 
    status: { 
        type: String, 
        enum: ['created', 'authorized', 'captured', 'failed', 'refunded'], 
        default: 'created' 
    } 
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);