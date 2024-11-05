import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const GOOGLE_BOOKS_API = import.meta.env.VITE_GOOGLE_BOOKS_API;

export const bookService = {
  // Get all books
  getAllBooks: async () => {
    try {
      const response = await axios.get(`${API_URL}/books`);
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  },

  // Add new book
  addBook: async (bookData) => {
    try {
      const response = await axios.post(`${API_URL}/books`, bookData);
      return response.data;
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  },

  // Fetch book details from ISBN
  fetchBookByISBN: async (isbn) => {
    try {
      const response = await axios.get(`${GOOGLE_BOOKS_API}?q=isbn:${isbn}`);
      if (response.data.items?.length > 0) {
        const book = response.data.items[0].volumeInfo;
        return {
          title: book.title,
          author: book.authors?.join(', ') || '',
          description: book.description || '',
          totalPages: book.pageCount,
          coverImage: book.imageLinks?.thumbnail,
          isbn: isbn,
          genre: book.categories?.[0] || ''
        };
      }
      throw new Error('Book not found');
    } catch (error) {
      console.error('Error fetching book by ISBN:', error);
      throw error;
    }
  },

  // Upload book cover image
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
};

export default bookService;