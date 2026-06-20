import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Sparkles, Users as UsersIcon, MessageSquare } from 'lucide-react';
import '../listings/ListingPages.css';
import '../chat/ChatPages.css';

export default function MatchedProfilePage() {
  const { id } = useParams();

  const match = {
    name: 'Ahmad Razak',
    matricNo: 'A20EC0123',
    year: 'Year 3',
    program: 'Bachelor of Computer Science',
    compatibility: 85,
    bio: "Final year Computer Science student looking for a quiet roommate. I'm tidy, respectful, and enjoy studying in a peaceful environment. Non-smoker and early sleeper.",
    whyMatch: [
      'Similar sleep schedule (both early birds)',
      'Both prefer quiet study environment',
      'Compatible cleanliness standards',
      'Similar lifestyle preferences',
      'Both from Computer Science background',
    ],
    lifestyle: {
      sleepSchedule: 'Early Bird (10 PM – 6 AM)',
      studyHabits: 'Quiet Study',
      cleanliness: 'Very Clean',
      lifestyleTag: 'Introvert',
      guestPolicy: 'Rarely',
    },
    interests: ['Gaming', 'Reading', 'Coding', 'Photography'],
    currentListing: { title: 'Looking for roommate in Taman University', location: 'Taman University', price: 350 },
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: 700 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Link to="/ai-match/roommates" className="auth-back-link" style={{ color: 'var(--color-primary)' }}>
          <ArrowLeft size={16} /> Back to Matches
        </Link>
        <span className="badge badge-active">{match.compatibility}% Compatible</span>
      </div>

      <div className="card" style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.25)', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Excellent Match!</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>You and {match.name.split(' ')[0]} have high compatibility based on lifestyle preferences</div>
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--color-success)' }}>{match.compatibility}%</div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 600 }}>
            {match.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{match.name}</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{match.matricNo} • {match.year} • {match.program}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <Link to={`/ai-match/respond/${id}`} className="btn btn-primary" style={{ flex: 1 }}><UsersIcon size={16} /> Respond to Match</Link>
          <Link to="/chat" className="btn btn-secondary" style={{ flex: 1 }}><MessageSquare size={16} /> Send Message</Link>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Why You Match</h3>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {match.whyMatch.map((reason, idx) => (
            <li key={idx} style={{ display: 'flex', gap: 8, fontSize: 14 }}>
              <Star size={15} color="var(--color-warning)" style={{ flexShrink: 0, marginTop: 2 }} />
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>About</h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>{match.bio}</p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Lifestyle Preferences</h3>
        <div className="compat-grid">
          <div className="compat-item"><Clock size={16} color="var(--color-text-secondary)" /><div><span className="label">Sleep Schedule</span>{match.lifestyle.sleepSchedule}</div></div>
          <div className="compat-item"><Star size={16} color="var(--color-text-secondary)" /><div><span className="label">Cleanliness</span>{match.lifestyle.cleanliness}</div></div>
          <div className="compat-item"><UsersIcon size={16} color="var(--color-text-secondary)" /><div><span className="label">Study Habits</span>{match.lifestyle.studyHabits}</div></div>
          <div className="compat-item"><UsersIcon size={16} color="var(--color-text-secondary)" /><div><span className="label">Guest Policy</span>{match.lifestyle.guestPolicy}</div></div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>Interests &amp; Hobbies</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {match.interests.map((i) => <span key={i} className="badge badge-info">{i}</span>)}
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>Current Listing</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{match.currentListing.title}</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{match.currentListing.location} • RM {match.currentListing.price}/month</div>
          </div>
          <Link to="/listings/1" className="btn btn-secondary">View Listing</Link>
        </div>
      </div>
    </div>
  );
}
