import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import api from '../../services/api';
import '../admin/AdminPages.css';

export default function AnalyticsOverviewPage() {
  const [stats, setStats] = useState({
    total_users: 0,
    active_listings: 0,
    pending_reports: 0,
    avg_price: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Failed to load analytics overview:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading platform analytics...</div>;
  }

  return (
    <div className="page-wrapper">
      <div className="admin-page-header">
        <h1>Platform Analytics</h1>
        <p>Overview of platform performance and trends</p>
      </div>

      <div className="admin-stats-grid">
        <div className="card admin-stat-card">
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{stats.total_users}</div>
          <div className="stat-delta up">Registered students</div>
        </div>
        <div className="card admin-stat-card">
          <div className="stat-label">Active Listings</div>
          <div className="stat-value">{stats.active_listings}</div>
          <div className="stat-delta up">Live accommodations</div>
        </div>
        <div className="card admin-stat-card">
          <div className="stat-label">Avg. Room Price</div>
          <div className="stat-value">RM {stats.avg_price}</div>
          <div className="stat-delta up">Per month</div>
        </div>
        <div className="card admin-stat-card">
          <div className="stat-label">Pending Reports</div>
          <div className="stat-value">{stats.pending_reports}</div>
          <div className="stat-delta warn">Requires review</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Platform Activity Over Time (New Listings Created)</h3>
        {(!stats.trends || stats.trends.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--color-text-secondary)' }}>No platform activity trends data available.</div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, padding: '0 20px 10px 20px', borderBottom: '2px solid var(--color-border)' }}>
            {stats.trends.map((item, idx) => {
              const maxVal = Math.max(...stats.trends.map(t => t.count), 1);
              const heightPct = (item.count / maxVal) * 100;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--color-text-primary)' }}>{item.count}</span>
                  <div style={{
                    width: '45%',
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

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Link to="/admin/analytics/users" className="btn btn-secondary">User Activity Stats</Link>
        <Link to="/admin/analytics/listings" className="btn btn-secondary">Listing Trends</Link>
        <Link to="/admin/analytics/export" className="btn btn-primary">Export Report</Link>
      </div>
    </div>
  );
}
