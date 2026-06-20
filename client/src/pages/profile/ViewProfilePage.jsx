import { Link } from 'react-router-dom';
import { Edit, Mail, Phone, MapPin, Calendar, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './ProfilePages.css';

export default function ViewProfilePage() {
  const { user } = useAuth();

  const profile = {
    name: user?.full_name || 'Ahmad Zaki bin Abdullah',
    matricNo: user?.matric_no || 'A21EC0123',
    email: user?.email || 'ahmad.zaki@graduate.utm.my',
    phone: '+60 12-345 6789',
    faculty: user?.faculty || 'Faculty of Computing',
    program: 'Bachelor of Computer Science (Software Engineering)',
    year: `Year ${user?.year_of_study || 3}`,
    joinedDate: 'January 2024',
    bio: 'Looking for a quiet roommate near UTM campus. Non-smoker, prefer shared kitchen facilities.',
    avatar: user?.profile_picture || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
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
          <Link to="/profile/photo" className="btn btn-secondary">Change Photo</Link>
        </div>

        {/* Details */}
        <div>
          <div className="card profile-info-card">
            <h3>Contact Information</h3>
            <div className="profile-info-row">
              <Mail size={18} />
              <div>
                <div className="label">Email</div>
                <div className="value">{profile.email}</div>
              </div>
            </div>
            <div className="profile-info-row">
              <Phone size={18} />
              <div>
                <div className="label">Phone</div>
                <div className="value">{profile.phone}</div>
              </div>
            </div>
          </div>

          <div className="card profile-info-card">
            <h3>Academic Information</h3>
            <div className="profile-info-row">
              <MapPin size={18} />
              <div>
                <div className="label">Faculty</div>
                <div className="value">{profile.faculty}</div>
              </div>
            </div>
            <div className="profile-info-row">
              <Award size={18} />
              <div>
                <div className="label">Program</div>
                <div className="value">{profile.program}</div>
              </div>
            </div>
            <div className="profile-info-row">
              <Calendar size={18} />
              <div>
                <div className="label">Year</div>
                <div className="value">{profile.year}</div>
              </div>
            </div>
          </div>

          <div className="card profile-info-card">
            <h3>About Me</h3>
            <p>{profile.bio}</p>
          </div>

          <div className="card profile-info-card">
            <h3>Account Status</h3>
            <div className="profile-status-row">
              <span>Member since</span>
              <strong>{profile.joinedDate}</strong>
            </div>
            <div className="profile-status-row">
              <span>Account Status</span>
              <span className="badge badge-active">Active</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}