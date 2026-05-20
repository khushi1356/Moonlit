const Review = require('../models/Review');

exports.addReview = async (req, res) => {
    try {
        req.body.userId = req.user._id;
        const review = await Review.create(req.body);
        res.status(201).json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getReviews = async (req, res) => {
    try {
        const query = req.query.serviceId ? { serviceId: req.query.serviceId } : {};
        const reviews = await Review.find(query)
            .populate('userId', 'name profilePic')
            .populate('serviceId', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

        if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        
        await review.deleteOne();
        res.status(200).json({ success: true, message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};