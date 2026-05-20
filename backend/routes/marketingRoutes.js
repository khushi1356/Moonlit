const express = require('express');
const router = express.Router();

const { sendBulkEmail, getCampaigns, deleteCampaign } = require('../controllers/marketingController');

const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.route('/')
    .get(getCampaigns)
    .post(sendBulkEmail); 

router.route('/:id')
    .delete(deleteCampaign);

module.exports = router;