export const validateBookForm = (bookData) => {
    const errors = {};
    
    if (!bookData.title?.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!bookData.author?.trim()) {
      errors.author = 'Author is required';
    }
    
    if (bookData.isbn) {
      // Basic ISBN-13 validation
      const isbnRegex = /^(?:\d{13}|\d{10})$/;
      if (!isbnRegex.test(bookData.isbn.replace(/-/g, ''))) {
        errors.isbn = 'Invalid ISBN format';
      }
    }
    
    if (bookData.totalPages) {
      const pages = parseInt(bookData.totalPages);
      if (isNaN(pages) || pages <= 0) {
        errors.totalPages = 'Please enter a valid number of pages';
      }
    }
  
    return errors;
  };