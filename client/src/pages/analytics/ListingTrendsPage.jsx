import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import '../admin/AdminPages.css';

const byType = [
  { name: 'Private Room', count: 156, pct: 46 },
  { name: 'Shared Room', count: 112, pct: 33 },
  { name: 'Studio Apartment', count: 52, pct: 15 },
  { name: 'Full Apartment', count: 22, pct: 6 },
];

const byLocation = [
  { name: 'Skudai', count: 87, pct: 25 },
  { name: 'Taman University', count: 69, pct: 20 },
  { name: 'Austin Heights', count: 52, pct: 15 },
  { name: 'Taman Molek', count: 45, pct: 13 },
  { name: 'Gelang Patah', count: 38, pct: 11 },
];

const topListings = [
  { title: 'Cozy Studio near UTM', views: 342, wishlists: 45, messages: 23, conversion: '32%' },
  { title: 'Modern Apartment in Skudai', views: 298, wishlists: 38, messages: 19, conversion: '28%' },
  { title: 'Shared Room - Taman U', views: 276, wishlists: 34, messages: 17, conversion: '25%' },
];

export default function ListingTrendsPage() {
  return (
    <div className="page-wrapper">
      <Link to="/admin/analytics" className="auth-back-link" style={{ color: 'var(--color-primary)', marginBottom: 14, display: 'inline-flex' }}>
        <ArrowLeft size={16} /> Back to Platform Analytics
      </Link>

      <div className="admin-page-header">
        <h1>Listing Trends</h1>
        <p>Analysis of listing performance and market trends</p>
      </div>

      <div className="admin-stats-grid">
        <div className="card admin-stat-card"><div className="stat-label">Total Listings</div><div className="stat-value">342</div><div className="stat-delta up">+8% this month</div></div>
        <div className="card admin-stat-card"><div className="stat-label">Avg. Price</div><div className="stat-value">RM 425</div><div className="stat-delta up">+RM15 from last month</div></div>
        <div className="card admin-stat-card"><div className="stat-label">Avg. Views/Listing</div><div className="stat-value">127</div><div className="stat-delta up">+12 from last month</div></div>
        <div className="card admin-stat-card"><div className="stat-label">Conversion Rate</div><div className="stat-value">23%</div><div className="stat-delta up">+2% from last month</div></div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>Listing Activity</h3>
        <div className="chart-placeholder"><BarChart3 size={28} style={{ marginRight: 10 }} /> Bar chart: new listings & conversions over time</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Listings by Type</h3>
          {byType.map((t) => (
            <div key={t.name} className="progress-bar-row">
              <div className="top-line"><span>{t.name}</span><span>{t.count} ({t.pct}%)</span></div>
              <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${t.pct}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Popular Locations</h3>
          {byLocation.map((l) => (
            <div key={l.name} className="progress-bar-row">
              <div className="top-line"><span>{l.name}</span><span>{l.count} ({l.pct}%)</span></div>
              <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${l.pct}%` }} /></div>
            </div>
          ))}
        </div>
      </div>

      <div className="card admin-list-card">
        <div className="admin-list-header"><h3>Top Performing Listings</h3></div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Listing</th><th>Views</th><th>Wishlists</th><th>Messages</th><th>Conversion</th></tr></thead>
            <tbody>
              {topListings.map((l) => (
                <tr key={l.title}>
                  <td>{l.title}</td><td>{l.views}</td><td>{l.wishlists}</td><td>{l.messages}</td>
                  <td><span className="badge badge-active">{l.conversion}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
