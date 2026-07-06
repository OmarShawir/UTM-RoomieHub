import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './AdminPages.css';

export default function AdminDashboardPage() {
  const [data, setData] = useState({
    stats: {
      total_users: 0,
      active_listings: 0,
      pending_reports: 0,
      avg_price: 0,
    },
    activity: [],
    pendingReports: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/admin/analytics');
        if (res.data.success) {
          setData({
            stats: res.data.stats,
            activity: res.data.activity || [],
            pendingReports: res.data.pendingReports || [],
          });
        }
      } catch (err) {
        console.error('Error loading admin analytics:', err);
        setError('Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const formatActivityTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading dashboard analytics...</div>;
  }

  if (error) {
    return <div className="page-wrapper" style={{ background: '#fef2f2', color: '#991b1b', padding: '12px 16px', borderRadius: 8, fontSize: 14 }}>{error}</div>;
  }

  const statCards = [
    { label: 'Total Users', value: data.stats.total_users, delta: 'Registered students', type: 'up' },
    { label: 'Active Listings', value: data.stats.active_listings, delta: 'Live room listings', type: 'up' },
    { label: 'Pending Reports', value: data.stats.pending_reports, delta: 'Requires review', type: data.stats.pending_reports > 0 ? 'warn' : 'up' },
    { label: 'Avg. Room Price', value: `RM ${data.stats.avg_price}`, delta: 'Per month', type: 'up' },
  ];

  return (
    <div className="page-wrapper">
      <div className="admin-page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of platform metrics and activity</p>
      </div>

      <div className="admin-stats-grid">
        {statCards.map((s) => (
          <div key={s.label} className="card admin-stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-delta ${s.type}`}>{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="card admin-list-card" style={{ marginBottom: 20 }}>
        <div className="admin-list-header"><h3>Recent Activity</h3></div>
        {data.activity.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--color-text-secondary)' }}>No recent activity.</div>
        ) : (
          data.activity.map((a, idx) => (
            <div key={idx} className="admin-list-row">
              <div>
                <div className="name">{a.user}</div>
                <div className="sub">{a.action}</div>
              </div>
              <div className="time">{formatActivityTime(a.time)}</div>
            </div>
          ))
        )}
      </div>

      <div className="card admin-list-card">
        <div className="admin-list-header">
          <h3>Pending Reports</h3>
          <Link to="/admin/reports" className="auth-link">View All</Link>
        </div>
        {data.pendingReports.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--color-text-secondary)' }}>No pending reports.</div>
        ) : (
          data.pendingReports.map((r) => (
            <div key={r.id} className="admin-list-row">
              <div>
                <div className="name">RPT-{String(r.id).padStart(3, '0')}</div>
                <div className="sub">Reported: {r.reported_name} • Reason: {r.reason}</div>
              </div>
              <span className={`badge ${r.status === 'pending' ? 'badge-pending' : 'badge-info'}`}>
                {r.status === 'pending' ? 'New' : r.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
