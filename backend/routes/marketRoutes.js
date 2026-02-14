const express = require('express');
const { getMarketTrends, getMarketAnalysis } = require('../controllers/marketController');
const router = express.Router();

router.get('/trends', getMarketTrends);
router.post('/', getMarketAnalysis);

module.exports = router;
