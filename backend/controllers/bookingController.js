const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Payment = require('../models/Payment');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Customer)
exports.createBooking = async (req, res) => {
    try {
        const { serviceIds, stylistId, bookingDate, timeSlot } = req.body;

        // Calculate total amount from services
        const services = await Service.find({ _id: { $in: serviceIds } });
        let totalAmount = 0;
        services.forEach(service => {
            totalAmount += service.price; // Discounted price
        });

        const booking = await Booking.create({
            userId: req.user._id, // Got from authMiddleware
            serviceIds,
            stylistId,
            bookingDate,
            timeSlot,
            totalAmount
        });

        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/my
// @access  Private
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('serviceIds', 'name price image')
            .populate('stylistId', 'name');

        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (status === 'cancelled') {
            const payment = await Payment.findOne({ bookingId: req.params.id, status: 'captured' });
            if (payment && payment.razorpay_payment_id) {
                try {
                    await razorpay.payments.refund(payment.razorpay_payment_id, {
                        amount: payment.amount * 100,
                        speed: 'normal'
                    });
                    payment.status = 'refunded';
                    await payment.save();
                } catch (err) {
                    console.error('Refund error:', err);
                }
            }
        }

        const updateData = { status };
        if (status === 'cancelled') updateData.paymentStatus = 'refunded';

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all appointments
// @route   GET /api/bookings
// @access  Admin or Stylist
exports.getAllBookings = async (req, res) => {
    try {
        const query = req.user.role === 'stylist' ? { stylistId: req.user._id } : {};
        const bookings = await Booking.find(query)
            .populate('userId', 'name email phone')
            .populate('serviceIds', 'name price')
            .populate('stylistId', 'name');

        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin or the Customer who booked it)
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Make sure the user owns the booking, or is an admin
        if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this booking' });
        }

        // Process refund if payment was captured
        const payment = await Payment.findOne({ bookingId: req.params.id, status: 'captured' });
        if (payment && payment.razorpay_payment_id) {
            try {
                await razorpay.payments.refund(payment.razorpay_payment_id, {
                    amount: payment.amount * 100,
                    speed: 'normal'
                });
                payment.status = 'refunded';
                await payment.save();
                booking.paymentStatus = 'refunded';
            } catch (err) {
                console.error('Refund error:', err);
            }
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({ success: true, message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};