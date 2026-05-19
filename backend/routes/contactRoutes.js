const express = require('express');
const router = express.Router();
const { submitContact, getContacts, replyToContact, updateContact, deleteContact } = require('../controllers/contactController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
    .post(submitContact)
    .get(protect, authorize('admin'), getContacts);

// More specific route first — must come BEFORE /:id
router.post('/:id/reply', protect, authorize('admin'), replyToContact);

router.route('/:id')
    .put(protect, authorize('admin'), updateContact)
    .delete(protect, authorize('admin'), deleteContact);

module.exports = router;