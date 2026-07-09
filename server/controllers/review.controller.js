const ReviewModel = require('../models/review.model');

// ─── POST /api/reviews ─────────────────────────────
// Body: { listing_id?, target_user_id?, rating, pros, cons }
const submitReview = async (req, res) => {
  try {
    const { listing_id, target_user_id, rating, pros, cons } = req.body;

    if (!listing_id && !target_user_id) {
      return res.status(400).json({ success: false, message: 'A listing or user must be specified' });
    }
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    // Prevent duplicate reviews
    if (listing_id) {
      const already = await ReviewModel.hasReviewedListing(req.user.id, listing_id);
      if (already) return res.status(409).json({ success: false, message: 'You already reviewed this listing' });
    }
    if (target_user_id) {
      if (Number(target_user_id) === req.user.id) {
        return res.status(400).json({ success: false, message: 'You cannot review yourself' });
      }
      const already = await ReviewModel.hasReviewedUser(req.user.id, target_user_id);
      if (already) return res.status(409).json({ success: false, message: 'You already reviewed this user' });
    }

    const reviewId = await ReviewModel.create({
      reviewer_id: req.user.id,
      target_user_id,
      listing_id,
      rating,
      pros,
      cons,
    });

    const review = await ReviewModel.findById(reviewId);
    res.status(201).json({ success: true, review });
  } catch (err) {
    console.error('Submit review error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit review' });
  }
};

// ─── GET /api/reviews/listing/:id ──────────────────
const getListingReviews = async (req, res) => {
  try {
    const [reviews, stats] = await Promise.all([
      ReviewModel.findByListing(req.params.id),
      ReviewModel.getListingStats(req.params.id),
    ]);
    res.json({ success: true, reviews, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

// ─── GET /api/reviews/user/:id ─────────────────────
const getUserReviews = async (req, res) => {
  try {
    const [reviews, stats] = await Promise.all([
      ReviewModel.findByUser(req.params.id),
      ReviewModel.getUserStats(req.params.id),
    ]);
    res.json({ success: true, reviews, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

// ─── POST /api/reviews/:id/report ───────────────────
const reportReview = async (req, res) => {
  try {
    const { reason, description } = req.body;
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Reason is required to report a review' });
    }

    const review = await ReviewModel.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    await ReviewModel.reportReview(req.user.id, req.params.id, reason, description);
    res.json({ success: true, message: 'Review reported successfully' });
  } catch (err) {
    console.error('Report review error:', err);
    res.status(500).json({ success: false, message: 'Failed to report review' });
  }
};

module.exports = { submitReview, getListingReviews, getUserReviews, reportReview };
