const Reaction = require('../models/Reaction');

exports.addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const { id: user } = req.user;

    const reaction = new Reaction({ message: messageId, user, emoji });
    await reaction.save();

    res.status(201).json(reaction);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
