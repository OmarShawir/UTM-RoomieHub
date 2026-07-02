import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapPin, Award, Calendar, MessageSquare, Flag, Star } from 'lucide-react';
import api from '../../services/api';
import { DEFAULT_AVATAR } from '../../utils/defaults';
import './ProfilePages.css';

export default function OtherProfilePage() {
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
        console.error('Error fetching profile:', err);
        setError('Failed to load user profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleSendMessage = async () => {
    try {
      const res = await api.post('/chat/conversations', { other_user_id: id });
      if (res.data.success) {
        navigate(`/chat/${res.data.conversation.id}`);
      }
    } catch (err) {
      console.error('Error starting conversation:', err);
      alert('Failed to start chat with user.');
    }
  };

  const handleReport = () => {
    alert('To report a user, please initiate a chat and use the report options inside the conversation window.');
  };

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading profile...</div>;
  }

  if (error || !profile) {
    return (
      <div className="page-wrapper">
        <div style={{ background: '#fef2f2', color: '#991b1b', padding: '12px 16px', borderRadius: 8, fontSize: 14 }}>
          {error || 'Profile not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="profile-layout">
        <div className="card profile-sidebar">
          <img
            src={profile.profile_picture || DEFAULT_AVATAR}
            onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
            alt={profile.full_name}
            className="profile-avatar-lg"
          />
          <h2>{profile.full_name || 'Anonymous Student'}</h2>
          <p className="matric">{profile.matric_no || 'Matric ID Not Provided'}</p>
          <span className="badge badge-info">Verified Student</span>
          <p style={{ fontSize: 14, marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <Star size={14} fill="#F59E0B" color="#F59E0B" /> 5.0 (verified roommate)
          </p>
          <button className="btn btn-primary" onClick={handleSendMessage} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
            <MessageSquare size={16} /> Send Message
          </button>
          <button className="btn btn-secondary" onClick={handleReport} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
            <Flag size={16} /> Report User
          </button>
        </div>

        <div>
          <div className="card profile-info-card">
            <h3>Academic Information</h3>
            <div className="profile-info-row">
              <MapPin size={18} />
              <div><div className="label">Faculty</div><div className="value">{profile.faculty || 'Faculty of Computing'}</div></div>
            </div>
            <div className="profile-info-row">
              <Award size={18} />
              <div><div className="label">Nationality</div><div className="value">{profile.nationality || 'Malaysian'}</div></div>
            </div>
            <div className="profile-info-row">
              <Calendar size={18} />
              <div><div className="label">Year of Study</div><div className="value">Year {profile.year_of_study || '2'}</div></div>
            </div>
          </div>

          <div className="card profile-info-card">
            <h3>About</h3>
            <p style={{ lineHeight: 1.6 }}>{profile.bio || 'This user has not updated their bio yet.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
