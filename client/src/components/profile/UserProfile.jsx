import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../utils/toast';
import { User, Book, BarChart2 } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const UserProfile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    booksRead: 0,
    currentlyReading: 0,
    wantToRead: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    isPublicProfile: user?.isPublicProfile || false
  });

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch this from your API
      const response = await fetch('/api/user/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      showToast.error('Failed to load user statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const loadingToast = showToast.loading('Updating profile...');
    try {
      // In a real app, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast.success('Profile updated successfully');
    } catch (error) {
      showToast.error('Failed to update profile');
    } finally {
      showToast.dismiss(loadingToast);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>
        
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={profileData.username}
              onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={profileData.isPublicProfile}
              onChange={(e) => setProfileData({ ...profileData, isPublicProfile: e.target.checked })}
              className="rounded text-blue-500"
            />
            <label htmlFor="isPublic" className="text-sm">Make my profile public</label>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Book className="text-blue-500" />
            <h3 className="font-medium">Total Books</h3>
          </div>
          <p className="text-3xl font-semibold">{stats.totalBooks}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart2 className="text-green-500" />
            <h3 className="font-medium">Books Read</h3>
          </div>
          <p className="text-3xl font-semibold">{stats.booksRead}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Book className="text-yellow-500" />
            <h3 className="font-medium">Currently Reading</h3>
          </div>
          <p className="text-3xl font-semibold">{stats.currentlyReading}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Book className="text-purple-500" />
            <h3 className="font-medium">Want to Read</h3>
          </div>
          <p className="text-3xl font-semibold">{stats.wantToRead}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;