import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { DEFAULT_AVATAR } from '../../utils/defaults';
import './AdminPages.css';

export default function ReinstateUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/admin/users?keyword=`);
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
    try {
      setSubmitting(true);
      await api.put(`/admin/users/${id}/reinstate`, { reason: notes || 'Reinstated by admin' });
      navigate('/admin/users');
    } catch (err) {
      console.error('Failed to reinstate user:', err);
      alert('Failed to reinstate user. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading...</div>;
  if (!user) return <div className="page-wrapper"><p>User not found.</p></div>;

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
          <span className="badge badge-suspended">Suspended</span>
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
            <button type="submit" className="btn btn-success" style={{ flex: 1 }} disabled={submitting}>
              {submitting ? 'Reinstating...' : 'Reinstate Account'}
            </button>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/admin/users')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
