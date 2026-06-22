import { useParams, Link } from 'react-router-dom';
import './ReviewPages.css';

const reviews = [
  { name: 'John Doe', stars: 5, date: '2 weeks ago', text: 'Great roommate! Very clean and respectful of shared spaces.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { name: 'Lim Wei', stars: 5, date: '1 month ago', text: 'Easy to communicate with and very considerate.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
];

export default function UserReviewsPage() {
  const { id } = useParams();
  const avgRating = (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length).toFixed(1);

  return (
    <div className="page-wrapper" style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>Roommate Reviews</h1>

      <div className="card review-summary-card" style={{ marginBottom: 20 }}>
        <div className="score">{avgRating}</div>
        <div className="stars">{'★'.repeat(Math.round(avgRating))}</div>
        <div className="count">{reviews.length} reviews</div>
      </div>

      <div className="card">
        {reviews.map((r, idx) => (
          <div key={idx} className="review-item">
            <img src={r.avatar} alt={r.name} />
            <div style={{ flex: 1 }}>
              <div className="review-item-top">
                <span className="review-item-name">{r.name}</span>
                <span className="review-item-date">{r.date}</span>
              </div>
              <div className="review-item-stars">{'★'.repeat(r.stars)}</div>
              <p className="review-item-text">{r.text}</p>
            </div>
          </div>
        ))}
      </div>

      <Link to={`/profile/${id}`} className="btn btn-secondary" style={{ marginTop: 20, display: 'inline-block' }}>Back to Profile</Link>
    </div>
  );
}
