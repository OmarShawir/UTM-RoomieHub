import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Sparkles, CheckCircle2, Users, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { DEFAULT_LISTING_IMAGE } from '../../utils/defaults';
import '../listings/ListingPages.css';
import '../chat/ChatPages.css';

export default function RecommendationResults() {
  const [recommendations, setRecommendations] = useState([]);
  const [hasPreferences, setHasPreferences] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [recsRes, prefsRes] = await Promise.all([
          api.get('/matching/room/recommendations'),
          api.get('/matching/room/preferences')
        ]);
        if (recsRes.data.success) {
          setRecommendations(recsRes.data.recommendations);
        }
        if (prefsRes.data.success && prefsRes.data.preferences) {
          setHasPreferences(true);
        }
      } catch (err) {
        console.error('Failed to load matching data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading room recommendations...</div>;
  }

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

      {recommendations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Sparkles size={40} style={{ color: 'var(--color-primary)', marginBottom: 12 }} />
          {hasPreferences ? (
            <>
              <h3>No Matches Found</h3>
              <p style={{ color: 'var(--color-text-secondary)', margin: '8px 0 20px 0' }}>
                We successfully saved your preferences, but no listings currently match your criteria. Try adjusting your budget or distance filters!
              </p>
              <Link to="/ai-match/preferences" className="btn btn-primary">Adjust Preferences</Link>
            </>
          ) : (
            <>
              <h3>Set Your Preferences</h3>
              <p style={{ color: 'var(--color-text-secondary)', margin: '8px 0 20px 0' }}>
                Tell us what you are looking for in a room to generate personalized AI matches!
              </p>
              <Link to="/ai-match/preferences" className="btn btn-primary">Set Room Preferences</Link>
            </>
          )}
        </div>
      ) : (
        recommendations.map((rec) => (
          <div key={rec.id} className="card match-listing-card">
            <div className="match-listing-img-wrap">
              <img
                src={rec.cover_photo || DEFAULT_LISTING_IMAGE}
                onError={(e) => { e.target.src = DEFAULT_LISTING_IMAGE; }}
                alt={rec.title}
              />
              <div className="match-listing-badges">
                <span className="match-percent-badge"><Sparkles size={12} /> {rec.match_score}% Match</span>
                {rec.distance_from_campus === 0 && <span className="badge badge-info">On Campus</span>}
              </div>
            </div>
            <div className="match-listing-content">
              <h3>{rec.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                <MapPin size={13} /> {rec.address} • {rec.distance_from_campus || '0'} km from UTM
              </div>

              <p style={{ fontSize: 13, fontWeight: 600, marginTop: 10 }}>Match highlights:</p>
              <ul className="match-why-list">
                <li><CheckCircle2 size={13} /> Matches {rec.room_type} room preference</li>
                <li><CheckCircle2 size={13} /> High budget compatibility</li>
                {rec.distance_from_campus < 3 && <li><CheckCircle2 size={13} /> Great proximity to UTM Campus</li>}
              </ul>

              <div className="match-listing-footer">
                <div className="listing-card-price">RM {rec.price}<span>/month</span></div>
                <Link to={`/listings/${rec.id}`} className="btn btn-primary">View Details</Link>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
