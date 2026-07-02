import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import './AdminPages.css';

export default function AdminReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/admin/reports/${id}`);
      if (res.data.success) {
        setReport(res.data.report);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch report details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      const res = await api.put(`/admin/reports/${id}`, { status: newStatus });
      if (res.data.success) {
        setMessage(`Status updated to ${newStatus} successfully.`);
        fetchReport();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading report details...</div>;
  }

  if (error || !report) {
    return (
      <div className="page-wrapper">
        <div style={{ background: '#fef2f2', color: '#991b1b', padding: '12px 16px', borderRadius: 8, fontSize: 14 }}>
          {error || 'Report not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="admin-page-header">
        <h1>Report Details — RPT-{String(report.id).padStart(3, '0')}</h1>
        <p>Submitted on {new Date(report.created_at).toLocaleString()}</p>
      </div>

      <div className="report-detail-grid">
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Report Information</h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Reason</p>
            <p style={{ marginBottom: 10, fontWeight: 500 }}>{report.reason}</p>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Description</p>
            <p style={{ lineHeight: 1.5 }}>{report.description || 'No additional description provided.'}</p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>People Involved</h3>
            <div className="user-target-card" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                {report.reporter_name?.charAt(0) || 'R'}
              </div>
              <div>
                <div className="name" style={{ fontWeight: 600 }}>{report.reporter_name}</div>
                <div className="sub" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Reporter</div>
              </div>
            </div>
            <div className="user-target-card" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-error)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                {report.reported_name?.charAt(0) || 'T'}
              </div>
              <div>
                <div className="name" style={{ fontWeight: 600 }}>{report.reported_name}</div>
                <div className="sub" style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Reported User</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Manage Report</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <span className="badge badge-pending">{report.status}</span>
            </div>

            {message && <div className="success-box" style={{ background: '#ecfdf5', color: '#065f46', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{message}</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {report.status !== 'reviewed' && (
                <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => updateStatus('reviewed')}>
                  Mark as In Review
                </button>
              )}
              {report.status !== 'resolved' && (
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => updateStatus('resolved')}>
                  Mark as Resolved
                </button>
              )}
              {report.status !== 'pending' && (
                <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => updateStatus('pending')}>
                  Reopen Report (Pending)
                </button>
              )}
              <button className="btn btn-danger" style={{ width: '100%' }} onClick={() => navigate(`/admin/suspend/${report.reported_user_id}`)}>
                Suspend Reported User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
