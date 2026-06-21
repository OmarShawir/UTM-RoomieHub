import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import './ReviewPages.css';

export default function SubmitReviewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/listings/${id}/reviews`);
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: 480 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>Write a Review</h1>

      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Rate this Listing</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rating</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={28}
                    fill={(hovered || rating) >= star ? '#F59E0B' : 'none'}
                    color={(hovered || rating) >= star ? '#F59E0B' : '#D1D5DB'}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Your Review</label>
            <textarea
              rows={5}
              placeholder="Share your experience..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="listing-form-actions" style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Review</button>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
