import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import api from '../../services/api';
import '../admin/AdminPages.css';

export default function ListingTrendsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailedAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics/detailed');
        if (res.data.success) {
          setData(res.data.data.listings);
        }
      } catch (err) {
        console.error('Error fetching listing trends analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetailedAnalytics();
  }, []);

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading listing trends...</div>;
  }

  if (!data) {
    return (
      <div className="page-wrapper">
        <div style={{ background: '#fef2f2', color: '#991b1b', padding: '12px 16px', borderRadius: 8, fontSize: 14 }}>
          Failed to load listing trends data.
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
        <h1>Listing Trends</h1>
        <p>Analysis of listing performance and market trends</p>
      </div>

      <div className="admin-stats-grid">
        <div className="card admin-stat-card">
          <div className="stat-label">Total Listings</div>
          <div className="stat-value">{data.total}</div>
          <div className="stat-delta up">Live rooms</div>
        </div>
        <div className="card admin-stat-card">
          <div className="stat-label">Avg. Price</div>
          <div className="stat-value">RM {data.avg_price}</div>
          <div className="stat-delta up">Per month</div>
        </div>
        <div className="card admin-stat-card">
          <div className="stat-label">Avg. Views/Listing</div>
          <div className="stat-value">{data.avg_views}</div>
          <div className="stat-delta up">Views count</div>
        </div>
        <div className="card admin-stat-card">
          <div className="stat-label">Engagement Level</div>
          <div className="stat-value">Active</div>
          <div className="stat-delta up">Live updates</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Listing Activity Over Time (New Listings Created)</h3>
        {(!data.trends || data.trends.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--color-text-secondary)' }}>No listing activity trends data available.</div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, padding: '0 20px 10px 20px', borderBottom: '2px solid var(--color-border)' }}>
            {data.trends.map((item, idx) => {
              const maxVal = Math.max(...data.trends.map(t => t.count), 1);
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Listings by Type</h3>
          {data.byType.length === 0 ? (
            <div style={{ color: 'var(--color-text-secondary)' }}>No active listings.</div>
          ) : (
            data.byType.map((t) => (
              <div key={t.name} className="progress-bar-row">
                <div className="top-line"><span>{t.name}</span><span>{t.count} ({t.pct}%)</span></div>
                <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${t.pct}%` }} /></div>
              </div>
            ))
          )}
        </div>
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Popular Locations</h3>
          {data.byLocation.length === 0 ? (
            <div style={{ color: 'var(--color-text-secondary)' }}>No active listings.</div>
          ) : (
            data.byLocation.map((l) => (
              <div key={l.name} className="progress-bar-row">
                <div className="top-line"><span>{l.name}</span><span>{l.count} ({l.pct}%)</span></div>
                <div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: `${l.pct}%` }} /></div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card admin-list-card">
        <div className="admin-list-header"><h3>Top Performing Listings</h3></div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Listing</th>
                <th>Views</th>
                <th>Wishlists</th>
                <th>Conversations Opened</th>
                <th>Conversion Score</th>
              </tr>
            </thead>
            <tbody>
              {data.topListings.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '20px' }}>
                    No listings found.
                  </td>
                </tr>
              ) : (
                data.topListings.map((l) => (
                  <tr key={l.title}>
                    <td style={{ fontWeight: 500 }}>{l.title}</td>
                    <td>{l.views}</td>
                    <td>{l.wishlists}</td>
                    <td>{l.messages}</td>
                    <td><span className="badge badge-active">{l.conversion}</span></td>
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
