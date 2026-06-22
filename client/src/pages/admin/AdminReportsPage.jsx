import { Link } from 'react-router-dom';
import './AdminPages.css';

const summary = [
  { label: 'Total Reports', value: 15, sub: 'All time' },
  { label: 'Pending', value: 8, sub: 'Requires attention', type: 'warn' },
  { label: 'In Review', value: 3, sub: 'Being processed' },
  { label: 'Resolved', value: 4, sub: 'This month', type: 'up' },
];

const reports = [
  { id: 'RPT-001', type: 'Listing', reported: 'Fake listing in Skudai', reason: 'Misleading information', reporter: 'Ahmad Razak', priority: 'High', status: 'New', created: '2024-05-30' },
  { id: 'RPT-002', type: 'User', reported: 'Muhammad Ali', reason: 'Inappropriate behavior', reporter: 'Siti Nurhaliza', priority: 'Medium', status: 'In Review', created: '2024-05-29' },
  { id: 'RPT-003', type: 'Listing', reported: 'Room in Taman University', reason: 'Incorrect pricing', reporter: 'Farah Liyana', priority: 'Low', status: 'New', created: '2024-05-28' },
];

const statusBadge = { New: 'badge-pending', 'In Review': 'badge-info', Resolved: 'badge-active' };

export default function AdminReportsPage() {
  return (
    <div className="page-wrapper">
      <div className="admin-page-header">
        <h1>Reports Management</h1>
        <p>Review and manage user-submitted reports</p>
      </div>

      <div className="admin-stats-grid">
        {summary.map((s) => (
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
              <tr><th>Report ID</th><th>Type</th><th>Reported Item</th><th>Reason</th><th>Priority</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.type}</td>
                  <td>{r.reported}</td>
                  <td>{r.reason}</td>
                  <td>{r.priority}</td>
                  <td><span className={`badge ${statusBadge[r.status]}`}>{r.status}</span></td>
                  <td><Link to={`/admin/reports/${r.id}`} className="link-action">View Details</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-pagination">
          <span>Showing 1-{reports.length} of 15 reports</span>
          <div className="pages">
            <button>Previous</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
