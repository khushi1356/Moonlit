const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    serviceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }], 
    stylistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    bookingDate: { type: Date, required: true }, 
    timeSlot: { type: String, required: true }, 
    totalAmount: { type: Number, required: true }, 
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
        default: 'pending' 
    }, 
    paymentStatus: { 
        type: String, 
        enum: ['unpaid', 'paid', 'refunded'], 
        default: 'unpaid' 
    } 
}, { timestamps: true });

bookingSchema.index({ stylistId: 1, bookingDate: 1 });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);