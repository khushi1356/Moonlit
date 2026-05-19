const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// @desc    Get Admin Dashboard Statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Total Revenue (Sum of 'captured' payments)
        const payments = await Payment.find({ status: 'captured' });
        const revenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

        // 2. Total Bookings
        const totalBookings = await Booking.countDocuments();

        // 3. Registered Users (Customers)
        const users = await User.countDocuments({ role: 'customer' });

        // 4. Active Stylists
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
