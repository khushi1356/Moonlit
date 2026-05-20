const Contact = require('../models/Contact');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.submitContact = async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json({ success: true, message: 'Enquiry submitted successfully', data: contact });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort('-createdAt');
        res.status(200).json({ success: true, count: contacts.length, data: contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
        res.status(200).json({ success: true, data: contact });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.replyToContact = async (req, res) => {
    try {
        const { replyMessage } = req.body;
        if (!replyMessage) {
            return res.status(400).json({ success: false, message: 'Reply message is required' });
        }

        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact message not found' });
        }

        const user = await User.findOne({ email: contact.email });

        if (user) {
            
            await Notification.create({
                userId: user._id,
                title: `Reply: ${contact.subject}`,
                message: replyMessage,
                isRead: false,
            });
        }

        await Contact.findByIdAndUpdate(req.params.id, { status: 'replied', isResolved: true });

        res.status(200).json({
            success: true,
            message: user
                ? 'Reply sent as in-app notification to the customer.'
                : 'Reply recorded. Customer is not a registered user, so no in-app notification was created.',
            notificationSent: !!user,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};