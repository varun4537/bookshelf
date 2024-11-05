import io from 'socket.io-client';
import { showToast } from '../utils/toast';

let socket;

const socketService = {
  init: (userId) => {
    try {
      socket = io('http://localhost:5000', {
        auth: {
          userId
        }
      });

      socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        showToast.error('Connection error. Trying to reconnect...');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });

      return socket;
    } catch (error) {
      console.error('Socket initialization error:', error);
      showToast.error('Failed to initialize real-time connection');
    }
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
    }
  },

  // Notification subscriptions
  subscribeToNotifications: (callback) => {
    if (!socket) return;
    socket.on('notification', callback);
  },

  // Message handling
  subscribeToMessages: (callback) => {
    if (!socket) return;
    socket.on('new_message', callback);
  },

  joinChat: (chatId) => {
    if (!socket) return;
    socket.emit('join_chat', chatId);
  },

  leaveChat: (chatId) => {
    if (!socket) return;
    socket.emit('leave_chat', chatId);
  },

  sendMessage: (chatId, message) => {
    if (!socket) return;
    socket.emit('send_message', { chatId, message });
  },

  // Reading status
  emitReadingStatus: (bookId, status) => {
    if (!socket) return;
    socket.emit('reading_status', { bookId, status });
  },

  getSocket: () => socket
};

export default socketService;