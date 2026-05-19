const express = require('express');
const router = express.Router();
const { createCoupon, getCoupons, updateCoupon, deleteCoupon, applyCoupon } = require('../controllers/couponController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
    .get(getCoupons) 
    .post(protect, authorize('admin'), createCoupon); 

// Place /apply BEFORE /:id to prevent it from being treated as an ID
router.post('/apply', applyCoupon);

router.route('/:id')
    .put(protect, authorize('admin'), updateCoupon)
    .delete(protect, authorize('admin'), deleteCoupon); 

module.exports = router;