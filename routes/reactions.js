const express = require('express');
const router = express.Router();
const reactionController = require('../controllers/reactionController');
const auth = require('../middleware/auth');

router.post('/:messageId', auth, reactionController.addReaction);

module.exports = router;
