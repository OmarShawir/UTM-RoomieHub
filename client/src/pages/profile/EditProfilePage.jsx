import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './ProfilePages.css';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    fullName: '',
    displayName: '',
    faculty: '',
    yearOfStudy: '',
    nationality: '',
    bio: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  // Initialize form fields once user is loaded
  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.full_name || '',
        displayName: user.display_name || '',
        faculty: user.faculty || '',
        yearOfStudy: user.year_of_study || '',
        nationality: user.nationality || '',
        bio: user.bio || '',
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSaved(false);

    try {
      const res = await api.put('/users/me', {
        full_name: form.fullName,
        display_name: form.displayName,
        faculty: form.faculty,
        year_of_study: form.yearOfStudy ? parseInt(form.yearOfStudy, 10) : null,
        nationality: form.nationality,
        bio: form.bio,
      });

      if (res.data.success) {
        setUser(res.data.user);
        setSaved(true);
        setTimeout(() => navigate('/profile'), 1000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading profile details...</div>;
  }

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

        {saved && <div className="auth-success" style={{ marginBottom: 16 }}>Profile updated successfully</div>}
        {error && <div className="auth-error" style={{ marginBottom: 16, color: '#b91c1c', background: '#fef2f2', padding: 12, borderRadius: 6 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              required
              value={form.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Display Name</label>
            <input
              placeholder="Nickname"
              value={form.displayName}
              onChange={(e) => handleChange('displayName', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Faculty</label>
            <input
              placeholder="e.g. Faculty of Computing"
              value={form.faculty}
              onChange={(e) => handleChange('faculty', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Year of Study</label>
            <input
              type="number"
              min="1"
              max="6"
              placeholder="e.g. 3"
              value={form.yearOfStudy}
              onChange={(e) => handleChange('yearOfStudy', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Nationality</label>
            <input
              placeholder="e.g. Malaysian"
              value={form.nationality}
              onChange={(e) => handleChange('nationality', e.target.value)}
            />
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
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/profile')} disabled={submitting}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
