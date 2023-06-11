const express = require('express');
const router = express.Router();
const chatRoomController = require('../controllers/chatRoomController');
const auth = require('../middleware/auth');

router.get('/', auth, chatRoomController.getAllChatRooms);
router.post('/', auth, chatRoomController.createChatRoom);
router.get('/:roomId', auth, chatRoomController.getChatRoom);
router.put('/:roomId', auth, chatRoomController.updateChatRoom);
router.delete('/:roomId', auth, chatRoomController.deleteChatRoom);

module.exports = router;
