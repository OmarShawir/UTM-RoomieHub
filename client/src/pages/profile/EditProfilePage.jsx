import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './ProfilePages.css';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: 'Ahmad Zaki bin Abdullah',
    phone: '+60 12-345 6789',
    faculty: 'Faculty of Computing',
    program: 'Bachelor of Computer Science (Software Engineering)',
    year: 'Year 3',
    bio: 'Looking for a quiet roommate near UTM campus. Non-smoker, prefer shared kitchen facilities.',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => navigate('/profile'), 600);
  };

  return (
    <div className="page-wrapper profile-form-section">
      <div className="profile-page-header">
        <button className="btn btn-secondary" onClick={() => navigate('/profile')} style={{ padding: '8px 10px' }}>
          <ArrowLeft size={16} />
        </button>
        <h1>Edit Personal Details</h1>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 20 }}>Personal Information</h3>

        {saved && <div className="auth-success">Profile updated successfully</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
          </div>

          <div className="form-group">
            <label>Faculty</label>
            <input value={form.faculty} onChange={(e) => handleChange('faculty', e.target.value)} />
          </div>

          <div className="form-group">
            <label>Program</label>
            <input value={form.program} onChange={(e) => handleChange('program', e.target.value)} />
          </div>

          <div className="form-group">
            <label>Year of Study</label>
            <input value={form.year} onChange={(e) => handleChange('year', e.target.value)} />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              rows={4}
              maxLength={500}
              placeholder="Tell others about yourself..."
              value={form.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
            />
            <div className="char-count">{form.bio.length}/500 characters</div>
          </div>

          <div className="profile-form-actions">
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/profile')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}