const express = require('express');
const { textToSpeech, speechToText } = require('../controllers/voiceController');
const router = express.Router();

const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
    }
});

const upload = multer({ storage: storage });

router.post('/tts', textToSpeech);
router.post('/stt', upload.single('audio'), speechToText);

module.exports = router;