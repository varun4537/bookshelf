const Message = require('../../../client/src/models/Message');
const Chat = require('../../../client/src/models/Chat');
const socketService = require('../../../client/src/services/socketService');

const messageController = {
  // Get user's chats
  getChats: async (req, res) => {
    try {
      const chats = await Chat.find({
        participants: req.userId
      })
      .populate('participants', 'username profileImage')
      .populate('lastMessage')
      .sort('-updatedAt');

      res.json(chats);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching chats' });
    }
  },

  // Get chat messages
  getChatMessages: async (req, res) => {
    try {
      const messages = await Message.find({
        chat: req.params.chatId
      })
      .populate('sender', 'username profileImage')
      .sort('-createdAt')
      .limit(50);

      res.json(messages.reverse());
    } catch (error) {
      res.status(500).json({ message: 'Error fetching messages' });
    }
  },

  // Send message
  sendMessage: async (req, res) => {
    try {
      const { chatId, content } = req.body;
      
      let chat = await Chat.findById(chatId);
      if (!chat) {
        // Create new chat if doesn't exist
        chat = new Chat({
          participants: [req.userId, req.body.recipientId]
        });
        await chat.save();
      }

      const message = new Message({
        sender: req.userId,
        recipient: req.body.recipientId,
        content,
        chat: chat._id
      });

      await message.save();

      // Update chat's last message
      chat.lastMessage = message._id;
      chat.unreadCount.set(req.body.recipientId, 
        (chat.unreadCount.get(req.body.recipientId) || 0) + 1
      );
      await chat.save();

      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'username profileImage');

      // Send real-time notification
      socketService.sendMessage(chatId, populatedMessage);

      res.status(201).json(populatedMessage);
    } catch (error) {
      res.status(500).json({ message: 'Error sending message' });
    }
  },

  // Mark messages as read
  markAsRead: async (req, res) => {
    try {
      const { chatId } = req.params;
      
      await Message.updateMany(
        {
          chat: chatId,
          recipient: req.userId,
          read: false
        },
        { read: true }
      );

      const chat = await Chat.findById(chatId);
      chat.unreadCount.set(req.userId, 0);
      await chat.save();

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Error marking messages as read' });
    }
  }
};

module.exports = messageController;