const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, 
    name: { type: String, required: true }, 
    description: { type: String }, 
    mrp: { type: Number, required: true }, 
    price: { type: Number, required: true }, 
    discountPercentage: { type: Number, default: 0 }, 
    duration: { type: Number, required: true }, 
    image: { type: String }, 
    isActive: { type: Boolean, default: true } 
}, { timestamps: true });

serviceSchema.pre('save', function() {
    if (this.discountPercentage > 0) {
        
        this.price = this.mrp - (this.mrp * (this.discountPercentage / 100));
    } else {
        this.price = this.mrp;
    }
});

serviceSchema.index({ categoryId: 1 });
serviceSchema.index({ isActive: 1 });

module.exports = mongoose.model('Service', serviceSchema);