const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { text, room } = req.body;
    const { id: user } = req.user;

    const message = new Message({ text, user, room });
    await message.save();

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
