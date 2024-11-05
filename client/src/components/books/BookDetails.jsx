import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { bookService } from '../../services/api';
import { showToast } from '../../utils/toast';
import LoadingSpinner from '../common/LoadingSpinner';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await bookService.getBookById(id);
      setBook(response.data);
      setEditData(response.data);
    } catch (err) {
      setError('Error fetching book details');
      showToast.error('Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await bookService.updateBook(id, editData);
      setBook(response.data);
      setIsEditing(false);
      showToast.success('Book updated successfully');
    } catch (err) {
      showToast.error('Failed to update book');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(id);
        showToast.success('Book deleted successfully');
        navigate('/');
      } catch (err) {
        showToast.error('Failed to delete book');
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!book) return <div className="text-center">Book not found</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
      {isEditing ? (
        // Edit Mode
        <div className="space-y-4">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full text-2xl font-bold px-3 py-2 border rounded"
          />
          <input
            type="text"
            value={editData.author}
            onChange={(e) => setEditData({ ...editData, author: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            value={editData.genre}
            onChange={(e) => setEditData({ ...editData, genre: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            rows="4"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        // View Mode
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
              <p className="text-gray-600">{book.author}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-600 hover:text-blue-500"
              >
                <Pencil size={20} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-600 hover:text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Genre</h2>
              <p>{book.genre}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="text-gray-600">{book.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;