const express = require('express');
const router = express.Router();
const { getUserNotifications, createNotification, deleteNotification, markNotificationRead } = require('../controllers/notificationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
    .get(getUserNotifications)
    .post(authorize('admin'), createNotification);

router.put('/read/:id', markNotificationRead);

router.route('/:id')
    .delete(deleteNotification);

module.exports = router;