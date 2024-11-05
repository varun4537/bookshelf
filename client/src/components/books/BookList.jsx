// src/components/books/BookList.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { bookService } from '../../services/api';
import { useLoading } from '../../context/LoadingContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { BookCardSkeleton } from '../common/Skeleton';
import { showToast } from '../../utils/toast';
import toast from 'react-hot-toast';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const { setLoading } = useLoading();
  const [localLoading, setLocalLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const loadingToast = toast.loading('Loading your books...');
    setLocalLoading(true);
    try {
      const data = await bookService.getAllBooks();
      setBooks(data);
      toast.success('Books loaded successfully');
    } catch (err) {
      toast.error('Failed to load books');
      setError('Error fetching books');
      console.error('Error:', err);
    } finally {
      toast.dismiss(loadingToast);
      setLocalLoading(false);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || book.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (localLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">My Books</h1>
          <div className="animate-pulse bg-gray-200 h-10 w-32 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={fetchBooks}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Books</h1>
        <Link
          to="/add-book"
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <Plus size={20} />
          Add Book
        </Link>
      </div>

      <div className="mb-6 space-y-4">
        {/* Search Input */}
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search books by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('Want to Read')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'Want to Read'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Want to Read
          </button>
          <button
            onClick={() => setFilter('Currently Reading')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'Currently Reading'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Currently Reading
          </button>
          <button
            onClick={() => setFilter('Completed')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'Completed'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <Link
            to={`/books/${book._id}`}
            key={book._id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{book.title}</h3>
              <p className="text-gray-600 mb-2">{book.author}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{book.genre}</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  {book.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {books.length === 0 
              ? 'No books in your library yet'
              : 'No books match your search'}
          </p>
          {books.length === 0 && (
            <Link
              to="/add-book"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Your First Book
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default BookList;