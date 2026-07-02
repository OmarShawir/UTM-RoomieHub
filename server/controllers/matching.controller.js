const MatchingModel = require('../models/matching.model');
const db = require('../config/db');

// ─── Room Recommendation Controllers ─────────────────────────────
const getRoomPreferences = async (req, res) => {
  try {
    const prefs = await MatchingModel.getRoomPreferences(req.user.id);
    res.json({ success: true, preferences: prefs });
  } catch (err) {
    console.error('Get room preferences error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch room preferences' });
  }
};

const saveRoomPreferences = async (req, res) => {
  try {
    const { max_budget, room_type, max_distance_km, furnishing_preference, bathroom_type } = req.body;

    const prefId = await MatchingModel.saveRoomPreferences(req.user.id, {
      max_budget: max_budget || null,
      room_type: room_type || null,
      max_distance_km: max_distance_km || null,
      furnishing_preference: furnishing_preference || null,
      bathroom_type: bathroom_type || null,
    });

    // ─── Run AI Room Recommendation Algorithm ───────────
    const [listings] = await db.query("SELECT * FROM listings WHERE status = 'active' AND user_id != ?", [req.user.id]);
    const scored = listings.map((l) => {
      let score = 100;

      // 1. Budget check
      if (max_budget && Number(l.price) > Number(max_budget)) {
        const diff = Number(l.price) - Number(max_budget);
        score -= Math.min(diff * 0.15, 35); // Max 35 points penalty for budget
      }

      // 2. Room Type check
      if (room_type && room_type !== 'all' && l.room_type && l.room_type.toLowerCase() !== room_type.toLowerCase()) {
        score -= 20;
      }

      // 3. Distance check
      if (max_distance_km && l.distance_from_campus && Number(l.distance_from_campus) > Number(max_distance_km)) {
        const diffDist = Number(l.distance_from_campus) - Number(max_distance_km);
        score -= Math.min(diffDist * 5, 20); // Max 20 points penalty for distance
      }

      // 4. Furnishing check
      if (furnishing_preference && l.furnishing && l.furnishing.toLowerCase() !== furnishing_preference.toLowerCase()) {
        score -= 10;
      }

      // 5. Bathroom check
      if (bathroom_type && l.bathroom_type && l.bathroom_type.toLowerCase() !== bathroom_type.toLowerCase()) {
        score -= 10;
      }

      return {
        listing_id: l.id,
        match_score: Math.max(Math.round(score), 30), // Minimum score of 30%
      };
    });

    // Sort descending by score and pick top 10
    const topResults = scored
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 10)
      .map((item, index) => ({
        ...item,
        rank_position: index + 1,
      }));

    // Save recommendation session
    const sessionId = await MatchingModel.createRecommendationSession(req.user.id, prefId, topResults.length);
    if (topResults.length > 0) {
      await MatchingModel.saveRecommendationResults(sessionId, topResults);
    }

    res.json({ success: true, message: 'Preferences saved and recommendations refreshed successfully.' });
  } catch (err) {
    console.error('Save room preferences error:', err);
    res.status(500).json({ success: false, message: 'Failed to save preferences and run matching' });
  }
};

const getRoomRecommendations = async (req, res) => {
  try {
    const recs = await MatchingModel.getLatestRoomRecommendations(req.user.id);
    res.json({ success: true, recommendations: recs });
  } catch (err) {
    console.error('Get room recommendations error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch recommendations' });
  }
};

// ─── Roommate Matching Controllers ────────────────────────────────
const getLifestyleProfile = async (req, res) => {
  try {
    const profile = await MatchingModel.getLifestyleProfile(req.user.id);
    res.json({ success: true, profile });
  } catch (err) {
    console.error('Get lifestyle profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch lifestyle profile' });
  }
};

const saveLifestyleProfile = async (req, res) => {
  try {
    const {
      sleep_schedule,
      study_habit,
      cleanliness_level,
      social_preference,
      noise_tolerance,
      gender_preference,
      has_pets,
      is_smoker,
    } = req.body;

    const profileId = await MatchingModel.saveLifestyleProfile(req.user.id, {
      sleep_schedule,
      study_habit,
      cleanliness_level,
      social_preference,
      noise_tolerance,
      gender_preference,
      has_pets,
      is_smoker,
    });

    // ─── Run AI Roommate Matching Algorithm ───────────
    const candidates = await MatchingModel.getAllLifestyleProfiles(req.user.id);
    const matches = candidates.map((c) => {
      let score = 100;

      // 1. Sleep Schedule match
      if (sleep_schedule && c.sleep_schedule && sleep_schedule !== c.sleep_schedule) {
        score -= 15;
      }
      // 2. Study Habit match
      if (study_habit && c.study_habit && study_habit !== c.study_habit) {
        score -= 15;
      }
      // 3. Cleanliness match
      if (cleanliness_level && c.cleanliness_level && cleanliness_level !== c.cleanliness_level) {
        score -= 20;
      }
      // 4. Social preference match
      if (social_preference && c.social_preference && social_preference !== c.social_preference) {
        score -= 10;
      }
      // 5. Noise tolerance match
      if (noise_tolerance && c.noise_tolerance && noise_tolerance !== c.noise_tolerance) {
        score -= 15;
      }
      // 6. Smoker check
      if (is_smoker !== undefined && c.is_smoker !== undefined && is_smoker !== !!c.is_smoker) {
        score -= 15;
      }
      // 7. Pets check
      if (has_pets !== undefined && c.has_pets !== undefined && has_pets !== !!c.has_pets) {
        score -= 10;
      }

      return {
        matched_user_id: c.user_id,
        compatibility_score: Math.max(Math.round(score), 40),
      };
    });

    // Sort descending by compatibility score and pick top 10
    const topMatches = matches
      .sort((a, b) => b.compatibility_score - a.compatibility_score)
      .slice(0, 10)
      .map((item, index) => ({
        ...item,
        rank_position: index + 1,
        status: 'pending',
      }));

    // Save match session
    const sessionId = await MatchingModel.createMatchSession(req.user.id, profileId, topMatches.length);
    if (topMatches.length > 0) {
      await MatchingModel.saveMatchResults(sessionId, topMatches);
    }

    res.json({ success: true, message: 'Profile saved and roommate matches updated successfully.' });
  } catch (err) {
    console.error('Save lifestyle profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to save profile and run roommate matching' });
  }
};

const getRoommateMatches = async (req, res) => {
  try {
    const matches = await MatchingModel.getLatestRoommateMatches(req.user.id);
    res.json({ success: true, matches });
  } catch (err) {
    console.error('Get roommate matches error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch roommate matches' });
  }
};

module.exports = {
  getRoomPreferences,
  saveRoomPreferences,
  getRoomRecommendations,
  getLifestyleProfile,
  saveLifestyleProfile,
  getRoommateMatches,
};
