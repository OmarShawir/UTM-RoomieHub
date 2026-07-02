const express = require('express');
const { protect } = require('../../../../../../../../../Downloads/UTM-RoomieHub-auth-done/roomiehub/server/middleware/auth.middleware');
const {
  getRoomPreferences,
  saveRoomPreferences,
  getRoomRecommendations,
  getLifestyleProfile,
  saveLifestyleProfile,
  getRoommateMatches,
} = require('../../../../../../../../../Downloads/UTM-RoomieHub-auth-done/roomiehub/server/controllers/matching.controller');

const router = express.Router();

router.use(protect);

router.get('/room/preferences', getRoomPreferences);
router.post('/room/preferences', saveRoomPreferences);
router.get('/room/recommendations', getRoomRecommendations);

router.get('/roommate/profile', getLifestyleProfile);
router.post('/roommate/profile', saveLifestyleProfile);
router.get('/roommate/matches', getRoommateMatches);

module.exports = router;
