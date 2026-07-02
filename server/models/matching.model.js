const db = require('../config/db');

const MatchingModel = {
  // ─── Room Preferences ──────────────────────────────────────────
  getRoomPreferences: async (userId) => {
    const [rows] = await db.query('SELECT * FROM room_preferences WHERE user_id = ?', [userId]);
    return rows[0] || null;
  },

  saveRoomPreferences: async (userId, { max_budget, room_type, max_distance_km, furnishing_preference, bathroom_type }) => {
    const existing = await MatchingModel.getRoomPreferences(userId);
    if (existing) {
      await db.query(
        `UPDATE room_preferences 
         SET max_budget = ?, room_type = ?, max_distance_km = ?, furnishing_preference = ?, bathroom_type = ? 
         WHERE user_id = ?`,
        [max_budget, room_type, max_distance_km, furnishing_preference, bathroom_type, userId]
      );
      return existing.id;
    } else {
      const [res] = await db.query(
        `INSERT INTO room_preferences (user_id, max_budget, room_type, max_distance_km, furnishing_preference, bathroom_type) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, max_budget, room_type, max_distance_km, furnishing_preference, bathroom_type]
      );
      return res.insertId;
    }
  },

  // ─── Room Recommendations Sessions ──────────────────────────────
  createRecommendationSession: async (userId, preferenceId, totalResults) => {
    const [res] = await db.query(
      'INSERT INTO recommendation_sessions (user_id, preference_id, total_results) VALUES (?, ?, ?)',
      [userId, preferenceId, totalResults]
    );
    return res.insertId;
  },

  saveRecommendationResults: async (sessionId, results) => {
    for (const res of results) {
      await db.query(
        'INSERT INTO recommendation_results (session_id, listing_id, match_score, rank_position) VALUES (?, ?, ?, ?)',
        [sessionId, res.listing_id, res.match_score, res.rank_position]
      );
    }
  },

  getLatestRoomRecommendations: async (userId) => {
    const [sessions] = await db.query(
      'SELECT id FROM recommendation_sessions WHERE user_id = ? ORDER BY generated_at DESC LIMIT 1',
      [userId]
    );
    if (sessions.length === 0) return [];

    const sessionId = sessions[0].id;
    const [rows] = await db.query(
      `SELECT r.match_score, r.rank_position, l.*,
        (SELECT photo_url FROM listing_photos WHERE listing_id = l.id AND is_primary = 1 LIMIT 1) as cover_photo
       FROM recommendation_results r
       JOIN listings l ON l.id = r.listing_id
       WHERE r.session_id = ?
       ORDER BY r.rank_position ASC`,
      [sessionId]
    );
    return rows;
  },

  // ─── Lifestyle Profiles ─────────────────────────────────────────
  getLifestyleProfile: async (userId) => {
    const [rows] = await db.query('SELECT * FROM lifestyle_profiles WHERE user_id = ?', [userId]);
    if (rows[0]) {
      rows[0].has_pets = !!rows[0].has_pets;
      rows[0].is_smoker = !!rows[0].is_smoker;
    }
    return rows[0] || null;
  },

  saveLifestyleProfile: async (userId, { sleep_schedule, study_habit, cleanliness_level, social_preference, noise_tolerance, gender_preference, has_pets, is_smoker }) => {
    const existing = await MatchingModel.getLifestyleProfile(userId);
    if (existing) {
      await db.query(
        `UPDATE lifestyle_profiles 
         SET sleep_schedule = ?, study_habit = ?, cleanliness_level = ?, social_preference = ?, noise_tolerance = ?, gender_preference = ?, has_pets = ?, is_smoker = ? 
         WHERE user_id = ?`,
        [sleep_schedule, study_habit, cleanliness_level, social_preference, noise_tolerance, gender_preference, has_pets ? 1 : 0, is_smoker ? 1 : 0, userId]
      );
      return existing.id;
    } else {
      const [res] = await db.query(
        `INSERT INTO lifestyle_profiles (user_id, sleep_schedule, study_habit, cleanliness_level, social_preference, noise_tolerance, gender_preference, has_pets, is_smoker) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, sleep_schedule, study_habit, cleanliness_level, social_preference, noise_tolerance, gender_preference, has_pets ? 1 : 0, is_smoker ? 1 : 0]
      );
      return res.insertId;
    }
  },

  // ─── Roommate Matching Sessions ─────────────────────────────────
  createMatchSession: async (userId, profileId, totalMatches) => {
    const [res] = await db.query(
      'INSERT INTO match_sessions (user_id, profile_id, total_matches) VALUES (?, ?, ?)',
      [userId, profileId, totalMatches]
    );
    return res.insertId;
  },

  saveMatchResults: async (sessionId, matches) => {
    for (const match of matches) {
      await db.query(
        'INSERT INTO match_results (session_id, matched_user_id, compatibility_score, rank_position, status) VALUES (?, ?, ?, ?, ?)',
        [sessionId, match.matched_user_id, match.compatibility_score, match.rank_position, match.status || 'pending']
      );
    }
  },

  getLatestRoommateMatches: async (userId) => {
    const [sessions] = await db.query(
      'SELECT id FROM match_sessions WHERE user_id = ? ORDER BY generated_at DESC LIMIT 1',
      [userId]
    );
    if (sessions.length === 0) return [];

    const sessionId = sessions[0].id;
    const [rows] = await db.query(
      `SELECT r.compatibility_score, r.rank_position, r.status as match_status, u.id as user_id, u.email,
        s.full_name, s.display_name, s.matric_no, s.faculty, s.year_of_study, s.nationality, s.bio, s.profile_picture,
        lp.sleep_schedule, lp.study_habit, lp.cleanliness_level, lp.social_preference, lp.noise_tolerance, lp.is_smoker, lp.has_pets
       FROM match_results r
       JOIN users u ON u.id = r.matched_user_id
       JOIN students s ON s.user_id = u.id
       JOIN lifestyle_profiles lp ON lp.user_id = u.id
       WHERE r.session_id = ?
       ORDER BY r.rank_position ASC`,
      [sessionId]
    );
    return rows;
  },

  getAllLifestyleProfiles: async (excludeUserId) => {
    const [rows] = await db.query(
      `SELECT lp.*, s.full_name, s.profile_picture, s.faculty 
       FROM lifestyle_profiles lp 
       JOIN students s ON s.user_id = lp.user_id
       WHERE lp.user_id != ?`,
      [excludeUserId]
    );
    return rows;
  },
};

module.exports = MatchingModel;
