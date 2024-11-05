const User = require('../models/User');
const socketService = require('./socketService');

const notificationService = {
  createNotification: async (userId, notification) => {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      // Create notification in database
      user.notifications.unshift({
        type: notification.type,
        fromUser: notification.fromUser,
        bookId: notification.bookId,
        message: notification.message,
        read: false,
        createdAt: new Date()
      });

      await user.save();

      // Send real-time notification
      socketService.sendNotification(userId, {
        ...notification,
        id: user.notifications[0]._id
      });

      return user.notifications[0];
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  getNotifications: async (userId) => {
    try {
      const user = await User.findById(userId)
        .populate('notifications.fromUser', 'username profileImage')
        .populate('notifications.bookId', 'title');
      
      return user.notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  markAsRead: async (userId, notificationId) => {
    try {
      const user = await User.findById(userId);
      const notification = user.notifications.id(notificationId);
      
      if (notification) {
        notification.read = true;
        await user.save();
      }
      
      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  markAllAsRead: async (userId) => {
    try {
      const user = await User.findById(userId);
      user.notifications = user.notifications.map(notification => ({
        ...notification,
        read: true
      }));
      
      await user.save();
      return user.notifications;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
};

module.exports = notificationService;