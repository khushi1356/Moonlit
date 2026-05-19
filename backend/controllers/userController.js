const User = require('../models/User');

// @desc    Update User Profile (Custom logic for Stylist image)
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const updateData = { ...req.body };

        // Requirement Logic: Agar role 'stylist' hai aur purani image nahi hai, toh upload zaruri hai
        if (user.role === 'stylist') {
            if (!req.file && !user.profilePic) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Stylist profile must have a profile image' 
                });
            }
        }

        if (req.file) {
            updateData.profilePic = req.file.path;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Current User Profile
// @route   GET /api/users/profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).select('-password');
        
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};