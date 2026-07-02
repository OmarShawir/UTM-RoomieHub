const ChatModel = require('../models/chat.model');

// ─── GET /api/chat/conversations ───────────────────
const getConversations = async (req, res) => {
  try {
    const conversations = await ChatModel.getConversationsForUser(req.user.id);
    res.json({ success: true, conversations });
  } catch (err) {
    console.error('Get conversations error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch conversations' });
  }
};

// ─── POST /api/chat/conversations ──────────────────
// Body: { other_user_id, listing_id? }
const startConversation = async (req, res) => {
  try {
    const { other_user_id, listing_id } = req.body;

    if (!other_user_id) {
      return res.status(400).json({ success: false, message: 'other_user_id is required' });
    }
    if (Number(other_user_id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot message yourself' });
    }

    let conversation = await ChatModel.findConversation(req.user.id, other_user_id, listing_id);

    if (!conversation) {
      const id = await ChatModel.createConversation(req.user.id, other_user_id, listing_id);
      conversation = await ChatModel.getConversationById(id, req.user.id);
    }

    res.status(201).json({ success: true, conversation });
  } catch (err) {
    console.error('Start conversation error:', err);
    res.status(500).json({ success: false, message: 'Failed to start conversation' });
  }
};

// ─── GET /api/chat/conversations/:id/messages ──────
const getMessages = async (req, res) => {
  try {
    const isParticipant = await ChatModel.isParticipant(req.params.id, req.user.id);
    if (!isParticipant) return res.status(403).json({ success: false, message: 'Not part of this conversation' });

    const messages = await ChatModel.getMessages(req.params.id);
    res.json({ success: true, messages });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
};

// ─── POST /api/chat/conversations/:id/messages ─────
// Body: { content }
const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    const isParticipant = await ChatModel.isParticipant(req.params.id, req.user.id);
    if (!isParticipant) return res.status(403).json({ success: false, message: 'Not part of this conversation' });

    const message = await ChatModel.sendMessage(req.params.id, req.user.id, content.trim());
    res.status(201).json({ success: true, message });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

// ─── PUT /api/chat/conversations/:id/read ──────────
const markAsRead = async (req, res) => {
  try {
    const isParticipant = await ChatModel.isParticipant(req.params.id, req.user.id);
    if (!isParticipant) return res.status(403).json({ success: false, message: 'Not part of this conversation' });

    await ChatModel.markAsRead(req.params.id, req.user.id);
    res.json({ success: true, message: 'Messages marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to mark as read' });
  }
};

// ─── POST /api/chat/conversations/:id/report ───────
// Body: { reason, description }
const reportUser = async (req, res) => {
  try {
    const { reason, description } = req.body;
    if (!reason) return res.status(400).json({ success: false, message: 'Reason is required' });

    const conversation = await ChatModel.getConversationById(req.params.id, req.user.id);
    if (!conversation) return res.status(404).json({ success: false, message: 'Conversation not found' });

    await ChatModel.createReport({
      reporter_id: req.user.id,
      reported_user_id: conversation.other_user_id,
      conversation_id: req.params.id,
      reason,
      description,
    });

    res.status(201).json({ success: true, message: 'Report submitted successfully' });
  } catch (err) {
    console.error('Report user error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit report' });
  }
};

// ─── GET /api/chat/conversations/:id ───────────────
const getConversation = async (req, res) => {
  try {
    const conversation = await ChatModel.getConversationById(req.params.id, req.user.id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    res.json({ success: true, conversation });
  } catch (err) {
    console.error('Get conversation error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch conversation details' });
  }
};

// ─── POST /api/chat/conversations/:id/block ────────
const blockUser = async (req, res) => {
  try {
    const isParticipant = await ChatModel.isParticipant(req.params.id, req.user.id);
    if (!isParticipant) return res.status(403).json({ success: false, message: 'Not part of this conversation' });

    await ChatModel.blockConversation(req.params.id);
    res.json({ success: true, message: 'User blocked' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to block user' });
  }
};

module.exports = { getConversations, startConversation, getConversation, getMessages, sendMessage, markAsRead, reportUser, blockUser };
