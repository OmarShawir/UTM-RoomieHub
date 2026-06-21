import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import '../admin/AdminPages.css';

const segments = [
  { name: 'Very Active', users: 312, pct: '25%', session: '18m', engagement: 'High' },
  { name: 'Active', users: 498, pct: '40%', session: '12m', engagement: 'Medium' },
  { name: 'Occasional', users: 312, pct: '25%', session: '7m', engagement: 'Low' },
  { name: 'Inactive', users: 125, pct: '10%', session: '2m', engagement: 'Very Low' },
];

const features = [
  { name: 'Search Listings', sessions: 3421, pct: 100 },
  { name: 'View Listing Details', sessions: 2934, pct: 86 },
  { name: 'Chat / Messaging', sessions: 2621, pct: 77 },
  { name: 'Profile Viewing', sessions: 2089, pct: 61 },
  { name: 'Wishlist Management', sessions: 1623, pct: 47 },
];

export default function UserActivityPage() {
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
        <div className="card admin-stat-card"><div className="stat-label">Daily Active Users</div><div className="stat-value">437</div><div className="stat-delta">35% of total users</div></div>
        <div className="card admin-stat-card"><div className="stat-label">Weekly Active Users</div><div className="stat-value">823</div><div className="stat-delta">66% of total users</div></div>
        <div className="card admin-stat-card"><div className="stat-label">Avg. Session Duration</div><div className="stat-value">12m</div><div className="stat-delta up">+2m from last week</div></div>
        <div className="card admin-stat-card"><div className="stat-label">Avg. Sessions/User</div><div className="stat-value">4.3</div><div className="stat-delta up">+0.5 from last week</div></div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>User Activity Over Time</h3>
        <div className="chart-placeholder"><BarChart3 size={28} style={{ marginRight: 10 }} /> Line chart: DAU/WAU/MAU trends</div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>User Segments</h3>
        <div className="segment-table-row header"><div>Segment</div><div>Users</div><div>Percentage</div><div>Avg. Session</div><div>Engagement</div></div>
        {segments.map((s) => (
          <div key={s.name} className="segment-table-row">
            <div>{s.name}</div><div>{s.users}</div><div>{s.pct}</div><div>{s.session}</div>
            <div><span className="badge badge-info">{s.engagement}</span></div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Most Used Features</h3>
        {features.map((f) => (
          <div key={f.name} className="progress-bar-row">
            <div className="top-line"><span>{f.name}</span><span>{f.sessions} sessions</span></div>
            <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${f.pct}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
