const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    caption: { type: String },
    category: { type: String } // e.g., 'Haircut', 'Makeup', 'Bridal'
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);