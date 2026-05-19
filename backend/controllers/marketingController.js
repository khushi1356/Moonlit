const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const EmailCampaign = require('../models/EmailCampaign');

// @desc    Send bulk promotional emails
// @route   POST /api/marketing/send-email
// @access  Admin
exports.sendBulkEmail = async (req, res) => {
    try {
        const { subject, bodyHtml, targetAudience } = req.body; // bodyHtml is coming from React Rich Text Editor

        if (!subject || !bodyHtml) {
            return res.status(400).json({ success: false, message: 'Please provide subject and body content' });
        }

        let query = { role: 'customer' };
        
        // Example filter logic based on targetAudience (expand as needed)
        if (targetAudience === 'premium') {
            // Suppose you had a premium flag, you'd add it here. For now, we'll just use a placeholder
            // query.isPremium = true;
        } else if (targetAudience === 'inactive') {
            // Find users who haven't logged in recently (requires lastLogin field in User model)
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            query.updatedAt = { $lt: thirtyDaysAgo };
        }

        const customers = await User.find(query).select('email');
        
        if (customers.length === 0) {
            return res.status(404).json({ success: false, message: 'No customers found for this audience' });
        }

        // Map emails to an array
        const emailList = customers.map(user => user.email);

        // Send mail to multiple recipients using Bcc to hide other emails
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        const formattedHtml = sendEmail.template ? sendEmail.template(bodyHtml, subject) : bodyHtml;

        await transporter.sendMail({
            from: `"Moonlit" <${process.env.EMAIL_USER}>`,
            bcc: emailList.join(','), // Multiple emails in BCC
            subject: subject,
            html: formattedHtml
        });
        await EmailCampaign.create({
    subject: subject,
    bodyHtml: bodyHtml,
    targetUsersCount: emailList.length
});
        res.status(200).json({ 
            success: true, 
            message: `Email campaign sent successfully to ${emailList.length} users.` 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all email campaigns
// @route   GET /api/marketing
// @access  Admin
exports.getCampaigns = async (req, res) => {
    try {
        const campaigns = await EmailCampaign.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: campaigns.length, data: campaigns });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete an email campaign record
// @route   DELETE /api/marketing/:id
// @access  Admin
exports.deleteCampaign = async (req, res) => {
    try {
        const campaign = await EmailCampaign.findByIdAndDelete(req.params.id);
        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }
        res.status(200).json({ success: true, message: 'Campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};