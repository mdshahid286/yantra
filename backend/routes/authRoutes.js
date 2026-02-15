const express = require('express');
const { login, completeProfile, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/login', login);
router.post('/complete-profile', protect, completeProfile);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
