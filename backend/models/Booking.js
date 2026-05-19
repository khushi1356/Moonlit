const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Customer Ref [cite: 16]
    serviceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }], // Array of Service IDs [cite: 16]
    stylistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Stylist Ref [cite: 16]
    bookingDate: { type: Date, required: true }, // Date of appointment [cite: 16]
    timeSlot: { type: String, required: true }, // E.g., 10:00 AM [cite: 16]
    totalAmount: { type: Number, required: true }, // Calculated final amount [cite: 16]
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
        default: 'pending' 
    }, // Booking Status [cite: 16]
    paymentStatus: { 
        type: String, 
        enum: ['unpaid', 'paid', 'refunded'], 
        default: 'unpaid' 
    } // Payment Status [cite: 18, 20]
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);