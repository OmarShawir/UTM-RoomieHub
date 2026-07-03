import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './AdminPages.css';

const statusBadge = {
  pending: 'badge-pending',
  reviewed: 'badge-info',
  resolved: 'badge-active',
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState({ total: 0, pending: 0, reviewed: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/admin/reports');
        if (res.data.success) {
          setReports(res.data.reports || []);
          if (res.data.summary) {
            setSummary(res.data.summary);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch reports list.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading reports...</div>;
  }

  if (error) {
    return <div className="page-wrapper" style={{ background: '#fef2f2', color: '#991b1b', padding: '12px 16px', borderRadius: 8, fontSize: 14 }}>{error}</div>;
  }

  const summaryCards = [
    { label: 'Total Reports', value: summary.total, sub: 'All time' },
    { label: 'Pending', value: summary.pending, sub: 'Requires attention', type: summary.pending > 0 ? 'warn' : '' },
    { label: 'In Review', value: summary.reviewed, sub: 'Being processed' },
    { label: 'Resolved', value: summary.resolved, sub: 'Closed cases', type: 'up' },
  ];

  return (
    <div className="page-wrapper">
      <div className="admin-page-header">
        <h1>Reports Management</h1>
        <p>Review and manage user-submitted reports</p>
      </div>

      <div className="admin-stats-grid">
        {summaryCards.map((s) => (
          <div key={s.label} className="card admin-stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-delta ${s.type || ''}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="card admin-list-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Reporter</th>
                <th>Reported User</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '20px' }}>
                    No reports found.
                  </td>
                </tr>
              ) : (
                reports.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>RPT-{String(r.id).padStart(3, '0')}</td>
                    <td>{r.reporter_name}</td>
                    <td>{r.reported_name}</td>
                    <td>{r.reason}</td>
                    <td>
                      <span className={`badge ${statusBadge[r.status] || 'badge-pending'}`}>
                        {r.status === 'pending' ? 'New' : r.status}
                      </span>
                    </td>
                    <td>{r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <Link to={`/admin/reports/${r.id}`} className="link-action">View Details</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
