const express = require('express');
const { textToSpeech, speechToText } = require('../controllers/voiceController');
const router = express.Router();

router.post('/tts', textToSpeech);
router.post('/stt', speechToText);

module.exports = router;
