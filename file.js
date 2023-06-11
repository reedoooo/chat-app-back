const App = () => {
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.user.rooms);

  useEffect(() => {
    const socket = io(); // Connect to the socket.io server
    dispatch(initSocket()); // Initialize the socket connection

    socket.on('connect', () => {
      console.log('Connected to socket.io server');
    });

    socket.on('message', (message) => {
      console.log('Received message:', message);
      // Dispatch an action to handle the received message
    });

    socket.on('notification', (notification) => {
      console.log('Received notification:', notification);
      // Dispatch an action to handle the received notification
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
      dispatch(setSocket(null));

    };
  }, []);

  const handleJoinRoom = (roomId) => {
    dispatch(joinRoom(roomId));
  };

  return (
    <div>
      <div>
        <h1>Chat Rooms</h1>
        {rooms.map((roomId) => (
          <Room key={roomId} roomId={roomId} />
        ))}
        <button onClick={() => handleJoinRoom('room1')}>Join Room 1</button>
        <button onClick={() => handleJoinRoom('room2')}>Join Room 2</button>
      </div>
    </div>
  );
};

export default App;
const Chat = () => {
  const dispatch = useDispatch();
  const currentRoom = useSelector((state) => state.chat.currentRoom);
  const roomsMessages = useSelector((state) => state.chat.rooms[currentRoom] || []);
  const messages = useSelector((state) => state.chat.messages);
  const isUserTyping = useSelector((state) => state.chat.isUserTyping);

  const [newMessage, setNewMessage] = useState('');
  // const [roomName, setRoomName] = useState('');

  useEffect(() => {
    const socket = io(); // Connect to the socket.io server

    socket.on('connect', () => {
      console.log('Connected to socket.io server');
    });

    socket.on('message', (message) => {
      console.log('Received message:', message);
      dispatch(addMessage(message)); // Dispatch an action to add the received message
    });

    socket.on('notification', (notification) => {
      console.log('Received notification:', notification);
      dispatch(addNotification(notification)); // Dispatch an action to add the received notification
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);
  const handleSend = (event) => {
    event.preventDefault();
    if (newMessage.trim() !== '') {
      const message = { text: newMessage, room: currentRoom };
      dispatch(sendMessage(message));
      setNewMessage('');
      dispatch(setUserTyping(false));
    }
  };

  const handleUserTyping = () => {
    dispatch(setUserTyping(true));
  };

  const stopUserTyping = () => {
    dispatch(setUserTyping(false));
  };
  // const handleJoin = (event) => {
  //   event.preventDefault();
  //   if (roomName.trim() !== '') {
  //     dispatch(joinRoom(roomName));
  //   }
  // };
  useEffect(() => {
    dispatch(loadMessages());
  }, [dispatch]);

  return (
    <div>
      <h1>Welcome to the Chat!</h1>
      {currentRoom && (
        <>
          <h2>{currentRoom}</h2>
          {roomsMessages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
          <form onSubmit={handleSend}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleUserTyping();
              }}
              placeholder="Type your message here..."
            />
            <button type="submit">Send</button>
          </form>
        </>
      )}
      <h1>Global Chat</h1>
      {messages.map((message, index) => (
        <p key={index}>{message.text}</p>
      ))}
      {isUserTyping && <p>A user is typing...</p>}
    </div>
  );
};

export default Chat;
// components/Room/Room.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addChatMessage } from '../../actions/chatActions';
import Message from '../Message/Message';

const Room = ({ roomId }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.rooms[roomId] || []);
  const [messageText, setMessageText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addChatMessage(roomId, { user: 'testUser', text: messageText }));  // TODO: replace 'testUser' with the current user
    setMessageText('');
  };

  return (
    <div>
      <h1>Room {roomId}</h1>
      {messages.map((message) => <Message key={message.id} message={message} />)}
      <form onSubmit={handleSubmit}>
        <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Room;
------------------ACTIONS--------------------
export const setSocket = (socket) => ({
  type: 'SET_SOCKET',
  payload: socket,
});


// Update the sendMessage action to emit the message to the socket server
export const sendMessage = (message) => (dispatch) => {
  socket.emit('sendMessage', message); // Replace "socket" with your actual socket.io instance
};

// Update the joinRoom action to emit the room join event to the socket server
export const joinRoom = (roomId) => (dispatch) => {
  socket.emit('joinRoom', roomId); // Replace "socket" with your actual socket.io instance
};

export const addChatMessage = (roomId, message) => ({
  type: 'ADD_CHAT_MESSAGE',
  payload: { roomId, message },
});

export const addReaction = (messageId, userId, reaction) => ({
  type: 'ADD_REACTION',
  payload: { messageId, userId, reaction },
});

export const userJoined = (roomId, userId) => ({
  type: 'USER_JOINED',
  payload: { roomId, userId },
});

export const userLeft = (roomId, userId) => ({
  type: 'USER_LEFT',
  payload: { roomId, userId },
});

export const loadMessages = () => {
  const messages = localStorage.getItem('messages');
  return {
    type: 'LOAD_MESSAGES',
    payload: messages ? JSON.parse(messages) : [],
  };
};

export const saveMessages = (messages) => {
  localStorage.setItem('messages', JSON.stringify(messages));
  return {
    type: 'SAVE_MESSAGES',
    payload: messages,
  };
};

export const messageRead = (messageId, userId) => ({
  type: 'MESSAGE_READ',
  payload: { messageId, userId },
});

export const sendPrivateMessage = (senderId, receiverId, message) => ({
  type: 'SEND_PRIVATE_MESSAGE',
  payload: { senderId, receiverId, message },
});

export const initSocket = () => (dispatch) => {
  const socket = io(); // Connect to the socket.io server
  dispatch(setSocket(socket));
};
// actions/roomActions.js
export const addRoom = (room) => ({
  type: 'ADD_ROOM',
  payload: room,
});

export const selectRoom = (room) => ({
  type: 'SELECT_ROOM',
  payload: room,
});

// actions/roomActions.js
export const setRoomDescription = (roomName, description) => ({
  type: 'SET_ROOM_DESCRIPTION',
  payload: { roomName, description },
});
