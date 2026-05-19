const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { createBooking, getMyBookings, updateBookingStatus, getAllBookings, deleteBooking } = require('../controllers/bookingController');

router.use(protect);

router.route('/')
    .post(createBooking)
    .get(authorize('admin', 'stylist'), getAllBookings);

router.get('/my', getMyBookings);

router.route('/:id')
    .delete(deleteBooking);

router.patch('/:id/status', authorize('admin', 'stylist'), updateBookingStatus);

module.exports = router;