import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Book, Clock, Target, TrendingUp } from 'lucide-react';
import { userService } from '../../services/userService';
import { showToast } from '../../utils/toast';
import LoadingSpinner from '../common/LoadingSpinner';

const ReadingStats = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await userService.getReadingStats();
      setStats(data);
    } catch (error) {
      showToast.error('Failed to load reading statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Book className="text-blue-500" />
            <h3 className="font-medium">Books Read</h3>
          </div>
          <p className="text-3xl font-semibold">{stats?.totalBooksRead || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-green-500" />
            <h3 className="font-medium">Reading Time</h3>
          </div>
          <p className="text-3xl font-semibold">{stats?.totalReadingHours || 0}h</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="text-purple-500" />
            <h3 className="font-medium">Current Goal</h3>
          </div>
          <p className="text-3xl font-semibold">{stats?.readingGoal || 0} books</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-yellow-500" />
            <h3 className="font-medium">Goal Progress</h3>
          </div>
          <p className="text-3xl font-semibold">
            {Math.round((stats?.totalBooksRead / stats?.readingGoal) * 100) || 0}%
          </p>
        </div>
      </div>

      {/* Reading Progress Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Reading Progress</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats?.monthlyProgress || []}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="booksRead" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Genre Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Books by Genre</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stats?.genreDistribution?.map((genre) => (
            <div key={genre.name} className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600">{genre.name}</h4>
              <p className="text-2xl font-semibold mt-1">{genre.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reading Streaks */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Reading Streaks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">Current Streak</p>
            <p className="text-3xl font-semibold">{stats?.currentStreak || 0} days</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Longest Streak</p>
            <p className="text-3xl font-semibold">{stats?.longestStreak || 0} days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingStats;