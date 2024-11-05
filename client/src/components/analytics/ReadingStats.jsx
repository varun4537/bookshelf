import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Book, Clock, Target, TrendingUp } from 'lucide-react';
import { analyticsService } from '../../services/api';
import { showToast } from '../../utils/toast';
import LoadingSpinner from '../common/LoadingSpinner';

const StatCard = ({ icon: Icon, title, value, change, changeType }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center gap-3 mb-2">
      <Icon className={`${changeType === 'positive' ? 'text-green-500' : 'text-blue-500'}`} />
      <h3 className="font-medium">{title}</h3>
    </div>
    <p className="text-3xl font-semibold">{value}</p>
    {change && (
      <p className={`text-sm mt-2 ${
        changeType === 'positive' ? 'text-green-500' : 'text-red-500'
      }`}>
        {change > 0 ? '↑' : '↓'} {Math.abs(change)}% from last month
      </p>
    )}
  </div>
);

const ReadingStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // week, month, year

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      const response = await analyticsService.getReadingStats(timeRange);
      setStats(response.data);
    } catch (error) {
      showToast.error('Failed to load reading statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reading Statistics</h1>
        <div className="flex gap-2">
          {['week', 'month', 'year'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg ${
                timeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Book}
          title="Books Read"
          value={stats.booksRead}
          change={stats.booksReadChange}
          changeType="positive"
        />
        <StatCard
          icon={Clock}
          title="Reading Time"
          value={`${stats.readingHours}h`}
          change={stats.readingTimeChange}
          changeType="positive"
        />
        <StatCard
          icon={Target}
          title="Goal Progress"
          value={`${stats.goalProgress}%`}
        />
        <StatCard
          icon={TrendingUp}
          title="Reading Streak"
          value={`${stats.currentStreak} days`}
        />
      </div>

      {/* Reading Progress Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Reading Progress</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="pagesRead" 
                stroke="#3B82F6" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Genre Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Books by Genre</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.genreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="genre" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReadingStats;