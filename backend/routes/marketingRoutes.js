const express = require('express');
const router = express.Router();

// 1. Controller function import karein
const { sendBulkEmail, getCampaigns, deleteCampaign } = require('../controllers/marketingController');

// 2. Auth middlewares import karein (Kyunki sirf Admin hi emails bhej sakta hai)
const { protect, authorize } = require('../middlewares/authMiddleware');

// 3. Define the routes
router.use(protect);
router.use(authorize('admin'));

router.route('/')
    .get(getCampaigns)
    .post(sendBulkEmail); // This maps to createCampaign in frontend

router.route('/:id')
    .delete(deleteCampaign);

module.exports = router;