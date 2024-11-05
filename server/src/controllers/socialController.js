const Post = require('../../../client/src/models/Post');
const User = require('../../../client/src/models/User');
const Book = require('../models/Book');
const Post = require('../models/Post');
const User = require('../models/User');
const Book = require('../models/Book');


const socialController = {
  // Get user's feed
  getFeed: async (req, res) => {
    try {
      const userId = req.userId;
      const user = await User.findById(userId);
      
      // Get posts from user and followed users
      const posts = await Post.find({
        $or: [
          { user: { $in: user.following } },
          { user: userId }
        ]
      })
      .populate('user', 'username profileImage')
      .populate('book', 'title author coverImage')
      .sort('-createdAt')
      .limit(20);

      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching feed' });
    }
  },

  // Create a post
  createPost: async (req, res) => {
    try {
      const { content, bookId, type, readingProgress } = req.body;
      const post = new Post({
        user: req.userId,
        content,
        book: bookId,
        type,
        readingProgress
      });

      await post.save();
      
      const populatedPost = await Post.findById(post._id)
        .populate('user', 'username profileImage')
        .populate('book', 'title author coverImage');

      res.status(201).json(populatedPost);
    } catch (error) {
      res.status(500).json({ message: 'Error creating post' });
    }
  },

  // Like/unlike a post
  toggleLike: async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      const likeIndex = post.likes.indexOf(req.userId);

      if (likeIndex === -1) {
        post.likes.push(req.userId);
      } else {
        post.likes.splice(likeIndex, 1);
      }

      await post.save();
      res.json({ likes: post.likes.length });
    } catch (error) {
      res.status(500).json({ message: 'Error updating like' });
    }
  },

  // Add comment
  addComment: async (req, res) => {
    try {
      const { content } = req.body;
      const post = await Post.findById(req.params.postId);
      
      post.comments.push({
        user: req.userId,
        content
      });

      await post.save();
      
      const populatedPost = await Post.findById(post._id)
        .populate('comments.user', 'username profileImage');

      res.json(populatedPost.comments[populatedPost.comments.length - 1]);
    } catch (error) {
      res.status(500).json({ message: 'Error adding comment' });
    }
  },

  // Follow/unfollow user
  toggleFollow: async (req, res) => {
    try {
      const targetUserId = req.params.userId;
      const currentUser = await User.findById(req.userId);
      const targetUser = await User.findById(targetUserId);

      if (!targetUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isFollowing = currentUser.following.includes(targetUserId);

      if (isFollowing) {
        // Unfollow
        currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
        targetUser.followers = targetUser.followers.filter(id => id.toString() !== req.userId);
      } else {
        // Follow
        currentUser.following.push(targetUserId);
        targetUser.followers.push(req.userId);
      }

      await currentUser.save();
      await targetUser.save();

      res.json({ isFollowing: !isFollowing });
    } catch (error) {
      res.status(500).json({ message: 'Error updating follow status' });
    }
  }
};

module.exports = socialController;