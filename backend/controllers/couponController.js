const Coupon = require('../models/Coupon');

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Admin
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

// @desc    Get all coupons (Admin gets all, Public gets active)
// @route   GET /api/coupons
// @access  Public / Admin
exports.getCoupons = async (req, res) => {
    try {
        let query = {};
        // If it's a public request (from customer frontend), usually we'd only want active ones.
        // But for admin dashboard, we want all. Let's just return all, or check if we can.
        // Let's just return all for now to let admin manage them.
        const coupons = await Coupon.find();
        res.status(200).json({ success: true, data: coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Admin
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

// @desc    Delete/Deactivate a coupon
// @route   DELETE /api/coupons/:id
// @access  Admin
exports.deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
        res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Apply a coupon code
// @route   POST /api/coupons/apply
// @access  Public
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

        // Ensure discount doesn't exceed the total amount
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