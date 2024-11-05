const Book = require('../models/Book');
const User = require('../models/User');

class RecommendationService {
  static async generateRecommendations(userId) {
    try {
      const user = await User.findById(userId);
      const userBooks = await Book.find({ owner: userId });

      // Get user's reading preferences
      const genres = this._extractGenrePreferences(userBooks);
      const authors = this._extractAuthorPreferences(userBooks);
      const ratings = this._extractRatingPatterns(userBooks);

      // Generate different types of recommendations
      const [genreBasedRecs, authorBasedRecs, popularRecs] = await Promise.all([
        this._getGenreBasedRecommendations(genres, userId),
        this._getAuthorBasedRecommendations(authors, userId),
        this._getPopularRecommendations(userId)
      ]);

      // Combine and sort recommendations
      const recommendations = this._combineRecommendations(
        genreBasedRecs,
        authorBasedRecs,
        popularRecs,
        ratings
      );

      return {
        recommendations,
        genres: Object.keys(genres),
        authors: Object.keys(authors)
      };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  static _extractGenrePreferences(books) {
    const genres = {};
    books.forEach(book => {
      if (book.genre) {
        genres[book.genre] = (genres[book.genre] || 0) + 1;
        // Add weight based on rating and completion status
        if (book.rating) genres[book.genre] += book.rating / 2;
        if (book.status === 'Completed') genres[book.genre] += 2;
      }
    });
    return genres;
  }

  static _extractAuthorPreferences(books) {
    const authors = {};
    books.forEach(book => {
      if (book.author) {
        authors[book.author] = (authors[book.author] || 0) + 1;
        if (book.rating) authors[book.author] += book.rating / 2;
        if (book.status === 'Completed') authors[book.author] += 2;
      }
    });
    return authors;
  }

  static _extractRatingPatterns(books) {
    return books.reduce((acc, book) => {
      if (book.rating) {
        acc.totalRating += book.rating;
        acc.count += 1;
      }
      return acc;
    }, { totalRating: 0, count: 0 });
  }

  static async _getGenreBasedRecommendations(genres, userId) {
    const topGenres = Object.entries(genres)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);

    return await Book.find({
      owner: { $ne: userId },
      genre: { $in: topGenres },
      status: 'Available'
    })
    .sort('-rating')
    .limit(10);
  }

  static async _getAuthorBasedRecommendations(authors, userId) {
    const topAuthors = Object.entries(authors)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([author]) => author);

    return await Book.find({
      owner: { $ne: userId },
      author: { $in: topAuthors },
      status: 'Available'
    })
    .sort('-rating')
    .limit(10);
  }

  static async _getPopularRecommendations(userId) {
    return await Book.find({
      owner: { $ne: userId },
      status: 'Available',
      rating: { $gte: 4 }
    })
    .sort('-rating -borrowCount')
    .limit(10);
  }

  static _combineRecommendations(genreRecs, authorRecs, popularRecs, userRatings) {
    const allRecs = [...genreRecs, ...authorRecs, ...popularRecs];
    const avgUserRating = userRatings.count > 0 
      ? userRatings.totalRating / userRatings.count 
      : 3;

    // Remove duplicates and sort by score
    return Array.from(new Set(allRecs))
      .map(book => ({
        ...book.toObject(),
        score: this._calculateRecommendationScore(book, avgUserRating)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }

  static _calculateRecommendationScore(book, avgUserRating) {
    let score = 0;
    
    // Base score from book rating
    if (book.rating) {
      score += book.rating * 2;
      // Bonus for ratings close to user's average
      score += (5 - Math.abs(book.rating - avgUserRating)) * 0.5;
    }

    // Popularity bonus
    if (book.borrowCount) {
      score += Math.min(book.borrowCount * 0.2, 2);
    }

    // Recency bonus
    const monthsOld = (new Date() - new Date(book.createdAt)) / (1000 * 60 * 60 * 24 * 30);
    score += Math.max(0, 2 - (monthsOld * 0.1));

    return score;
  }
}

module.exports = RecommendationService;