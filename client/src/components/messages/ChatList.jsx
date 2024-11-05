import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Search } from 'lucide-react';
import { userService } from '../../services/api';
import { showToast } from '../../utils/toast';
import LoadingSpinner from '../common/LoadingSpinner';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await userService.getChats();
      setChats(response.data);
    } catch (error) {
      showToast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.participants.some(participant => 
      participant.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={20} 
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No conversations found
          </div>
        ) : (
          filteredChats.map(chat => (
            <div
              key={chat._id}
              onClick={() => navigate(`/messages/${chat._id}`)}
              className="p-4 border-b hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={chat.participants[0].profileImage || '/default-avatar.png'}
                    alt={chat.participants[0].username}
                    className="w-12 h-12 rounded-full"
                  />
                  {chat.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{chat.participants[0].username}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage?.content || 'No messages yet'}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(chat.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Message Button */}
      <div className="p-4 border-t">
        <button
          onClick={() => navigate('/messages/new')}
          className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <MessageSquare size={20} />
          New Message
        </button>
      </div>
    </div>
  );
};

export default ChatList;