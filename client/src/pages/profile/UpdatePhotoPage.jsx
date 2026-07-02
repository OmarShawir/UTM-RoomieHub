import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { DEFAULT_AVATAR } from '../../utils/defaults';
import './ProfilePages.css';

export default function UpdatePhotoPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [preview, setPreview] = useState(user?.profile_picture || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [shouldRemove, setShouldRemove] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setShouldRemove(false);
      setError('');
    }
  };

  const handleRemovePhoto = () => {
    setPreview('');
    setSelectedFile(null);
    setShouldRemove(true);
    setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      if (selectedFile) {
        // Upload new photo
        const formData = new FormData();
        formData.append('avatar', selectedFile);

        const res = await api.post('/users/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (res.data.success) {
          setUser(res.data.user);
          navigate('/profile');
        }
      } else if (shouldRemove) {
        // Remove photo by calling user update profile endpoint
        const res = await api.put('/users/me', {
          full_name: user.full_name,
          display_name: user.display_name,
          faculty: user.faculty,
          year_of_study: user.year_of_study,
          nationality: user.nationality,
          bio: user.bio,
          profile_picture: null, // Clear profile photo
        });

        if (res.data.success) {
          setUser(res.data.user);
          navigate('/profile');
        }
      } else {
        // No change
        navigate('/profile');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile photo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper profile-form-section">
      <div className="profile-page-header">
        <button className="btn btn-secondary" onClick={() => navigate('/profile')} style={{ padding: '8px 10px' }} disabled={saving}>
          <ArrowLeft size={16} />
        </button>
        <h1>Update Profile Picture</h1>
      </div>

      <div className="card photo-upload-box">
        <h3 style={{ textAlign: 'left', marginBottom: 20 }}>Profile Photo</h3>

        {error && <div className="auth-error" style={{ marginBottom: 16, color: '#b91c1c', background: '#fef2f2', padding: 12, borderRadius: 6 }}>{error}</div>}

        <img
          src={preview || DEFAULT_AVATAR}
          onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
          alt="Preview"
          className="profile-avatar-lg"
          style={{ width: 150, height: 150, borderRadius: '50%', objectFit: 'cover', display: 'block', margin: '0 auto 20px auto' }}
        />
        <p className="photo-upload-hint">
          Recommended: Square image, at least 200×200 pixels.<br />Max file size: 5MB
        </p>

        <div className="photo-upload-actions" style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '20px 0' }}>
          <label className="btn btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Upload size={16} /> Upload New Photo
            <input type="file" accept="image/*" hidden onChange={handleFileChange} disabled={saving} />
          </label>
          {preview && (
            <button className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={handleRemovePhoto} disabled={saving}>
              <X size={16} /> Remove Photo
            </button>
          )}
        </div>

        <div className="profile-form-actions" style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/profile')} disabled={saving}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
