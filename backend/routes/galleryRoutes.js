const express = require('express');
const router = express.Router();
const { addImage, getGallery, deleteImage } = require('../controllers/galleryController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');

router.route('/')
    .get(getGallery)
    .post(protect, authorize('admin'), upload.single('image'), addImage);

router.route('/:id')
    .delete(protect, authorize('admin'), deleteImage);

module.exports = router;