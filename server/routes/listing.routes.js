const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  getListings,
  getMyListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require('../controllers/listing.controller');

const upload = require('../middleware/upload.middleware');

const router = express.Router();

// Protected
router.get('/', protect, getListings);

// Protected — static paths BEFORE :id param
router.get('/my', protect, getMyListings);
router.get('/wishlist', protect, getWishlist);
router.post('/', protect, createListing);
router.post('/upload', protect, upload.array('photos', 6), (req, res) => {
  const urls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
  res.json({ success: true, urls });
});

// Param routes
router.get('/:id', protect, getListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);

// Wishlist actions
router.post('/:id/wishlist', protect, addToWishlist);
router.delete('/:id/wishlist', protect, removeFromWishlist);

module.exports = router;
router.delete('/:id', protect, deleteListing);

// Wishlist actions
router.post('/:id/wishlist', protect, addToWishlist);
router.delete('/:id/wishlist', protect, removeFromWishlist);

module.exports = router;
