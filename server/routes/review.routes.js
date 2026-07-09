const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { submitReview, getListingReviews, getUserReviews, reportReview } = require('../controllers/review.controller');

const router = express.Router();

router.post('/',            protect, submitReview);
router.get('/listing/:id',  getListingReviews);
router.get('/user/:id',     getUserReviews);
router.post('/:id/report',  protect, reportReview);

module.exports = router;
