const express = require('express');
const router = express.Router();
const { addReview, getReviews, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(getReviews)
    .post(protect, addReview);

router.route('/:id')
    .delete(protect, deleteReview);

module.exports = router;