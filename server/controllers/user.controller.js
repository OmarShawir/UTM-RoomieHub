const UserModel = require('../models/user.model');

// GET /api/users/:id
const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get profile' });
  }
};

// PUT /api/users/me
const updateProfile = async (req, res) => {
  try {
    const { full_name, display_name, faculty, year_of_study, nationality, bio } = req.body;
    await UserModel.updateProfile(req.user.id, {
      full_name,
      display_name,
      faculty,
      year_of_study,
      nationality,
      bio,
      profile_picture: req.body.profile_picture || null,
    });
    const updated = await UserModel.findById(req.user.id);
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

module.exports = { getProfile, updateProfile };
