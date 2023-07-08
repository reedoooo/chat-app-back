const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const colors = require('colors');
const jwt = require('jsonwebtoken');

module.exports = (io, socket) => {
  socket.on('simple_message', (message) => {
    console.log(`Message received from user ${socket.id}: ${message}`.green);
  });

  socket.on('USER_JOINED', (user) => {
    socket.join('chatRoom');
    io.emit('USER_JOINED', user.name);
    console.log(`User ${user.name} joined the room`.green);
    console.log(
      'Current Users in room:'.yellow,
      socket.adapter.rooms.get('chatRoom').size,
    );
  });

  socket.on('USER_LOGIN', async ({ username, password }) => {
    console.log('User Login Attempt...'.cyan);
    try {
      const user = await User.findOne({ username });

      if (!user) {
        throw new Error('User not found');
      }

      console.log('User found, validating password...'.cyan);
      const passwordIsValid = await bcrypt.compare(password, user.password);

      if (!passwordIsValid) {
        throw new Error('Invalid password');
      }

      console.log('Password Validated. Generating Token...'.cyan);
      const token = jwt.sign({ id: user._id }, 'your_secret_key', {
        expiresIn: 86400,
      });

      socket.emit('USER_LOGGED_IN', { user, token });
      console.log('User logged in successfully'.green);
    } catch (error) {
      console.error('Error logging in:', error.message.red);
      socket.emit('login error', 'Error logging in');
    }
  });

  socket.on('USER_LEFT', (userId) => {
    socket.leave(userId);
    console.log(`User ${userId} left the room`.orange);
  });

  socket.on('GET_USERS', async () => {
    console.log('Fetching all users...'.cyan);
    try {
      const users = await User.find();
      socket.emit('USER_LIST', users);
      console.log('All users fetched successfully'.green);
    } catch (error) {
      console.error('Error getting users:', error.message.red);
      socket.emit('get users error', 'Error getting users');
    }
  });

  socket.on('GET_USER', async (userId) => {
    console.log(`Fetching user ${userId}...`.cyan);
    try {
      const user = await User.findById(userId);
      socket.emit('USER_DETAIL', user);
      console.log('User fetched successfully'.green);
    } catch (error) {
      console.error('Error getting user:', error.message.red);
      socket.emit('get user error', 'Error getting user');
    }
  });

  socket.on('UPDATE_USER', async (updatedUser) => {
    console.log(`Updating user ${updatedUser.id}...`.cyan);
    try {
      const user = await User.findByIdAndUpdate(updatedUser.id, updatedUser, {
        new: true,
      });
      socket.emit('USER_UPDATED', user);
      console.log('User updated successfully'.green);
    } catch (error) {
      console.error('Error updating user:', error.message.red);
      socket.emit('update user error', 'Error updating user');
    }
  });
};
