const mongoose = require('mongoose');

const stylistProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    specialization: [{ type: String }], 
    bio: { type: String }, 
    experience: { type: Number, required: true }, 
    rating: { type: Number, default: 0 } 
}, { timestamps: true });

module.exports = mongoose.model('StylistProfile', stylistProfileSchema);