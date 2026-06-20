import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './ProfilePages.css';

export default function UpdatePhotoPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [preview, setPreview] = useState(
    user?.profile_picture || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'
  );

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    navigate('/profile');
  };

  return (
    <div className="page-wrapper profile-form-section">
      <div className="profile-page-header">
        <button className="btn btn-secondary" onClick={() => navigate('/profile')} style={{ padding: '8px 10px' }}>
          <ArrowLeft size={16} />
        </button>
        <h1>Update Profile Picture</h1>
      </div>

      <div className="card photo-upload-box">
        <h3 style={{ textAlign: 'left', marginBottom: 20 }}>Profile Photo</h3>

        <img src={preview} alt="Preview" className="profile-avatar-lg" />
        <p className="photo-upload-hint">
          Recommended: Square image, at least 200×200 pixels.<br />Max file size: 5MB
        </p>

        <div className="photo-upload-actions">
          <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
            <Upload size={16} /> Upload New Photo
            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
          </label>
          <button className="btn btn-secondary" onClick={() => setPreview('')}>
            <X size={16} /> Remove Photo
          </button>
        </div>

        <div className="profile-form-actions">
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Save Changes</button>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/profile')}>Cancel</button>
        </div>
      </div>
    </div>
  );
}