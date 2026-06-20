import { Link } from 'react-router-dom';
import { Sparkles, Users, RefreshCw } from 'lucide-react';
import '../chat/ChatPages.css';

const matches = [
  {
    id: '1',
    name: 'Sarah binti Ahmad',
    faculty: 'Faculty of Computing • Year 2',
    matchScore: 92,
    bio: 'Looking for a clean, quiet roommate...',
    tags: ['Non-smoker', 'Early Bird', 'Very Clean'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    name: 'Fatimah Ali',
    faculty: 'Faculty of Engineering • Year 3',
    matchScore: 85,
    bio: 'Friendly and organized student...',
    tags: ['Non-smoker', 'Quiet & Private'],
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  },
];

export default function MatchResultsPage() {
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

      <div className="roommate-grid">
        {matches.map((m) => (
          <div key={m.id} className="card roommate-card">
            <img src={m.avatar} alt={m.name} className="roommate-avatar" />
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>{m.name}</h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{m.faculty}</p>
            <span className="match-percent-badge" style={{ marginTop: 8 }}><Sparkles size={12} /> {m.matchScore}% Match</span>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 10 }}>{m.bio}</p>
            <p style={{ fontSize: 12, fontWeight: 600, marginTop: 10 }}>You both:</p>
            <div className="roommate-tags">
              {m.tags.map((t) => <span key={t} className="roommate-tag">{t}</span>)}
            </div>
            <div className="roommate-card-actions">
              <Link to={`/ai-match/roommates/${m.id}`} className="btn btn-secondary">View Profile</Link>
              <Link to={`/ai-match/respond/${m.id}`} className="btn btn-primary">Connect</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
