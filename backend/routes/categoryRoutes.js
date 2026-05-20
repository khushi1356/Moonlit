const express = require('express');
const router = express.Router();

const { 
    createCategory, 
    getCategories, 
    updateCategory, 
    deleteCategory 
} = require('../controllers/categoryController');

const { protect, authorize } = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');

router.route('/')
    .get(getCategories) 
    .post(protect, authorize('admin'), upload.single('image'), createCategory); 

router.route('/:id')
    .put(protect, authorize('admin'), upload.single('image'), updateCategory) 
    .delete(protect, authorize('admin'), deleteCategory); 

module.exports = router;