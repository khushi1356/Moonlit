const express = require('express');
const router = express.Router();
const { addStylist, getAllStylists, updateStylist, deleteStylist } = require('../controllers/stylistController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');

router.route('/')
    .get(getAllStylists)
    .post(protect, authorize('admin'), upload.single('profilePic'), addStylist);

router.route('/:id')
    .put(protect, authorize('admin'), upload.single('profilePic'), updateStylist)
    .delete(protect, authorize('admin'), deleteStylist);

module.exports = router;