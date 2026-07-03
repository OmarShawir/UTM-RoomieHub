import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import api from '../../services/api';
import { DEFAULT_AVATAR } from '../../utils/defaults';
import './ReviewPages.css';

export default function UserReviewsPage() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/reviews/user/${id}`);
        if (res.data.success) setReviews(res.data.reviews);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading reviews...</div>;

  return (
    <div className="page-wrapper" style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>Roommate Reviews</h1>

      {reviews.length > 0 && (
        <div className="card review-summary-card" style={{ marginBottom: 20 }}>
          <div className="score">{avgRating}</div>
          <div className="stars">{'★'.repeat(Math.round(avgRating))}</div>
          <div className="count">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
        </div>
      )}

      <div className="card">
        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--color-text-secondary)' }}>
            <Star size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p>No reviews yet.</p>
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
                <div className="review-item-stars">{'★'.repeat(r.rating)}</div>
                {r.pros && <p className="review-item-text"><strong>Pros:</strong> {r.pros}</p>}
                {r.cons && <p className="review-item-text"><strong>Cons:</strong> {r.cons}</p>}
              </div>
            </div>
          ))
        )}
      </div>

      <Link to={`/profile/${id}`} className="btn btn-secondary" style={{ marginTop: 20, display: 'inline-block' }}>Back to Profile</Link>
    </div>
  );
}
