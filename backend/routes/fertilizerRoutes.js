const express = require('express');
const { calculateFertilizer, analyzeSoilReport } = require('../controllers/fertilizerController');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/calculate', calculateFertilizer);
router.post('/analyze', upload.single('report'), analyzeSoilReport);

module.exports = router;
