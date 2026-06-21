import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import '../admin/AdminPages.css';

export default function AnalyticsOverviewPage() {
  return (
    <div className="page-wrapper">
      <div className="admin-page-header">
        <h1>Platform Analytics</h1>
        <p>Overview of platform performance and trends</p>
      </div>

      <div className="admin-stats-grid">
        <div className="card admin-stat-card">
          <div className="stat-label">Daily Active Users</div>
          <div className="stat-value">437</div>
          <div className="stat-delta up">35% of total users</div>
        </div>
        <div className="card admin-stat-card">
          <div className="stat-label">Total Listings</div>
          <div className="stat-value">342</div>
          <div className="stat-delta up">+8% this month</div>
        </div>
        <div className="card admin-stat-card">
          <div className="stat-label">Avg. Session</div>
          <div className="stat-value">12m</div>
          <div className="stat-delta up">+2m from last week</div>
        </div>
        <div className="card admin-stat-card">
          <div className="stat-label">Conversion Rate</div>
          <div className="stat-value">23%</div>
          <div className="stat-delta up">+2% from last month</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Platform Activity Over Time</h3>
        <div className="chart-placeholder"><BarChart3 size={32} style={{ marginRight: 10 }} /> Line chart: activity trends</div>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Link to="/admin/analytics/users" className="btn btn-secondary">User Activity Stats</Link>
        <Link to="/admin/analytics/listings" className="btn btn-secondary">Listing Trends</Link>
        <Link to="/admin/analytics/export" className="btn btn-primary">Export Report</Link>
      </div>
    </div>
  );
}
