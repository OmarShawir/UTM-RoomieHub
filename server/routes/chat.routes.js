const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getConversations,
  startConversation,
  getConversation,
  getMessages,
  sendMessage,
  markAsRead,
  reportUser,
  blockUser,
} = require('../controllers/chat.controller');

const router = express.Router();

router.get( '/conversations',                  protect, getConversations);
router.post('/conversations',                  protect, startConversation);
router.get( '/conversations/:id',             protect, getConversation);
router.get( '/conversations/:id/messages',     protect, getMessages);
router.post('/conversations/:id/messages',     protect, sendMessage);
router.put( '/conversations/:id/read',         protect, markAsRead);
router.post('/conversations/:id/report',       protect, reportUser);
router.post('/conversations/:id/block',        protect, blockUser);

module.exports = router;
