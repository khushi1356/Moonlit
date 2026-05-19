const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Reference to Category Model [cite: 14]
    name: { type: String, required: true }, // Service name [cite: 14]
    description: { type: String }, // Details about the service [cite: 14]
    mrp: { type: Number, required: true }, // Original Market Price [cite: 14]
    price: { type: Number, required: true }, // Actual Selling Price after discount [cite: 14]
    discountPercentage: { type: Number, default: 0 }, // Current discount [cite: 14]
    duration: { type: Number, required: true }, // Time required in minutes [cite: 14]
    image: { type: String }, // Service preview image [cite: 14]
    isActive: { type: Boolean, default: true } // To enable/disable service display [cite: 14]
}, { timestamps: true });

// Pre-save middleware to automatically calculate price based on discount logic
serviceSchema.pre('save', function() {
    if (this.discountPercentage > 0) {
        // Calculation logic for discount [cite: 131]
        this.price = this.mrp - (this.mrp * (this.discountPercentage / 100));
    } else {
        this.price = this.mrp;
    }
});

module.exports = mongoose.model('Service', serviceSchema);