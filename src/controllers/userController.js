const User = require('../models/userSchema.js');
const ChatRoom = require('../models/chatRoomSchema');
const Message = require('../models/messageSchema');
const colors = require('colors');
const { createToken } = require('../utils/utils.js');
const { eventEmitter } = require('../eventPool.js');
const io = require('../server.js').io;
const bcrypt = require('bcrypt');

const saltRounds = 10;
const N = 10; // Maximum number of chat rooms

const userToJSON = (user) => {
  let userObj = user.toObject();
  delete userObj.password;
  delete userObj.__v;
  return userObj;
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password || '', saltRounds);
    const user = new User({
      username,
      email: email || `${username}_${Date.now()}@placeholder.com`,
      password: hashedPassword,
    });
    await user.save();

    const chatRooms = await ChatRoom.find();
    const room =
      chatRooms.length < N
        ? new ChatRoom({
            name: `Room ${chatRooms.length + 1}`,
            description: `This is room ${chatRooms.length + 1}`,
            color: '#123456',
            createdBy: user._id,
            users: [user._id],
          })
        : chatRooms[Math.floor(Math.random() * chatRooms.length)];
    if (!room.users.includes(user._id)) room.users.push(user._id);
    await room.save();

    const message = new Message({
      text: `Welcome ${user.username} to chatlandia`,
      room: room._id,
      user: user._id,
    });
    await message.save();

    eventEmitter.emit('user.registered', user);
    eventEmitter.emit('room.updated', room);

    io.emit('USER_REGISTERED', user);
    io.emit('NEW_MESSAGE', message);

    const token = createToken(userToJSON(user));
    res.status(201).json({ token, room: room._id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    io.emit('USER_LOGGED_IN', user);

    const token = createToken(userToJSON(user));
    res.json({ ...userToJSON(user), token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
//------------------------------------MAYBE USER ROUTES------------------------------------//
exports.sendMessage = async (req, res) => {
  try {
    const { text, userId, roomId } = req.body;
    const message = new Message({ text, user: userId, room: roomId });
    await message.save();

    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    Object.assign(user, req.body);
    await user.save();

    io.emit('USER_PROFILE_UPDATED', user);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
//------------------------------------MAYBE USER ROUTES------------------------------------//

//------------------------------------ADMIN ROUTES------------------------------------//
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    await user.remove();
    io.emit('USER_DELETED', req.user.id);

    res.json({ msg: 'User removed' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    Object.assign(user, req.body);
    await user.save();

    io.emit('USER_UPDATED', user);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.getUsersInChatRoom = async (req, res) => {
  try {
    const chatRoom = await ChatRoom.findById(req.params.roomId).populate(
      'users',
    );
    if (!chatRoom) return res.status(404).json({ msg: 'Chat room not found' });

    res.json(chatRoom.users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.getUserMessages = async (req, res) => {
  try {
    const messages = await Message.find({ user: req.params.userId });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
//------------------------------------ADMIN ROUTES------------------------------------//
