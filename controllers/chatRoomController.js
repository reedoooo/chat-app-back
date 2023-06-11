const ChatRoom = require('../models/ChatRoom');

exports.getAllChatRooms = async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find();
    res.json(chatRooms);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.createChatRoom = async (req, res) => {
  try {
    const { name, description } = req.body;

    const chatRoom = new ChatRoom({ name, description });
    await chatRoom.save();

    res.status(201).json(chatRoom);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
