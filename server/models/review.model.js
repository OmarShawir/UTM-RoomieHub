const db = require('../config/db');

const ReviewModel = {

  // Create a review (for a listing OR a user/roommate)
  create: async ({ reviewer_id, target_user_id, listing_id, rating, pros, cons }) => {
    const [result] = await db.query(
      `INSERT INTO reviews (reviewer_id, target_user_id, listing_id, rating, pros, cons)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [reviewer_id, target_user_id || null, listing_id || null, rating, pros || null, cons || null]
    );
    return result.insertId;
  },

  findById: async (id) => {
    const [[row]] = await db.query('SELECT * FROM reviews WHERE id = ?', [id]);
    return row || null;
  },

  // Get all reviews for a listing
  findByListing: async (listingId) => {
    const [rows] = await db.query(`
      SELECT r.*, s.full_name as reviewer_name, s.profile_picture as reviewer_avatar
      FROM reviews r
      JOIN students s ON s.user_id = r.reviewer_id
      WHERE r.listing_id = ?
      ORDER BY r.created_at DESC
    `, [listingId]);
    return rows;
  },

  // Get all reviews for a user (roommate reviews)
  findByUser: async (userId) => {
    const [rows] = await db.query(`
      SELECT r.*, s.full_name as reviewer_name, s.profile_picture as reviewer_avatar
      FROM reviews r
      JOIN students s ON s.user_id = r.reviewer_id
      WHERE r.target_user_id = ?
      ORDER BY r.created_at DESC
    `, [userId]);
    return rows;
  },

  // Get average rating + count for a listing
  getListingStats: async (listingId) => {
    const [[stats]] = await db.query(
      'SELECT COUNT(*) as count, AVG(rating) as average FROM reviews WHERE listing_id = ?',
      [listingId]
    );
    return { count: stats.count, average: stats.average ? Number(stats.average).toFixed(1) : 0 };
  },

  // Get average rating + count for a user
  getUserStats: async (userId) => {
    const [[stats]] = await db.query(
      'SELECT COUNT(*) as count, AVG(rating) as average FROM reviews WHERE target_user_id = ?',
      [userId]
    );
    return { count: stats.count, average: stats.average ? Number(stats.average).toFixed(1) : 0 };
  },

  // Check if user already reviewed this listing
  hasReviewedListing: async (reviewerId, listingId) => {
    const [[row]] = await db.query(
      'SELECT id FROM reviews WHERE reviewer_id = ? AND listing_id = ?',
      [reviewerId, listingId]
    );
    return !!row;
  },

  // Check if user already reviewed this roommate
  hasReviewedUser: async (reviewerId, targetUserId) => {
    const [[row]] = await db.query(
      'SELECT id FROM reviews WHERE reviewer_id = ? AND target_user_id = ?',
      [reviewerId, targetUserId]
    );
    return !!row;
  },

  // Report a review (UC034)
  reportReview: async (reporterId, reviewId, reason, description) => {
    const [result] = await db.query(
      `INSERT INTO review_reports (reporter_id, review_id, reason, description)
       VALUES (?, ?, ?, ?)`,
      [reporterId, reviewId, reason, description || null]
    );
    return result.insertId;
  },
};

module.exports = ReviewModel;
