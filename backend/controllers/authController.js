const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Helper function to generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register a new user & Send OTP
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate 6-digit OTP using crypto
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

        // Create User
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            otp,
            otpExpiry
        });

        // Send Email (Ensure your .env has EMAIL_USER and EMAIL_PASS set up)
        await sendEmail({
            email: user.email,
            subject: 'Verify your account',
            message: `<p>Hello ${name},</p>
                      <p>Thank you for choosing Moonlit. Please use the following One-Time Password (OTP) to verify your account. This code is valid for 10 minutes.</p>
                      <div class="otp-box">${otp}</div>`
        });

        res.status(201).json({ 
            success: true, 
            message: 'User registered. Please check your email for OTP.',
            userId: user._id 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.isEmailVerified) {
            return res.status(400).json({ success: false, message: 'Email already verified' });
        }

        if (user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        user.isEmailVerified = true;
        user.otp = undefined; 
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Email verified successfully. You can now login.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    User Login
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        // Only require email verification for customers (admin/stylist are created by the system)
        if (user.role === 'customer' && !user.isEmailVerified) {
            return res.status(401).json({ success: false, message: 'Please verify your email first using the OTP' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const otp = crypto.randomInt(100000, 999999).toString();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await sendEmail({
            email: user.email,
            subject: 'Password Reset OTP',
            message: `<p>Hello,</p>
                      <p>We received a request to reset the password for your Moonlit account. Please use the following One-Time Password (OTP) to proceed. This code is valid for 10 minutes.</p>
                      <div class="otp-box">${otp}</div>`
        });

        res.status(200).json({ success: true, message: 'OTP sent to email' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email, otp, otpExpiry: { $gt: Date.now() } });

        if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};