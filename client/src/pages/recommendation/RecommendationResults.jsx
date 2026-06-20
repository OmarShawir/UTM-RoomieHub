import { Link } from 'react-router-dom';
import { MapPin, Heart, Sparkles, CheckCircle2, Users, RefreshCw } from 'lucide-react';
import '../listings/ListingPages.css';
import '../chat/ChatPages.css';

const recommendations = [
  {
    id: '1',
    title: 'Single Room - Kolej Tun Dr. Ismail',
    price: 350,
    matchScore: 95,
    address: 'UTM Campus, Skudai',
    distance: 0,
    onCampus: true,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop',
    reasons: ['On-campus convenience', 'Within your budget', 'Study facilities nearby'],
  },
  {
    id: '2',
    title: 'Cozy Single Room Near UTM',
    price: 550,
    matchScore: 88,
    address: 'Jalan Skudai',
    distance: 1.5,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
    reasons: ['Within your budget', 'Close to campus', 'Has WiFi'],
  },
  {
    id: '3',
    title: 'Double Room - Kolej Perdana',
    price: 280,
    matchScore: 85,
    address: 'UTM Campus, Skudai',
    distance: 0,
    onCampus: true,
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&h=400&fit=crop',
    reasons: ['On-campus living', 'Affordable price', 'Campus amenities access'],
  },
];

export default function RecommendationResults() {
  return (
    <div className="page-wrapper" style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 4 }}>AI Smart Matching</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 8 }}>Personalized recommendations based on your preferences</p>

      <div className="ai-match-tabs">
        <Link to="/ai-match" className="ai-match-tab active"><Sparkles size={15} /> Room Recommendations</Link>
        <Link to="/ai-match/roommates" className="ai-match-tab"><Users size={15} /> Roommate Matches</Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>{recommendations.length} listings match your preferences</p>
        <Link to="/ai-match/preferences" className="btn btn-secondary"><RefreshCw size={14} /> Update Preferences</Link>
      </div>

      {recommendations.map((rec) => (
        <div key={rec.id} className="card match-listing-card">
          <div className="match-listing-img-wrap">
            <img src={rec.image} alt={rec.title} />
            <div className="match-listing-badges">
              <span className="match-percent-badge"><Sparkles size={12} /> {rec.matchScore}% Match</span>
              {rec.onCampus && <span className="badge badge-info">On Campus</span>}
            </div>
          </div>
          <div className="match-listing-content">
            <h3>{rec.title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-secondary)' }}>
              <MapPin size={13} /> {rec.address}{rec.onCampus ? ' • On Campus' : ` • ${rec.distance}km from UTM`}
            </div>

            <p style={{ fontSize: 13, fontWeight: 600, marginTop: 10 }}>Why this matches:</p>
            <ul className="match-why-list">
              {rec.reasons.map((reason, idx) => (
                <li key={idx}><CheckCircle2 size={13} /> {reason}</li>
              ))}
            </ul>

            <div className="match-listing-footer">
              <div className="listing-card-price">RM {rec.price}<span>/month</span></div>
              <Link to={`/ai-match/room/${rec.id}`} className="btn btn-primary">View Details</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
