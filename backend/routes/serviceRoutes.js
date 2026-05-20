const express = require('express');
const router = express.Router();

const { 
    createService, 
    getServices, 
    getServiceById, 
    applyBulkDiscount, 
    resetDiscount,
    updateService,
    deleteService
} = require('../controllers/serviceController');

const { protect, authorize } = require('../middlewares/authMiddleware');

const { upload } = require('../config/cloudinary');

router.route('/')
    .get(getServices)
    .post(protect, authorize('admin'), upload.single('image'), createService);

router.post('/bulk-discount', protect, authorize('admin'), applyBulkDiscount);
router.post('/reset-discount', protect, authorize('admin'), resetDiscount);

router.route('/:id')
    .get(getServiceById)
    .put(protect, authorize('admin'), upload.single('image'), updateService)
    .delete(protect, authorize('admin'), deleteService);

module.exports = router;