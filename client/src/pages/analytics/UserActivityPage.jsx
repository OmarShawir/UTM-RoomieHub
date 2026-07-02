import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import api from '../../services/api';
import '../admin/AdminPages.css';

export default function UserActivityPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailedAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics/detailed');
        if (res.data.success) {
          setData(res.data.data.users);
        }
      } catch (err) {
        console.error('Error fetching user activity analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetailedAnalytics();
  }, []);

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading user activity analytics...</div>;
  }

  if (!data) {
    return (
      <div className="page-wrapper">
        <div style={{ background: '#fef2f2', color: '#991b1b', padding: '12px 16px', borderRadius: 8, fontSize: 14 }}>
          Failed to load user activity data.
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Link to="/admin/analytics" className="auth-back-link" style={{ color: 'var(--color-primary)', marginBottom: 14, display: 'inline-flex' }}>
        <ArrowLeft size={16} /> Back to Platform Analytics
      </Link>

      <div className="admin-page-header">
        <h1>User Activity Statistics</h1>
        <p>Detailed analysis of user engagement and behavior</p>
      </div>

      <div className="admin-stats-grid">
        <div className="card admin-stat-card">
          <div className="stat-label">Daily Active Users</div>
          <div className="stat-value">{data.dau}</div>
          <div className="stat-delta">{data.total > 0 ? `${Math.round((data.dau / data.total) * 100)}%` : '0%'} of total users</div>
        </div>
        <div className="card admin-stat-card">
          <div className="stat-label">Weekly Active Users</div>
          <div className="stat-value">{data.wau}</div>
          <div className="stat-delta">{data.total > 0 ? `${Math.round((data.wau / data.total) * 100)}%` : '0%'} of total users</div>
        </div>
        <div className="card admin-stat-card">
          <div className="stat-label">Avg. Session Duration</div>
          <div className="stat-value">{data.avg_session}</div>
          <div className="stat-delta up">Stable average</div>
        </div>
        <div className="card admin-stat-card">
          <div className="stat-label">Avg. Sessions/User</div>
          <div className="stat-value">{data.sessions_per_user}</div>
          <div className="stat-delta up">Active interaction</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>User Registrations Over Time (Last 6 Months)</h3>
        {(!data.registrations || data.registrations.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--color-text-secondary)' }}>No registration trends data available.</div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, padding: '0 20px 10px 20px', borderBottom: '2px solid var(--color-border)' }}>
            {data.registrations.map((item, idx) => {
              const maxVal = Math.max(...data.registrations.map(r => r.count), 1);
              const heightPct = (item.count / maxVal) * 100;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--color-text-primary)' }}>{item.count}</span>
                  <div style={{
                    width: '40%',
                    height: `${Math.max(heightPct * 0.9, 8)}px`,
                    background: 'linear-gradient(180deg, var(--color-primary) 0%, rgba(123, 30, 30, 0.7) 100%)',
                    borderRadius: '6px 6px 0 0',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    transition: 'height 0.3s ease'
                  }} />
                  <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 8, fontWeight: 500 }}>{item.month}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>User Segments</h3>
        <div className="segment-table-row header"><div>Segment</div><div>Users</div><div>Percentage</div><div>Avg. Session</div><div>Engagement</div></div>
        {data.segments.map((s) => (
          <div key={s.name} className="segment-table-row">
            <div>{s.name}</div><div>{s.users}</div><div>{s.pct}</div><div>{s.session}</div>
            <div><span className="badge badge-info">{s.engagement}</span></div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Most Used Features</h3>
        {data.features.map((f) => (
          <div key={f.name} className="progress-bar-row">
            <div className="top-line"><span>{f.name}</span><span>{f.sessions} interactions</span></div>
            <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${Math.min(f.pct, 100)}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
