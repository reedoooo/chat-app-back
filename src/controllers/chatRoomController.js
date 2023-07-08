const ChatRoom = require('../models/chatRoomSchema');

const responseHelper = (res, promise) => {
  promise
    .then((result) => res.json(result))
    .catch((error) => {
      console.error(error);
      res.status(500).send('Server Error');
    });
};

exports.getAllChatRooms = (req, res) => responseHelper(res, ChatRoom.find());

exports.getUserChatRooms = (req, res) =>
  responseHelper(res, ChatRoom.find({ users: req.user.id }));

exports.createChatRoom = async (req, res) => {
  const { name, description, color, createdBy } = req.body;
  if (!name || !createdBy)
    return res.status(400).send({ error: 'Missing name or createdBy field' });

  const chatRoom = new ChatRoom({
    name,
    description,
    color,
    createdBy,
    users: [createdBy],
  });

  responseHelper(res, chatRoom.save());
};

exports.getChatRoom = (req, res) =>
  responseHelper(res, ChatRoom.findById(req.params.roomId));

exports.updateChatRoom = async (req, res) => {
  const { name, description, color, users } = req.body;
  const userId = req.user.id;

  const chatRoom = await ChatRoom.findById(req.params.roomId);
  if (!chatRoom) return res.status(404).json({ msg: 'Chat room not found' });

  if (chatRoom.createdBy.toString() !== userId)
    return res.status(403).json({ msg: 'User not authorized' });

  chatRoom.name = name || chatRoom.name;
  chatRoom.description = description || chatRoom.description;
  chatRoom.color = color || chatRoom.color;
  chatRoom.users = users || chatRoom.users;

  responseHelper(res, chatRoom.save());
};

exports.deleteChatRoom = async (req, res) => {
  const chatRoom = await ChatRoom.findById(req.params.roomId);
  if (!chatRoom) return res.status(404).json({ msg: 'Chat room not found' });

  if (chatRoom.createdBy.toString() !== req.user.id)
    return res.status(403).json({ msg: 'User not authorized' });

  responseHelper(res, chatRoom.remove());
};

exports.addUserToChatRoom = async (req, res) => {
  const chatRoom = await ChatRoom.findById(req.params.roomId);
  if (!chatRoom) return res.status(404).json({ msg: 'Chat room not found' });

  if (chatRoom.users.includes(req.params.userId))
    return res.status(400).json({ msg: 'User already in the chat room' });

  chatRoom.users.push(req.params.userId);
  responseHelper(res, chatRoom.save());
};

exports.removeUserFromChatRoom = async (req, res) => {
  const chatRoom = await ChatRoom.findById(req.params.roomId);
  if (!chatRoom) return res.status(404).json({ msg: 'Chat room not found' });

  const userIndex = chatRoom.users.indexOf(req.params.userId);
  if (userIndex === -1)
    return res.status(400).json({ msg: 'User not in the chat room' });

  chatRoom.users.splice(userIndex, 1);
  responseHelper(res, chatRoom.save());
};
