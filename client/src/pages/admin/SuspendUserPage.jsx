import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import './AdminPages.css';

export default function SuspendUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [duration, setDuration] = useState('7');
  const [reason, setReason] = useState('');

  const user = {
    name: 'Ahmad Zaki bin Abdullah',
    matric: 'A21EC0123',
    email: 'ahmad.zaki@graduate.utm.my',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/admin/users');
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>Suspend User Account</h1>

      <div className="warning-box">
        <AlertTriangle size={18} style={{ flexShrink: 0 }} />
        Warning: This will suspend the user's account
      </div>

      <div className="card">
        <div className="user-target-card">
          <img src={user.avatar} alt={user.name} />
          <div>
            <div className="name">{user.name}</div>
            <div className="sub">{user.matric} • {user.email}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Suspension Duration</label>
            <select value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="permanent">Permanent</option>
            </select>
          </div>

          <div className="form-group">
            <label>Reason for Suspension</label>
            <textarea rows={4} placeholder="Provide a detailed reason for suspending this account..." value={reason} onChange={(e) => setReason(e.target.value)} required />
          </div>

          <div className="info-bullet-list">
            <div>During suspension:</div>
            <div>• User cannot log in to their account</div>
            <div>• All active listings will be hidden</div>
            <div>• User will receive an email notification</div>
            <div>• Messages and data will be preserved</div>
          </div>

          <div className="listing-form-actions" style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-danger" style={{ flex: 1 }}>Suspend Account</button>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/admin/users')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
