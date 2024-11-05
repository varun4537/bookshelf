import React, { useState } from 'react';
import { X, Plus, Camera } from 'lucide-react';
import BarcodeScanner from './BarcodeScanner';

const AddBookModal = ({ isOpen, onClose, onAdd }) => {
  const [showScanner, setShowScanner] = useState(false);
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    description: ''
  });

  const handleScan = (isbn) => {
    setBookData({ ...bookData, isbn });
    setShowScanner(false);
    // For testing purposes, let's populate some data when we get an ISBN
    if (isbn === '9780307474278') { // Test ISBN
      setBookData({
        title: 'Test Book',
        author: 'Test Author',
        isbn: isbn,
        genre: 'Fiction',
        description: 'This is a test book description'
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(bookData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-slate-800">Add New Book</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-500"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* ISBN Scanner Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowScanner(true)}
              className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2"
            >
              <Camera size={20} />
              Scan ISBN
            </button>
          </div>

          <div className="space-y-4">
            {/* ISBN */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                ISBN
              </label>
              <input
                type="text"
                value={bookData.isbn}
                onChange={(e) => setBookData({ ...bookData, isbn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter ISBN"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={bookData.title}
                onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter book title"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Author
              </label>
              <input
                type="text"
                value={bookData.author}
                onChange={(e) => setBookData({ ...bookData, author: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter author name"
              />
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Genre
              </label>
              <select
                value={bookData.genre}
                onChange={(e) => setBookData({ ...bookData, genre: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select genre</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Mystery">Mystery</option>
                <option value="Romance">Romance</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                value={bookData.description}
                onChange={(e) => setBookData({ ...bookData, description: e.target.value })}
                rows="4"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter book description"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Book
            </button>
          </div>
        </form>
      </div>

      {showScanner && (
        <BarcodeScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default AddBookModal;