const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

router.get('/groups', communityController.getGroups);
router.get('/messages/:groupId', communityController.getMessages);
router.post('/message', communityController.sendMessage);

module.exports = router;
