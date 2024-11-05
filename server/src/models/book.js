const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true
  },
  description: String,
  genre: String,
  coverImage: String,
  totalPages: Number,
  status: {
    type: String,
    enum: ['Want to Read', 'Currently Reading', 'Completed'],
    default: 'Want to Read'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  readingProgress: {
    currentPage: { type: Number, default: 0 },
    startDate: Date,
    completedDate: Date
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);