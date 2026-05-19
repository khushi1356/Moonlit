const express = require('express');
const router = express.Router();

// 1. Import all category controller functions
const { 
    createCategory, 
    getCategories, 
    updateCategory, 
    deleteCategory 
} = require('../controllers/categoryController');

// 2. Import Auth & Cloudinary middlewares
const { protect, authorize } = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');

// 3. Define Routes
router.route('/')
    .get(getCategories) // Public can view categories
    .post(protect, authorize('admin'), upload.single('image'), createCategory); // Admin can create

router.route('/:id')
    .put(protect, authorize('admin'), upload.single('image'), updateCategory) // Admin can update
    .delete(protect, authorize('admin'), deleteCategory); // Admin can delete

module.exports = router;