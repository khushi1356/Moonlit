const mongoose = require('mongoose');

const stylistProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Role must be 'stylist' [cite: 22]
    specialization: [{ type: String }], // List of services they excel in [cite: 22]
    bio: { type: String }, // Stylist introduction [cite: 22]
    experience: { type: Number, required: true }, // Years of experience [cite: 22]
    rating: { type: Number, default: 0 } // Average customer rating [cite: 22]
}, { timestamps: true });

module.exports = mongoose.model('StylistProfile', stylistProfileSchema);