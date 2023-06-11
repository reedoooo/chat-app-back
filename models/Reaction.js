const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReactionSchema = new Schema({
  message: { type: Schema.Types.ObjectId, ref: 'Message' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  emoji: { type: String, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Reaction', ReactionSchema);
