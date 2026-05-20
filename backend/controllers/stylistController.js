const User = require('../models/User');
const StylistProfile = require('../models/StylistProfile');
const bcrypt = require('bcryptjs');

exports.addStylist = async (req, res) => {
    try {
        const { userId, name, email, password, phone, specialization, bio, experience } = req.body;

        if (!req.file && !userId) {
            return res.status(400).json({ success: false, message: 'Stylist profile image is required' });
        }
        
        let user;
        
        if (userId) {
            
            user = await User.findById(userId);
            if (!user) return res.status(404).json({ success: false, message: 'User not found' });

            const existingProfile = await StylistProfile.findOne({ userId });
            if (existingProfile) {
                return res.status(400).json({ success: false, message: 'User is already a stylist' });
            }

            user.role = 'stylist';
            if (req.file) user.profilePic = req.file.path;
            await user.save();
        } else {
            
            let existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already registered' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = await User.create({
                name,
                email,
                password: hashedPassword,
                phone,
                role: 'stylist',
                profilePic: req.file.path,
                isEmailVerified: true
            });
        }

        let specArray = specialization;
        if (typeof specialization === 'string') {
            specArray = specialization.split(',').map(s => s.trim());
        }

        const stylistProfile = await StylistProfile.create({
            userId: user._id,
            specialization: specArray,
            bio,
            experience: Number(experience)
        });

        res.status(201).json({ 
            success: true, 
            message: 'Stylist added successfully',
            data: {
                user,
                profile: stylistProfile
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllStylists = async (req, res) => {
    try {
        
        const stylists = await StylistProfile.find()
            .populate('userId', 'name email phone profilePic');
            
        res.status(200).json({ success: true, count: stylists.length, data: stylists });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateStylist = async (req, res) => {
    try {
        const profile = await StylistProfile.findById(req.params.id);
        if (!profile) return res.status(404).json({ success: false, message: 'Stylist not found' });

        const { specialization, bio, experience } = req.body;
        
        let specArray = specialization;
        if (typeof specialization === 'string') {
            specArray = specialization.split(',').map(s => s.trim());
        }

        if (specialization) profile.specialization = specArray;
        if (bio) profile.bio = bio;
        if (experience) profile.experience = Number(experience);

        await profile.save();

        if (req.file) {
            await User.findByIdAndUpdate(profile.userId, { profilePic: req.file.path });
        }

        res.status(200).json({ success: true, message: 'Stylist updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteStylist = async (req, res) => {
    try {
        const profile = await StylistProfile.findById(req.params.id);
        if (!profile) return res.status(404).json({ success: false, message: 'Stylist not found' });

        await User.findByIdAndDelete(profile.userId);
        await profile.deleteOne();

        res.status(200).json({ success: true, message: 'Stylist and associated user deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};