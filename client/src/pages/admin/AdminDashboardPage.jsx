import { Link } from 'react-router-dom';
import './AdminPages.css';

const stats = [
  { label: 'Total Users', value: '1,247', delta: '+12% from last month', type: 'up' },
  { label: 'Active Listings', value: '342', delta: '+8% from last month', type: 'up' },
  { label: 'Pending Reports', value: '15', delta: 'Requires attention', type: 'warn' },
  { label: 'Success Rate', value: '87%', delta: '+3% from last month', type: 'up' },
];

const activity = [
  { user: 'Ahmad Razak', action: 'Created new listing', time: '2 minutes ago' },
  { user: 'Siti Nurhaliza', action: 'Registered new account', time: '15 minutes ago' },
  { user: 'Muhammad Ali', action: 'Submitted a report', time: '1 hour ago' },
  { user: 'Farah Liyana', action: 'Updated profile', time: '2 hours ago' },
  { user: 'Azmi Rahman', action: 'Posted a review', time: '3 hours ago' },
];

const pendingReports = [
  { id: 'RPT-001', type: 'Listing', reported: 'Fake listing', status: 'New' },
  { id: 'RPT-002', type: 'User', reported: 'Inappropriate behavior', status: 'In Review' },
  { id: 'RPT-003', type: 'Listing', reported: 'Incorrect information', status: 'New' },
];

export default function AdminDashboardPage() {
  return (
    <div className="page-wrapper">
      <div className="admin-page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of platform metrics and activity</p>
      </div>

      <div className="admin-stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="card admin-stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className={`stat-delta ${s.type}`}>{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="card admin-list-card" style={{ marginBottom: 20 }}>
        <div className="admin-list-header"><h3>Recent Activity</h3></div>
        {activity.map((a, idx) => (
          <div key={idx} className="admin-list-row">
            <div>
              <div className="name">{a.user}</div>
              <div className="sub">{a.action}</div>
            </div>
            <div className="time">{a.time}</div>
          </div>
        ))}
      </div>

      <div className="card admin-list-card">
        <div className="admin-list-header">
          <h3>Pending Reports</h3>
          <Link to="/admin/reports" className="auth-link">View All</Link>
        </div>
        {pendingReports.map((r) => (
          <div key={r.id} className="admin-list-row">
            <div>
              <div className="name">{r.id}</div>
              <div className="sub">{r.type}: {r.reported}</div>
            </div>
            <span className={`badge ${r.status === 'New' ? 'badge-pending' : 'badge-info'}`}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
