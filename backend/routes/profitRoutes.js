const express = require('express');
const { predictProfit } = require('../controllers/profitController');
const router = express.Router();

router.post('/predict', predictProfit);

module.exports = router;
