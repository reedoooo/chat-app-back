const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Middleware to log each time a route is accessed
const logRoute = (req, res, next) => {
  console.log(`Accessed route: ${req.path}`);
  next();
};

router.post('/', messageController.sendMessage);
router.get('/:roomId', messageController.getChatRoomMessages);
router.get('/message/:messageId', messageController.getMessage);
router.patch('/message/:messageId', messageController.updateMessage);
router.delete('/message/:messageId', messageController.deleteMessage);

module.exports = router;

module.exports = router;
