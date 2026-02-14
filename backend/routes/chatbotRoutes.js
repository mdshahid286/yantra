const express = require('express');
const { getChatResponse } = require('../controllers/chatbotController');
const router = express.Router();

router.post('/', getChatResponse);

module.exports = router;
