import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Users, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { DEFAULT_AVATAR } from '../../utils/defaults';
import '../chat/ChatPages.css';

export default function MatchResultsPage() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get('/matching/roommate/matches');
        if (res.data.success) {
          setMatches(res.data.matches);
        }
      } catch (err) {
        console.error('Failed to load roommate matches:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  const handleConnect = async (otherUserId) => {
    try {
      const res = await api.post('/chat/conversations', { other_user_id: otherUserId });
      if (res.data.success) {
        navigate(`/chat/${res.data.conversation.id}`);
      }
    } catch (err) {
      console.error('Error connecting with roommate candidate:', err);
      alert('Failed to start chat with roommate candidate.');
    }
  };

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading roommate matches...</div>;
  }

  return (
    <div className="page-wrapper" style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 4 }}>AI Smart Matching</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 8 }}>Personalized recommendations based on your lifestyle</p>

      <div className="ai-match-tabs">
        <Link to="/ai-match" className="ai-match-tab"><Sparkles size={15} /> Room Recommendations</Link>
        <Link to="/ai-match/roommates" className="ai-match-tab active"><Users size={15} /> Roommate Matches</Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>{matches.length} potential roommates found based on your lifestyle</p>
        <Link to="/ai-match/lifestyle" className="btn btn-secondary"><RefreshCw size={14} /> Update Preferences</Link>
      </div>

      {matches.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Users size={40} style={{ color: 'var(--color-primary)', marginBottom: 12 }} />
          <h3>No Roommate Matches Yet</h3>
          <p style={{ color: 'var(--color-text-secondary)', margin: '8px 0 20px 0' }}>
            Set up your lifestyle profile to find compatible roommates at UTM!
          </p>
          <Link to="/ai-match/lifestyle" className="btn btn-primary">Create Lifestyle Profile</Link>
        </div>
      ) : (
        <div className="roommate-grid">
          {matches.map((m) => {
            const tags = [];
            if (m.sleep_schedule === 'early') tags.push('Early Bird');
            if (m.sleep_schedule === 'night') tags.push('Night Owl');
            if (m.cleanliness_level === 'very-clean') tags.push('Clean & Neat');
            if (m.social_preference === 'quiet') tags.push('Quiet & Private');
            if (m.social_preference === 'social') tags.push('Social & Outgoing');
            if (!m.is_smoker) tags.push('Non-smoker');

            return (
              <div key={m.user_id} className="card roommate-card">
                <img
                  src={m.profile_picture || DEFAULT_AVATAR}
                  onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                  alt={m.full_name}
                  className="roommate-avatar"
                />
                <h3 style={{ fontSize: 16, fontWeight: 600 }}>{m.full_name || 'Anonymous'}</h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  {m.faculty || 'Computing'} • Year {m.year_of_study || '2'}
                </p>
                <span className="match-percent-badge" style={{ marginTop: 8 }}><Sparkles size={12} /> {m.compatibility_score}% Match</span>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 10, minHeight: 40 }}>
                  {m.bio || 'Hello! Looking for a nice roommate.'}
                </p>
                <p style={{ fontSize: 12, fontWeight: 600, marginTop: 10 }}>Preferences:</p>
                <div className="roommate-tags">
                  {tags.map((t) => <span key={t} className="roommate-tag">{t}</span>)}
                </div>
                <div className="roommate-card-actions" style={{ marginTop: 'auto', paddingTop: 12 }}>
                  <Link to={`/profile/${m.user_id}`} className="btn btn-secondary">View Profile</Link>
                  <Link to={`/ai-match/respond/${m.user_id}`} className="btn btn-primary">Connect</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
