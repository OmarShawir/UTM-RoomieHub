import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Check, X, Star } from 'lucide-react';
import api from '../../services/api';
import { DEFAULT_AVATAR } from '../../utils/defaults';
import '../chat/ChatPages.css';

export default function RespondMatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/users/${id}`);
        if (res.data.success) {
          setProfile(res.data.user);
        }
      } catch (err) {
        console.error('Error loading candidate profile:', err);
        setError('Failed to load candidate details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleAccept = async () => {
    try {
      const res = await api.post('/chat/conversations', { other_user_id: id });
      if (res.data.success) {
        navigate(`/chat/${res.data.conversation.id}`);
      }
    } catch (err) {
      console.error('Error accepting match:', err);
      alert('Failed to start chat with roommate candidate.');
    }
  };

  const handleDecline = () => {
    navigate('/ai-match/roommates');
  };

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading candidate details...</div>;
  }

  if (error || !profile) {
    return (
      <div className="page-wrapper">
        <div style={{ background: '#fef2f2', color: '#991b1b', padding: '12px 16px', borderRadius: 8, fontSize: 14 }}>
          {error || 'Candidate profile not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ maxWidth: 480 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>Respond to Match</h1>

      <div className="card" style={{ textAlign: 'center' }}>
        <img
          src={profile.profile_picture || DEFAULT_AVATAR}
          onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
          alt={profile.full_name}
          className="roommate-avatar"
          style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px auto' }}
        />
        <h3 style={{ fontSize: 18, fontWeight: 600 }}>{profile.full_name || 'Anonymous Student'}</h3>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          {profile.faculty || 'Faculty of Computing'} • Year {profile.year_of_study || '2'}
        </p>
        <span className="badge badge-active" style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Star size={12} fill="#fff" /> Verified Match
        </span>

        <div style={{ background: 'var(--color-background)', borderRadius: 'var(--radius-md)', padding: 14, margin: '16px 0', textAlign: 'left' }}>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>About:</p>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            {profile.bio || 'Hello! I am looking for a quiet, clean roommate to share accommodation.'}
          </p>
        </div>

        <div className="respond-actions" style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button className="btn btn-success" onClick={handleAccept} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Check size={16} /> Accept Match
          </button>
          <button className="btn btn-secondary" onClick={handleDecline} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <X size={16} /> Decline
          </button>
        </div>
      </div>
    </div>
  );
}
