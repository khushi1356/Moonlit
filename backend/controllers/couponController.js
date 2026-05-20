const Coupon = require('../models/Coupon');

exports.createCoupon = async (req, res) => {
    try {
        const existing = await Coupon.findOne({ code: { $regex: new RegExp(`^${req.body.code}$`, 'i') } });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Coupon with this code already exists' });
        }

        const coupon = await Coupon.create(req.body);
        res.status(201).json({ success: true, data: coupon });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getCoupons = async (req, res) => {
    try {
        let query = {};

        const coupons = await Coupon.find();
        res.status(200).json({ success: true, data: coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
        res.status(200).json({ success: true, data: coupon });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
        res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.applyCoupon = async (req, res) => {
    try {
        const { code, amount } = req.body;
        
        if (!code || !amount) {
            return res.status(400).json({ success: false, message: 'Please provide coupon code and amount' });
        }

        const coupon = await Coupon.findOne({ code: { $regex: new RegExp(`^${code}$`, 'i') } });
        
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Invalid coupon code' });
        }

        if (!coupon.isActive) {
            return res.status(400).json({ success: false, message: 'This coupon is no longer active' });
        }

        if (new Date() > new Date(coupon.expiry)) {
            return res.status(400).json({ success: false, message: 'This coupon has expired' });
        }

        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
            return res.status(400).json({ success: false, message: 'This coupon has reached its usage limit' });
        }

        if (amount < coupon.minOrderValue) {
            return res.status(400).json({ success: false, message: `Minimum order value for this coupon is $${coupon.minOrderValue}` });
        }

        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = (amount * coupon.discountValue) / 100;
        } else if (coupon.discountType === 'flat') {
            discountAmount = coupon.discountValue;
        }

        if (discountAmount > amount) {
            discountAmount = amount;
        }

        res.status(200).json({ 
            success: true, 
            discountAmount, 
            couponId: coupon._id,
            message: 'Coupon applied successfully!' 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};