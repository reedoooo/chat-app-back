const ChatRoom = require('../models/chatRoomSchema');
const colors = require('colors');

module.exports = (io, socket) => {
  // When a room is created
// When a room is created
socket.on('ROOM_CREATED', async (newRoom) => {
  console.log('ROOM_CREATED: Incoming request', newRoom);
  try {
    if (!newRoom || !newRoom.name) {
      console.log('ROOM_CREATED: Invalid room data', newRoom);
      return socket.emit('ROOM_CREATED_ERROR', 'Invalid room data');
    }

    const newChatRoom = new ChatRoom({
      name: newRoom.name,
      description: newRoom.description,
      color: newRoom.color,
    });

    const savedChatRoom = await newChatRoom.save();
    const newRoomId = savedChatRoom._id;
    socket.join(newRoomId);
    io.emit('ROOM_CREATED', newRoomId);

    console.log(`New room ${newRoomId} created and user joined`);
  } catch (error) {
    console.error('ROOM_CREATED: Error creating new chat room', error);
    socket.emit('ROOM_CREATED_ERROR', 'Error creating new chat room');
  }
});

  // When a user sends a message to a room
  socket.on('SEND_MESSAGE', (roomId, message) => {
    try {
      io.to(roomId).emit('message', message);
      console.log(`New message in room ${roomId}: ${message}` .blue);
    } catch (error) {
      console.error('Error sending message:', error .red);
      socket.emit('send message error', 'Error sending message');
    }
  });

  // When a user joins a room
  socket.on('JOIN_ROOM', async (roomId) => {
    try {
      socket.join(roomId);
      io.to(roomId).emit('USER_JOINED', socket.id);
      console.log(`User ${socket.id} joined room ${roomId}` .green);
    } catch (error) {
      console.error('Error joining room:', error .red);
      socket.emit('join room error', 'Error joining room');
    }
  });

  // When a user leaves a room
  socket.on('LEAVE_ROOM', async (roomId) => {
    try {
      socket.leave(roomId);
      io.to(roomId).emit('USER_LEFT', socket.id);
			console.log(`User ${socket.id} left room ${roomId}` .yellow);
    } catch (error) {
      console.error('Error leaving room:', error .red);
      socket.emit('leave room error', 'Error leaving room');
    }
  });

  // When a user requests a list of all chat rooms
  socket.on('GET_ROOMS', async () => {
    try {
      const rooms = await ChatRoom.find();
      socket.emit('ROOM_LIST', rooms);
    } catch (error) {
      console.error('Error getting rooms:', error .red);
      socket.emit('get rooms error', 'Error getting rooms');
    }
  });

  // When a user requests a specific chat room by id
  socket.on('GET_ROOM', async (roomId) => {
    try {
      const room = await ChatRoom.findById(roomId);
      socket.emit('ROOM_DETAIL', room);
    } catch (error) {
      console.error('Error getting room:', error .red);
      socket.emit('get room error', 'Error getting room');
    }
  });
};
