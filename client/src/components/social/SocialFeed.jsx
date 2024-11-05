import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Share2, Heart } from 'lucide-react';
import { userService } from '../../services/userService';
import { showToast } from '../../utils/toast';
import LoadingSpinner from '../common/LoadingSpinner';

const SocialFeed = () => {
  const [feed, setFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentInput, setCommentInput] = useState('');
  const [activeCommentId, setActiveCommentId] = useState(null);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await userService.getSocialFeed();
      setFeed(response);
    } catch (error) {
      showToast.error('Failed to load social feed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await userService.likePost(postId);
      // Update feed with new like
      setFeed(feed.map(post => {
        if (post._id === postId) {
          return { ...post, likes: post.likes + 1, isLiked: true };
        }
        return post;
      }));
    } catch (error) {
      showToast.error('Failed to like post');
    }
  };

  const handleComment = async (postId) => {
    if (!commentInput.trim()) return;
    
    try {
      const newComment = await userService.addComment(postId, commentInput);
      // Update feed with new comment
      setFeed(feed.map(post => {
        if (post._id === postId) {
          return { 
            ...post, 
            comments: [...post.comments, newComment]
          };
        }
        return post;
      }));
      setCommentInput('');
      setActiveCommentId(null);
    } catch (error) {
      showToast.error('Failed to add comment');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <Users className="text-blue-500" />
        Reading Activity
      </h2>

      {feed.map((post) => (
        <div key={post._id} className="bg-white rounded-lg shadow-sm p-6">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={post.user.avatar || '/default-avatar.png'}
              alt={post.user.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-medium">{post.user.username}</h3>
              <p className="text-sm text-gray-500">{post.timestamp}</p>
            </div>
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <p>{post.content}</p>
            {post.book && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex gap-3">
                  <img
                    src={post.book.coverImage || '/placeholder-book.png'}
                    alt={post.book.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-medium">{post.book.title}</h4>
                    <p className="text-sm text-gray-600">{post.book.author}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 mb-4">
            <button
              onClick={() => handleLike(post._id)}
              className={`flex items-center gap-2 ${post.isLiked ? 'text-red-500' : 'text-gray-500'}`}
            >
              <Heart size={20} fill={post.isLiked ? 'currentColor' : 'none'} />
              <span>{post.likes}</span>
            </button>
            <button
              onClick={() => setActiveCommentId(activeCommentId === post._id ? null : post._id)}
              className="flex items-center gap-2 text-gray-500"
            >
              <MessageCircle size={20} />
              <span>{post.comments.length}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500">
              <Share2 size={20} />
              <span>Share</span>
            </button>
          </div>

          {/* Comments */}
          {post.comments.length > 0 && (
            <div className="space-y-3 mb-4">
              {post.comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <img
                    src={comment.user.avatar || '/default-avatar.png'}
                    alt={comment.user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="bg-gray-50 p-3 rounded-lg flex-1">
                    <p className="font-medium text-sm">{comment.user.username}</p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment Input */}
          {activeCommentId === post._id && (
            <div className="flex gap-3">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleComment(post._id)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Post
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SocialFeed;