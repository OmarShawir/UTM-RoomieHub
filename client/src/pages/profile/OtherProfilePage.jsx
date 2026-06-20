import { useParams } from 'react-router-dom';
import { MapPin, Award, Calendar, MessageSquare, Flag, Star } from 'lucide-react';
import './ProfilePages.css';

export default function OtherProfilePage() {
  const { id } = useParams();

  const profile = {
    name: 'Sarah binti Ahmad',
    matricNo: 'A21CS0456',
    faculty: 'Faculty of Computing',
    program: 'Bachelor of Computer Science (Data Science)',
    year: 'Year 2',
    rating: 4.8,
    reviewCount: 12,
    bio: 'Looking for a roommate who is clean, organized, and respectful. I enjoy reading and studying in quiet environments.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  };

  const reviews = [
    {
      name: 'John Doe',
      stars: 5,
      time: '2 weeks ago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      text: 'Great roommate! Very clean and respectful of shared spaces.',
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="profile-layout">

        <div className="card profile-sidebar">
          <img src={profile.avatar} alt={profile.name} className="profile-avatar-lg" />
          <h2>{profile.name}</h2>
          <p className="matric">{profile.matricNo}</p>
          <span className="badge badge-info">Verified Student</span>
          <p style={{ fontSize: 14, marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <Star size={14} fill="#F59E0B" color="#F59E0B" /> {profile.rating} ({profile.reviewCount} reviews)
          </p>
          <button className="btn btn-primary"><MessageSquare size={16} /> Send Message</button>
          <button className="btn btn-secondary"><Flag size={16} /> Report User</button>
        </div>

        <div>
          <div className="card profile-info-card">
            <h3>Academic Information</h3>
            <div className="profile-info-row">
              <MapPin size={18} />
              <div><div className="label">Faculty</div><div className="value">{profile.faculty}</div></div>
            </div>
            <div className="profile-info-row">
              <Award size={18} />
              <div><div className="label">Program</div><div className="value">{profile.program}</div></div>
            </div>
            <div className="profile-info-row">
              <Calendar size={18} />
              <div><div className="label">Year</div><div className="value">{profile.year}</div></div>
            </div>
          </div>

          <div className="card profile-info-card">
            <h3>About</h3>
            <p>{profile.bio}</p>
          </div>

          <div className="card profile-info-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ marginBottom: 0 }}>Reviews</h3>
              <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: 13 }}>View All</button>
            </div>
            {reviews.map((r, i) => (
              <div key={i} className="review-mini">
                <img src={r.avatar} alt={r.name} />
                <div>
                  <div className="review-mini-name">{r.name}</div>
                  <div className="review-mini-stars">{'★'.repeat(r.stars)}</div>
                  <div className="review-mini-text">{r.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}