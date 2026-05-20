const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getAllUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');

router.route('/profile')
    .get(protect, getProfile)
    .put(protect, upload.single('profilePic'), updateProfile);

router.route('/')
    .get(protect, authorize('admin'), getAllUsers);

router.route('/:id')
    .put(protect, authorize('admin'), updateUser)
    .delete(protect, authorize('admin'), deleteUser);

module.exports = router;