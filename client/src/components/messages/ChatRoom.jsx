import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';
import { userService } from '../../services/api';
import socketService from '../../services/socketService';
import { showToast } from '../../utils/toast';
import LoadingSpinner from '../common/LoadingSpinner';

const ChatRoom = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [participant, setParticipant] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    socketService.joinChat(chatId);

    const handleNewMessage = (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    };

    socketService.subscribeToMessages(handleNewMessage);

    return () => {
      socketService.leaveChat(chatId);
    };
  }, [chatId]);

  const fetchMessages = async () => {
    try {
      const response = await userService.getChatMessages(chatId);
      setMessages(response.data.messages);
      setParticipant(response.data.participant);
      scrollToBottom();
    } catch (error) {
      showToast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const message = await userService.sendMessage(chatId, newMessage);
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      showToast.error('Failed to send message');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center gap-4">
        <button
          onClick={() => navigate('/messages')}
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={24} />
        </button>
        <img
          src={participant?.profileImage || '/default-avatar.png'}
          alt={participant?.username}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="font-medium">{participant?.username}</h2>
          <p className="text-sm text-gray-500">
            {participant?.isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${
              message.sender._id === userService.getCurrentUserId()
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender._id === userService.getCurrentUserId()
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(message.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;