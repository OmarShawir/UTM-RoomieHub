import { Link } from 'react-router-dom';
import { Edit, Mail, Flag, MapPin, Calendar, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEFAULT_AVATAR } from '../../utils/defaults';
import './ProfilePages.css';

export default function ViewProfilePage() {
  const { user } = useAuth();

  const profile = {
    name: user?.full_name || 'Ahmad Zaki bin Abdullah',
    displayName: user?.display_name || 'N/A',
    matricNo: user?.matric_no || 'N/A',
    email: user?.email || 'N/A',
    nationality: user?.nationality || 'N/A',
    faculty: user?.faculty || 'N/A',
    year: user?.year_of_study ? `Year ${user.year_of_study}` : 'N/A',
    bio: user?.bio || 'No bio written yet.',
    avatar: user?.profile_picture || DEFAULT_AVATAR,
    joinedDate: user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) : 'N/A',
  };

  return (
    <div className="page-wrapper">
      <div className="profile-page-header">
        <h1>My Profile</h1>
        <Link to="/profile/edit" className="btn btn-primary">
          <Edit size={16} /> Edit Profile
        </Link>
      </div>

      <div className="profile-layout">
        {/* Sidebar */}
        <div className="card profile-sidebar">
          <img src={profile.avatar} alt={profile.name} className="profile-avatar-lg" />
          <h2>{profile.name}</h2>
          <p className="matric">{profile.matricNo}</p>
          <span className="badge badge-info">Verified Student</span>
          <Link to="/profile/photo" className="btn btn-secondary" style={{ marginTop: 12 }}>Change Photo</Link>
        </div>

        {/* Details */}
        <div>
          <div className="card profile-info-card" style={{ marginBottom: 20 }}>
            <h3>Contact & Personal Info</h3>
            <div className="profile-info-row">
              <Mail size={18} />
              <div>
                <div className="label">Email</div>
                <div className="value">{profile.email}</div>
              </div>
            </div>
            <div className="profile-info-row">
              <User size={18} />
              <div>
                <div className="label">Display Name / Nickname</div>
                <div className="value">{profile.displayName}</div>
              </div>
            </div>
            <div className="profile-info-row">
              <Flag size={18} />
              <div>
                <div className="label">Nationality</div>
                <div className="value">{profile.nationality}</div>
              </div>
            </div>
          </div>

          <div className="card profile-info-card" style={{ marginBottom: 20 }}>
            <h3>Academic Information</h3>
            <div className="profile-info-row">
              <MapPin size={18} />
              <div>
                <div className="label">Faculty</div>
                <div className="value">{profile.faculty}</div>
              </div>
            </div>
            <div className="profile-info-row">
              <Calendar size={18} />
              <div>
                <div className="label">Year of Study</div>
                <div className="value">{profile.year}</div>
              </div>
            </div>
          </div>

          <div className="card profile-info-card" style={{ marginBottom: 20 }}>
            <h3>About Me</h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{profile.bio}</p>
          </div>

          <div className="card profile-info-card">
            <h3>Account Status</h3>
            <div className="profile-status-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
              <span>Member since</span>
              <strong>{profile.joinedDate}</strong>
            </div>
            <div className="profile-status-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0 0' }}>
              <span>Account Status</span>
              <span className="badge badge-active">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
