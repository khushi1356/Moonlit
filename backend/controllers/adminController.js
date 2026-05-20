const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

exports.getDashboardStats = async (req, res) => {
    try {
        
        const payments = await Payment.find({ status: 'captured' });
        const revenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

        const totalBookings = await Booking.countDocuments();

        const users = await User.countDocuments({ role: 'customer' });

        const stylists = await User.countDocuments({ role: 'stylist' });

        res.status(200).json({
            success: true,
            data: {
                revenue,
                totalBookings,
                users,
                stylists
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
