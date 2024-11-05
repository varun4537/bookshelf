import api from './api';
import { showToast } from '../utils/toast';

const notificationService = {
  getNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      showToast.error('Failed to fetch notifications');
      throw error;
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      showToast.error('Failed to mark notification as read');
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      showToast.error('Failed to mark notifications as read');
      throw error;
    }
  },

  subscribeToNotifications: (callback) => {
    // This will be used with socket service
    return socketService.subscribeToNotifications(callback);
  }
};

export default notificationService;