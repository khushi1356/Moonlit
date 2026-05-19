const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const sendEmail = require('../utils/sendEmail');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { amount, bookingId } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Valid amount is required' });
        }

        const options = {
            amount: Math.round(amount * 100), // Amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Save initial payment record (bookingId optional at this stage)
        await Payment.create({
            bookingId: bookingId || null,
            razorpay_order_id: order.id,
            amount: amount,
            status: 'created'
        });

        res.status(200).json({
            success: true,
            id: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Verify Payment & Trigger Email
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Verify Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return res.status(400).json({ success: false, message: 'Payment signature invalid' });
        }

        // Update Payment Record
        await Payment.findOneAndUpdate(
            { razorpay_order_id },
            { razorpay_payment_id, razorpay_signature, status: 'captured' },
            { new: true }
        );

        // Booking update & email handled separately after booking is created
        res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Payment History
// @route   GET /api/payments/history
// @access  Private
exports.getPaymentHistory = async (req, res) => {
    try {
        let query = {};
        // If not admin, only show their own payment history
        if (req.user.role !== 'admin') {
            const userBookings = await Booking.find({ userId: req.user._id }).select('_id');
            const bookingIds = userBookings.map(b => b._id);
            query = { bookingId: { $in: bookingIds } };
        }

        const payments = await Payment.find(query).populate({
            path: 'bookingId',
            populate: { path: 'serviceIds', select: 'name' }
        });

        res.status(200).json({ success: true, count: payments.length, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Initiate Refund
// @route   POST /api/payments/refund
// @access  Admin
exports.initiateRefund = async (req, res) => {
    try {
        const { paymentId, bookingId } = req.body;
        const payment = await Payment.findOne({ razorpay_payment_id: paymentId });

        if (!payment) return res.status(404).json({ success: false, message: 'Payment record not found' });

        const refund = await razorpay.payments.refund(paymentId, {
            amount: payment.amount * 100, // Full refund
            speed: 'normal',
            notes: { bookingId: bookingId }
        });

        payment.status = 'refunded'; // Update status if needed or handle via webhook
        await payment.save();

        await Booking.findByIdAndUpdate(bookingId, { paymentStatus: 'refunded', status: 'cancelled' });

        res.status(200).json({ success: true, refund });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};