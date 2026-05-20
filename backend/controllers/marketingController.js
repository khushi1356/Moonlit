const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const EmailCampaign = require('../models/EmailCampaign');

exports.sendBulkEmail = async (req, res) => {
    try {
        const { subject, bodyHtml, targetAudience } = req.body; 

        if (!subject || !bodyHtml) {
            return res.status(400).json({ success: false, message: 'Please provide subject and body content' });
        }

        let query = { role: 'customer' };

        if (targetAudience === 'premium') {

        } else if (targetAudience === 'inactive') {
            
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            query.updatedAt = { $lt: thirtyDaysAgo };
        }

        const customers = await User.find(query).select('email');
        
        if (customers.length === 0) {
            return res.status(404).json({ success: false, message: 'No customers found for this audience' });
        }

        const emailList = customers.map(user => user.email);

        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        const formattedHtml = sendEmail.template ? sendEmail.template(bodyHtml, subject) : bodyHtml;

        await transporter.sendMail({
            from: `"Moonlit" <${process.env.EMAIL_USER}>`,
            bcc: emailList.join(','), 
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

exports.getCampaigns = async (req, res) => {
    try {
        const campaigns = await EmailCampaign.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: campaigns.length, data: campaigns });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

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