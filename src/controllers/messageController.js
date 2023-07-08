const Message = require('../models/messageSchema');

// Send a new message
exports.sendMessage = async (req, res, next) => {
  try {
    const { text, room } = req.body;
    const { id: user } = req.user;

    const message = new Message({ text, user, room });
    await message.save();

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get all messages of a specific chat room
exports.getChatRoomMessages = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ room: roomId }).sort('createdAt');

    res.json(messages);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get a specific message
exports.getMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);

    if (!message) {
      return next(new Error('Message not found'));
    }

    res.json(message);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Update a specific message
exports.updateMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const updates = req.body;

    const message = await Message.findByIdAndUpdate(messageId, updates, { new: true });

    if (!message) {
      return next(new Error('Message not found'));
    }

    res.json(message);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Delete a specific message
exports.deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findByIdAndDelete(messageId);

    if (!message) {
      return next(new Error('Message not found'));
    }

    res.json({ msg: 'Message removed' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
