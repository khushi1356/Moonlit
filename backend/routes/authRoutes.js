const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// 1. Controller se saare functions carefully destructure karein
const { 
    register, 
    verifyOtp, 
    login, 
    forgotPassword, 
    resetPassword 
} = require('../controllers/authController');

const { updateProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');

// --- Standard Auth Routes ---
router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// --- Get Current User Profile ---
router.get('/profile', protect, async (req, res) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.user.id).select('-password -otp -otpExpiry');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// --- User Profile Route ---
router.put('/profile', protect, upload.single('profilePic'), updateProfile);

// --- Google OAuth Routes ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/login-failed' }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
    }
);

module.exports = router;