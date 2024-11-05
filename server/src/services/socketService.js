const socketIO = require('socket.io');

let io;
const userSockets = new Map();

const socketService = {
  init: (server) => {
    io = socketIO(server, {
      cors: {
        origin: "http://localhost:5173", // Your frontend URL
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Handle user authentication
      socket.on('authenticate', (userId) => {
        userSockets.set(userId, socket.id);
        socket.userId = userId;
        socket.join(`user:${userId}`);
        console.log('User authenticated:', userId);
      });

      // Handle chat rooms
      socket.on('join_chat', (chatId) => {
        socket.join(`chat:${chatId}`);
        console.log(`Socket ${socket.id} joined chat:${chatId}`);
      });

      socket.on('leave_chat', (chatId) => {
        socket.leave(`chat:${chatId}`);
        console.log(`Socket ${socket.id} left chat:${chatId}`);
      });

      socket.on('send_message', async (data) => {
        io.to(`chat:${data.chatId}`).emit('new_message', data.message);
      });

      // Handle reading status
      socket.on('reading_status', (data) => {
        socket.to(`book:${data.bookId}`).emit('user_reading_status', {
          userId: socket.userId,
          ...data
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        if (socket.userId) {
          userSockets.delete(socket.userId);
        }
        console.log('Client disconnected:', socket.id);
      });
    });

    return io;
  },

  // Send notification to specific user
  sendNotification: (userId, notification) => {
    if (io) {
      io.to(`user:${userId}`).emit('notification', notification);
    }
  },

  // Send message in chat
  sendMessage: (chatId, message) => {
    if (io) {
      io.to(`chat:${chatId}`).emit('new_message', message);
    }
  },

  // Broadcast to all connected clients
  broadcast: (event, data) => {
    if (io) {
      io.emit(event, data);
    }
  },

  // Get socket instance by user ID
  getUserSocket: (userId) => {
    return userSockets.get(userId);
  },

  // Get io instance
  getIO: () => io
};

module.exports = socketService;