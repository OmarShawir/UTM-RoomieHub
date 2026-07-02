import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import { DEFAULT_AVATAR } from '../../utils/defaults';
import './AdminPages.css';

export default function SuspendUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [duration, setDuration] = useState('7');
  const [reason, setReason] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/admin/users?keyword=`);
        // Find this specific user from the users list
        if (res.data.success) {
          const found = res.data.users.find((u) => String(u.id) === String(id));
          setUser(found || null);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    try {
      setSubmitting(true);
      await api.put(`/admin/users/${id}/suspend`, { reason });
      navigate('/admin/users');
    } catch (err) {
      console.error('Failed to suspend user:', err);
      alert('Failed to suspend user. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading...</div>;
  if (!user) return <div className="page-wrapper"><p>User not found.</p></div>;

  return (
    <div className="page-wrapper" style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>Suspend User Account</h1>

      <div className="warning-box">
        <AlertTriangle size={18} style={{ flexShrink: 0 }} />
        Warning: This will suspend the user's account
      </div>

      <div className="card">
        <div className="user-target-card">
          <img
            src={user.profile_picture || DEFAULT_AVATAR}
            alt={user.full_name}
            onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
          />
          <div>
            <div className="name">{user.full_name}</div>
            <div className="sub">{user.matric_no} • {user.email}</div>
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
            <button type="submit" className="btn btn-danger" style={{ flex: 1 }} disabled={submitting}>
              {submitting ? 'Suspending...' : 'Suspend Account'}
            </button>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/admin/users')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
