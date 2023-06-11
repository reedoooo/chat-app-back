const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
  text: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  room: { type: Schema.Types.ObjectId, ref: 'ChatRoom' },
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', MessageSchema);
