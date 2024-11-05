const Book = require('../models/Book');

const bookController = {
  // Get all books
  getAllBooks: async (req, res) => {
    try {
      const books = await Book.find({ owner: req.userId });
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching books' });
    }
  },

  // Get a single book
  getBookById: async (req, res) => {
    try {
      const book = await Book.findOne({
        _id: req.params.id,
        owner: req.userId
      });
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching book' });
    }
  },

  // Add a new book
  addBook: async (req, res) => {
    try {
      const newBook = new Book({
        ...req.body,
        owner: req.userId
      });
      const savedBook = await newBook.save();
      res.status(201).json(savedBook);
    } catch (error) {
      res.status(500).json({ message: 'Error adding book' });
    }
  },

  // Update a book
  updateBook: async (req, res) => {
    try {
      const updatedBook = await Book.findOneAndUpdate(
        { _id: req.params.id, owner: req.userId },
        req.body,
        { new: true }
      );
      if (!updatedBook) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json(updatedBook);
    } catch (error) {
      res.status(500).json({ message: 'Error updating book' });
    }
  },

  // Delete a book
  deleteBook: async (req, res) => {
    try {
      const book = await Book.findOneAndDelete({
        _id: req.params.id,
        owner: req.userId
      });
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json({ message: 'Book deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting book' });
    }
  }
};

module.exports = bookController;