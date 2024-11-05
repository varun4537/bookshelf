import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, X } from 'lucide-react';
import { userService } from '../../services/api';
import { showToast } from '../../utils/toast';
import LoadingSpinner from '../common/LoadingSpinner';

const NewMessage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (searchTerm) {
      searchUsers();
    } else {
      setUsers([]);
    }
  }, [searchTerm]);

  const searchUsers = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const response = await userService.searchUsers(searchTerm);
      setUsers(response.data);
    } catch (error) {
      showToast.error('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async () => {
    if (!selectedUser || !message.trim()) return;
    
    try {
      const response = await userService.startNewChat({
        recipientId: selectedUser._id,
        message: message.trim()
      });
      navigate(`/messages/${response.data.chatId}`);
    } catch (error) {
      showToast.error('Failed to start conversation');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-4">
        <button
          onClick={() => navigate('/messages')}
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-medium">New Message</h2>
      </div>

      {/* User Search */}
      {!selectedUser ? (
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={20} 
            />
          </div>

          {loading && (
            <div className="py-4 text-center">
              <LoadingSpinner size="small" />
            </div>
          )}

          {/* Search Results */}
          <div className="mt-4 space-y-2">
            {users.map(user => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <img
                  src={user.profileImage || '/default-avatar.png'}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{user.username}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Message Composition
        <div className="flex-1 flex flex-col p-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
            <img
              src={selectedUser.profileImage || '/default-avatar.png'}
              alt={selectedUser.username}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <h3 className="font-medium">{selectedUser.username}</h3>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          <button
            onClick={handleStartChat}
            disabled={!message.trim()}
            className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Start Conversation
          </button>
        </div>
      )}
    </div>
  );
};

export default NewMessage;