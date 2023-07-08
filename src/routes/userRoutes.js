const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../services/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get(
  '/chatRooms/:roomId/users',
  verifyToken,
  userController.getUsersInChatRoom,
);
router.get('/:userId/messages', verifyToken, userController.getUserMessages);
router.get(
  '/chatRooms/:roomId/messages',
  verifyToken,
  userController.getAllChatMessages,
);
router.get(
  '/chatRooms/:roomId/messages',
  verifyToken,
  userController.getSpecificChatMessages,
);
router.post(
  '/chatRooms/:roomId/sendMessage',
  verifyToken,
  userController.sendMessage,
);
router.put('/:userId', verifyToken, userController.updateUser);
router.delete('/:userId', verifyToken, userController.deleteUser);

module.exports = router;
