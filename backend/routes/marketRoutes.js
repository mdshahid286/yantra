const express = require('express');
const { getMarketTrends } = require('../controllers/marketController');
const router = express.Router();

router.get('/trends', getMarketTrends);

module.exports = router;
