import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { DEFAULT_AVATAR } from '../../utils/defaults';
import './ReviewPages.css';

export default function ListingReviewsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review form state
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    loadReviews();
  }, [id]);

  const loadReviews = async () => {
    try {
      const res = await api.get(`/reviews/listing/${id}`);
      if (res.data.success) setReviews(res.data.reviews);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const alreadyReviewed = user && reviews.some(r => r.reviewer_id === user.id);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (rating < 1 || rating > 5) {
      setFormError('Please select a star rating (1-5).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/reviews', {
        listing_id: Number(id),
        rating,
        pros: pros.trim() || null,
        cons: cons.trim() || null,
      });

      if (res.data.success) {
        setFormSuccess('Review submitted successfully!');
        setRating(0);
        setPros('');
        setCons('');
        setShowForm(false);
        // Reload reviews to show the new one
        const refreshed = await api.get(`/reviews/listing/${id}`);
        if (refreshed.data.success) setReviews(refreshed.data.reviews);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit review.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading reviews...</div>;

  return (
    <div className="page-wrapper" style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>Listing Reviews</h1>

      {reviews.length > 0 && (
        <div className="card review-summary-card" style={{ marginBottom: 20 }}>
          <div className="score">{avgRating}</div>
          <div className="stars">{'★'.repeat(Math.round(avgRating))}</div>
          <div className="count">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
        </div>
      )}

      {/* ── Write a Review Button / Form ─────────── */}
      {user && !alreadyReviewed && (
        <div className="card" style={{ marginBottom: 20 }}>
          {!showForm ? (
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => { setShowForm(true); setFormError(''); setFormSuccess(''); }}
            >
              <Star size={16} /> Write a Review
            </button>
          ) : (
            <form onSubmit={handleSubmitReview} className="review-form">
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Write Your Review</h3>

              {/* Star picker */}
              <div className="review-form-section">
                <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, display: 'block' }}>Rating *</label>
                <div className="star-rating-picker">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="star-btn"
                    >
                      <Star
                        size={28}
                        fill={(hoverRating || rating) >= star ? '#F59E0B' : 'none'}
                        color={(hoverRating || rating) >= star ? '#F59E0B' : '#d1d5db'}
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span style={{ marginLeft: 8, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                      {rating}/5
                    </span>
                  )}
                </div>
              </div>

              {/* Pros */}
              <div className="review-form-section">
                <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, display: 'block' }}>Pros</label>
                <textarea
                  rows={3}
                  placeholder="What did you like about this listing?"
                  value={pros}
                  onChange={(e) => setPros(e.target.value)}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              {/* Cons */}
              <div className="review-form-section">
                <label style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, display: 'block' }}>Cons</label>
                <textarea
                  rows={3}
                  placeholder="Any downsides or things to improve?"
                  value={cons}
                  onChange={(e) => setCons(e.target.value)}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              {formError && (
                <div style={{ background: '#fef2f2', color: '#991b1b', padding: '10px 14px', borderRadius: 6, fontSize: 13, marginBottom: 10 }}>
                  {formError}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary" disabled={submitting} style={{ flex: 1 }}>
                  <Send size={14} /> {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => { setShowForm(false); setFormError(''); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {alreadyReviewed && (
        <div style={{ background: '#f0fdf4', color: '#166534', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
          ✓ You have already reviewed this listing.
        </div>
      )}

      {formSuccess && (
        <div style={{ background: '#f0fdf4', color: '#166534', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
          {formSuccess}
        </div>
      )}

      {/* ── Existing Reviews ──────────────────────── */}
      <div className="card">
        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--color-text-secondary)' }}>
            <Star size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p>No reviews yet for this listing.</p>
            {user && <p style={{ fontSize: 13, marginTop: 8 }}>Be the first to write a review!</p>}
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="review-item">
              <img
                src={r.reviewer_avatar || DEFAULT_AVATAR}
                alt={r.reviewer_name}
                onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
              />
              <div style={{ flex: 1 }}>
                <div className="review-item-top">
                  <span className="review-item-name">{r.reviewer_name}</span>
                  <span className="review-item-date">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                <div className="review-item-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                {r.pros && <p className="review-item-text"><strong>Pros:</strong> {r.pros}</p>}
                {r.cons && <p className="review-item-text"><strong>Cons:</strong> {r.cons}</p>}
              </div>
            </div>
          ))
        )}
      </div>

      <Link to={`/listings/${id}`} className="btn btn-secondary" style={{ marginTop: 20, display: 'inline-block' }}>Back to Listing</Link>
    </div>
  );
}
