import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../listings/ListingPages.css';
import '../chat/ChatPages.css';

export default function LifestyleProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    sleep_schedule: 'normal',
    study_habit: 'flexible',
    cleanliness_level: 'moderate',
    social_preference: 'balanced',
    noise_tolerance: 'medium',
    gender_preference: 'any',
    has_pets: false,
    is_smoker: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get('/matching/roommate/profile');
        if (res.data.success && res.data.profile) {
          const p = res.data.profile;
          setForm({
            sleep_schedule: p.sleep_schedule || 'normal',
            study_habit: p.study_habit || 'flexible',
            cleanliness_level: p.cleanliness_level || 'moderate',
            social_preference: p.social_preference || 'balanced',
            noise_tolerance: p.noise_tolerance || 'medium',
            gender_preference: p.gender_preference || 'any',
            has_pets: !!p.has_pets,
            is_smoker: !!p.is_smoker,
          });
        }
      } catch (err) {
        console.error('Failed to load lifestyle profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const setField = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/matching/roommate/profile', form);
      if (res.data.success) {
        navigate('/ai-match/roommates');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save lifestyle profile.');
    }
  };

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading lifestyle profile...</div>;
  }

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
                <input type="radio" name="sleep_schedule" checked={form.sleep_schedule === opt.value} onChange={() => setField('sleep_schedule', opt.value)} />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className="card preference-section">
          <h4>Cleanliness</h4>
          <select value={form.cleanliness_level} onChange={(e) => setField('cleanliness_level', e.target.value)}>
            <option value="very-clean">Very Clean</option>
            <option value="moderate">Moderate</option>
            <option value="relaxed">Relaxed</option>
          </select>
        </div>

        <div className="card preference-section">
          <h4>Study Habit</h4>
          <select value={form.study_habit} onChange={(e) => setField('study_habit', e.target.value)}>
            <option value="quiet">Quiet & Alone</option>
            <option value="group">Group Study</option>
            <option value="flexible">Flexible / Library</option>
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
                <input type="radio" name="social_preference" checked={form.social_preference === opt.value} onChange={() => setField('social_preference', opt.value)} />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className="card preference-section">
          <h4>Smoking Preference</h4>
          <div className="option-group">
            <label className="option-radio">
              <input type="radio" name="is_smoker" checked={form.is_smoker === true} onChange={() => setField('is_smoker', true)} />
              Smoker
            </label>
            <label className="option-radio">
              <input type="radio" name="is_smoker" checked={form.is_smoker === false} onChange={() => setField('is_smoker', false)} />
              Non-smoker
            </label>
          </div>
        </div>

        <div className="card preference-section">
          <h4>Has Pets</h4>
          <div className="option-group">
            <label className="option-radio">
              <input type="radio" name="has_pets" checked={form.has_pets === true} onChange={() => setField('has_pets', true)} />
              Yes
            </label>
            <label className="option-radio">
              <input type="radio" name="has_pets" checked={form.has_pets === false} onChange={() => setField('has_pets', false)} />
              No
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 20 }}>Find Roommate Matches</button>
      </form>
    </div>
  );
}
