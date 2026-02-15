const express = require('express');
const { recommendCrop, getSowingPlan } = require('../controllers/cropController');
const router = express.Router();

router.post('/', recommendCrop);
router.post('/sowing-plan', getSowingPlan);

module.exports = router;
