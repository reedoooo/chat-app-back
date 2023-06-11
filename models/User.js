const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Add additional profile fields as needed
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
