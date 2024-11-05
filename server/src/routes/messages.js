const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/chats', messageController.getChats);
router.get('/chats/:chatId/messages', messageController.getChatMessages);
router.post('/messages', messageController.sendMessage);
router.put('/chats/:chatId/read', messageController.markAsRead);

module.exports = router;