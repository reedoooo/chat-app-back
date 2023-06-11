const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChatRoomSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  // Add additional fields as needed
}, {
  timestamps: true
});

module.exports = mongoose.model('ChatRoom', ChatRoomSchema);
