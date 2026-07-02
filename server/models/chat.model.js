const db = require('../../../../../../../../../Downloads/UTM-RoomieHub-auth-done/roomiehub/server/config/db');

const ChatModel = {

  // Find existing conversation between two users (optionally about a listing)
  findConversation: async (userOneId, userTwoId, listingId = null) => {
    let query = `
      SELECT * FROM conversations
      WHERE ((participant_one_id = ? AND participant_two_id = ?)
         OR  (participant_one_id = ? AND participant_two_id = ?))
    `;
    const params = [userOneId, userTwoId, userTwoId, userOneId];

    if (listingId) {
      query += ' AND listing_id = ?';
      params.push(listingId);
    }

    const [[row]] = await db.query(query, params);
    return row || null;
  },

  // Create a new conversation
  createConversation: async (userOneId, userTwoId, listingId = null) => {
    const [result] = await db.query(
      'INSERT INTO conversations (listing_id, participant_one_id, participant_two_id) VALUES (?, ?, ?)',
      [listingId, userOneId, userTwoId]
    );
    return result.insertId;
  },

  // Get all conversations for a user, with last message + other participant info
  getConversationsForUser: async (userId) => {
    const [rows] = await db.query(`
      SELECT
        c.id,
        c.listing_id,
        c.status,
        c.last_message_at,
        CASE WHEN c.participant_one_id = ? THEN c.participant_two_id ELSE c.participant_one_id END as other_user_id,
        s.full_name as other_user_name,
        s.profile_picture as other_user_avatar,
        u.last_login,
        (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY sent_at DESC LIMIT 1) as last_message,
        (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND sender_id != ? AND is_read = 0) as unread_count
      FROM conversations c
      JOIN students s ON s.user_id = CASE WHEN c.participant_one_id = ? THEN c.participant_two_id ELSE c.participant_one_id END
      JOIN users u ON u.id = CASE WHEN c.participant_one_id = ? THEN c.participant_two_id ELSE c.participant_one_id END
      WHERE (c.participant_one_id = ? OR c.participant_two_id = ?) AND c.status != 'blocked'
      ORDER BY c.last_message_at DESC
    `, [userId, userId, userId, userId, userId, userId]);
    return rows;
  },

  // Get a single conversation by ID (with permission check)
  getConversationById: async (conversationId, userId) => {
    const [[row]] = await db.query(`
      SELECT c.*,
        CASE WHEN c.participant_one_id = ? THEN c.participant_two_id ELSE c.participant_one_id END as other_user_id,
        s.full_name as other_user_name,
        s.profile_picture as other_user_avatar,
        u.last_login
      FROM conversations c
      JOIN students s ON s.user_id = CASE WHEN c.participant_one_id = ? THEN c.participant_two_id ELSE c.participant_one_id END
      JOIN users u ON u.id = CASE WHEN c.participant_one_id = ? THEN c.participant_two_id ELSE c.participant_one_id END
      WHERE c.id = ? AND (c.participant_one_id = ? OR c.participant_two_id = ?)
    `, [userId, userId, userId, conversationId, userId, userId]);
    return row || null;
  },

  // Get messages in a conversation
  getMessages: async (conversationId) => {
    const [rows] = await db.query(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY sent_at ASC',
      [conversationId]
    );
    return rows;
  },

  // Send a message
  sendMessage: async (conversationId, senderId, content, messageType = 'text') => {
    const [result] = await db.query(
      'INSERT INTO messages (conversation_id, sender_id, content, message_type) VALUES (?, ?, ?, ?)',
      [conversationId, senderId, content, messageType]
    );
    await db.query('UPDATE conversations SET last_message_at = NOW() WHERE id = ?', [conversationId]);

    const [[message]] = await db.query('SELECT * FROM messages WHERE id = ?', [result.insertId]);
    return message;
  },

  // Mark all messages in a conversation as read (for the receiving user)
  markAsRead: async (conversationId, userId) => {
    await db.query(
      'UPDATE messages SET is_read = 1 WHERE conversation_id = ? AND sender_id != ?',
      [conversationId, userId]
    );
  },

  // Check if user is part of a conversation
  isParticipant: async (conversationId, userId) => {
    const [[row]] = await db.query(
      'SELECT id FROM conversations WHERE id = ? AND (participant_one_id = ? OR participant_two_id = ?)',
      [conversationId, userId, userId]
    );
    return !!row;
  },

  // Block a user within a conversation
  blockConversation: async (conversationId) => {
    await db.query("UPDATE conversations SET status = 'blocked' WHERE id = ?", [conversationId]);
  },

  // ─── Reports ───────────────────────────────────────────────

  createReport: async ({ reporter_id, reported_user_id, conversation_id, reason, description }) => {
    const [result] = await db.query(
      `INSERT INTO user_reports (reporter_id, reported_user_id, reason, description)
       VALUES (?, ?, ?, ?)`,
      [reporter_id, reported_user_id, reason, description || null]
    );
    return result.insertId;
  },
};

module.exports = ChatModel;
