import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../listings/ListingPages.css';
import '../chat/ChatPages.css';

export default function LifestyleProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    sleepSchedule: 'normal',
    cleanliness: '',
    socialPreference: 'balanced',
    smoking: 'non-smoker',
  });

  const setField = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/ai-match/roommates');
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 6 }}>Lifestyle Profile</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>Help us find your perfect roommate match</p>

      <form onSubmit={handleSubmit}>
        <div className="card preference-section">
          <h4>Sleep Schedule</h4>
          <div className="option-group">
            {[
              { value: 'early', label: 'Early Bird (sleep before 10 PM)' },
              { value: 'normal', label: 'Normal (10 PM – 12 AM)' },
              { value: 'night', label: 'Night Owl (after 12 AM)' },
            ].map((opt) => (
              <label key={opt.value} className="option-radio">
                <input type="radio" name="sleepSchedule" checked={form.sleepSchedule === opt.value} onChange={() => setField('sleepSchedule', opt.value)} />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className="card preference-section">
          <h4>Cleanliness</h4>
          <select value={form.cleanliness} onChange={(e) => setField('cleanliness', e.target.value)}>
            <option value="">Select level</option>
            <option value="very-clean">Very Clean</option>
            <option value="moderate">Moderate</option>
            <option value="relaxed">Relaxed</option>
          </select>
        </div>

        <div className="card preference-section">
          <h4>Social Preference</h4>
          <div className="option-group">
            {[
              { value: 'social', label: 'Social & Outgoing' },
              { value: 'balanced', label: 'Balanced' },
              { value: 'quiet', label: 'Quiet & Private' },
            ].map((opt) => (
              <label key={opt.value} className="option-radio">
                <input type="radio" name="social" checked={form.socialPreference === opt.value} onChange={() => setField('socialPreference', opt.value)} />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className="card preference-section">
          <h4>Smoking</h4>
          <div className="option-group">
            {[
              { value: 'smoker', label: 'Smoker' },
              { value: 'non-smoker', label: 'Non-smoker' },
            ].map((opt) => (
              <label key={opt.value} className="option-radio">
                <input type="radio" name="smoking" checked={form.smoking === opt.value} onChange={() => setField('smoking', opt.value)} />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Find Roommate Matches</button>
      </form>
    </div>
  );
}
