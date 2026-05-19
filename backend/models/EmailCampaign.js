const mongoose = require('mongoose');

const emailCampaignSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    bodyHtml: { type: String, required: true },
    targetUsersCount: { type: Number },
    sentAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('EmailCampaign', emailCampaignSchema);