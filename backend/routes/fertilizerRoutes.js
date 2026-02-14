const express = require('express');
const { calculateFertilizer } = require('../controllers/fertilizerController');
const router = express.Router();

router.post('/calculate', calculateFertilizer);

module.exports = router;
