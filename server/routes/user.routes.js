const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { getProfile, updateProfile } = require('../controllers/user.controller');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

// GET /api/users/:id
router.get('/:id', protect, getProfile);

// PUT /api/users/me
router.put('/me', protect, updateProfile);

// POST /api/users/avatar
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const UserModel = require('../models/user.model');
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await UserModel.updateProfile(req.user.id, {
      full_name: user.full_name,
      display_name: user.display_name,
      faculty: user.faculty,
      year_of_study: user.year_of_study,
      nationality: user.nationality,
      bio: user.bio,
      profile_picture: avatarUrl,
    });

    const updatedUser = await UserModel.findById(req.user.id);
    res.json({ success: true, user: updatedUser, url: avatarUrl });
  } catch (err) {
    console.error('Avatar upload error:', err);
    res.status(500).json({ success: false, message: 'Failed to upload avatar' });
  }
});

module.exports = router;
