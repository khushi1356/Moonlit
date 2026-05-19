const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getPaymentHistory } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/history', getPaymentHistory);
// Refund logic can be added similarly with Razorpay refund API

module.exports = router;