import { useParams, useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import '../chat/ChatPages.css';

export default function RespondMatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const match = {
    name: 'Sarah binti Ahmad',
    faculty: 'Faculty of Computing',
    matchScore: 92,
    tags: ['Non-smoker', 'Early Bird', 'Very Clean'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  };

  const handleAccept = () => navigate('/chat');
  const handleDecline = () => navigate('/ai-match/roommates');

  return (
    <div className="page-wrapper" style={{ maxWidth: 480 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>Respond to Match</h1>

      <div className="card" style={{ textAlign: 'center' }}>
        <img src={match.avatar} alt={match.name} className="roommate-avatar" style={{ width: 80, height: 80 }} />
        <h3 style={{ fontSize: 18, fontWeight: 600 }}>{match.name}</h3>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>{match.faculty}</p>
        <span className="badge badge-active" style={{ marginTop: 8 }}>{match.matchScore}% Match</span>

        <div style={{ background: 'var(--color-background)', borderRadius: 'var(--radius-md)', padding: 14, margin: '16px 0', textAlign: 'left' }}>
          <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>You both:</p>
          <div className="roommate-tags" style={{ justifyContent: 'flex-start' }}>
            {match.tags.map((t) => <span key={t} className="roommate-tag">{t}</span>)}
          </div>
        </div>

        <div className="respond-actions">
          <button className="btn btn-success" onClick={handleAccept}><Check size={16} /> Accept Match</button>
          <button className="btn btn-secondary" onClick={handleDecline}><X size={16} /> Decline Match</button>
        </div>
      </div>
    </div>
  );
}
