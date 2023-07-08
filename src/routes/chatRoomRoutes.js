const express = require('express');
const router = express.Router();
const chatRoomController = require('../controllers/chatRoomController');
const { verifyToken } = require('../services/auth');

router.get('/', verifyToken, chatRoomController.getAllChatRooms);
router.get('/:roomId', verifyToken, chatRoomController.getChatRoom);
router.post('/', verifyToken, chatRoomController.createChatRoom);
router.put('/:roomId', verifyToken, chatRoomController.updateChatRoom);
router.delete('/:roomId', verifyToken, chatRoomController.deleteChatRoom);

module.exports = router;
