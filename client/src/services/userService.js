import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const userService = {
  // Get user profile
  getProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await axios.put(`${API_URL}/users/profile`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Get reading statistics
  getReadingStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  // Update reading progress
  updateReadingProgress: async (bookId, progress) => {
    try {
      const response = await axios.put(`${API_URL}/books/${bookId}/progress`, progress);
      return response.data;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }
};

export default userService;