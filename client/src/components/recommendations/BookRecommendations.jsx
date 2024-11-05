import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, BookOpen, User } from 'lucide-react';
import { bookService } from '../../services/api';
import { showToast } from '../../utils/toast';
import LoadingSpinner from '../common/LoadingSpinner';

const RecommendationCard = ({ book, onBookClick }) => (
  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
       onClick={() => onBookClick(book)}>
    <div className="flex p-4 gap-4">
      <img
        src={book.coverImage || '/book-placeholder.png'}
        alt={book.title}
        className="w-24 h-36 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{book.title}</h3>
        <p className="text-gray-600">{book.author}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
            {book.genre}
          </span>
          {book.rating && (
            <span className="text-yellow-500">
              ★ {book.rating.toFixed(1)}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
          {book.description}
        </p>
      </div>
    </div>
  </div>
);

const BookRecommendations = () => {
  const [recommendations, setRecommendations] = useState({
    forYou: [],
    trending: [],
    basedOnGenre: [],
    basedOnAuthors: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('forYou');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await bookService.getRecommendations();
      setRecommendations(response.data);
    } catch (error) {
      showToast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'forYou', label: 'For You', icon: Sparkles },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'basedOnGenre', label: 'Similar Books', icon: BookOpen },
    { id: 'basedOnAuthors', label: 'Authors You Like', icon: User }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Sparkles className="text-blue-500" />
        Recommended for You
      </h1>

      {/* Tabs */}
      <div className="flex border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors
              ${activeTab === tab.id 
                ? 'border-blue-500 text-blue-500' 
                : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <tab.icon size={20} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations[activeTab]?.map(book => (
          <RecommendationCard
            key={book._id}
            book={book}
            onBookClick={() => navigate(`/books/${book._id}`)}
          />
        ))}
      </div>

      {recommendations[activeTab]?.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No recommendations available yet. 
          Add more books to your library to get personalized suggestions!
        </div>
      )}
    </div>
  );
};

export default BookRecommendations;