import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import './AdminPages.css';

export default function ReinstateUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');

  const user = {
    name: 'Ahmad Zaki bin Abdullah',
    matric: 'A21EC0123',
    email: 'ahmad.zaki@graduate.utm.my',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    suspendedOn: 'May 15, 2026',
    suspensionReason: 'Multiple reports of inappropriate behavior',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/admin/users');
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>Reinstate User Account</h1>

      <div className="success-box">
        <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
        Restore Account Access
      </div>

      <div className="card">
        <div className="user-target-card" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <img src={user.avatar} alt={user.name} />
            <div>
              <div className="name">{user.name}</div>
              <div className="sub">{user.matric} • {user.email}</div>
            </div>
          </div>
          <span className="badge badge-suspended">Suspended</span>
        </div>

        <div className="info-bullet-list">
          <div>Suspended On: {user.suspendedOn}</div>
          <div>Suspension Reason: {user.suspensionReason}</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Reinstatement Notes (Optional)</label>
            <textarea rows={4} placeholder="Add any notes about why this account is being reinstated..." value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="info-bullet-list" style={{ background: 'rgba(16,185,129,0.06)', color: '#065F46' }}>
            <div>After reinstatement:</div>
            <div>• User will regain full account access</div>
            <div>• All listings will be restored to active status</div>
            <div>• User will receive a welcome back email</div>
            <div>• Previous suspension record will be kept for reference</div>
          </div>

          <div className="listing-form-actions" style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-success" style={{ flex: 1 }}>Reinstate Account</button>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/admin/users')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
