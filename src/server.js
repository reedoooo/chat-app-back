'use strict';

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const userRoutes = require('./routes/userRoutes');
const chatRoomRoutes = require('./routes/chatRoomRoutes');
const messageRoutes = require('./routes/messageRoutes');

const userEvents = require('./events/user');
const roomEvents = require('./events/room');

const errorHandler = require('./middleware/errorMiddleware');
const logRoute = require('./middleware/logRoute');

const colors = require('colors');

const PORT = process.env.PORT || 3002;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/chatApp';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(colors.green('Connected to MongoDB')))
  .catch((error) => {
    console.error(colors.red(`MongoDB connection error: ${error}`));
    process.exit(1);
  });

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200,
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const server = app.listen(PORT, () => {
  console.log(colors.cyan(`Server is running on port ${PORT}`));
});

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(logRoute);

app.use('/chatRooms', chatRoomRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);

app.use(errorHandler);

io.on('connection', (socket) => {
  userEvents(io, socket);
  roomEvents(io, socket);
  socket.on('disconnect', () => {
    console.log(colors.yellow(`CLIENT DISCONNECTED FROM SERVER: ${socket.id}`));
  });
});

io.on('error', (error) => {
  console.error('Socket.IO error: ', error);
});

module.exports = { app, io };
