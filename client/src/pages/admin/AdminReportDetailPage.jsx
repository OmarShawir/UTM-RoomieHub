import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './AdminPages.css';

export default function AdminReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [actionTaken, setActionTaken] = useState(false);

  const report = {
    id: id || 'RPT-001',
    type: 'Listing',
    reported: 'Fake listing in Skudai',
    reason: 'Misleading information',
    description: 'The listing claims to be a private room but photos show it is actually a shared dormitory space. Price also does not match what was discussed in chat.',
    reporter: { name: 'Ahmad Razak', email: 'ahmad@graduate.utm.my' },
    reportedUser: { name: 'Unknown Lister', email: 'lister@graduate.utm.my' },
    status: 'New',
    priority: 'High',
    created: '2024-05-30 14:23',
  };

  return (
    <div className="page-wrapper">
      <div className="admin-page-header">
        <h1>Report Details — {report.id}</h1>
        <p>Submitted on {report.created}</p>
      </div>

      <div className="report-detail-grid">
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Report Information</h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Type</p>
            <p style={{ marginBottom: 10 }}>{report.type}</p>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Reported Item</p>
            <p style={{ marginBottom: 10 }}>{report.reported}</p>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Reason</p>
            <p style={{ marginBottom: 10 }}>{report.reason}</p>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Description</p>
            <p>{report.description}</p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>People Involved</h3>
            <div className="user-target-card">
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                {report.reporter.name.charAt(0)}
              </div>
              <div><div className="name">{report.reporter.name}</div><div className="sub">Reporter • {report.reporter.email}</div></div>
            </div>
            <div className="user-target-card">
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-error)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                {report.reportedUser.name.charAt(0)}
              </div>
              <div><div className="name">{report.reportedUser.name}</div><div className="sub">Reported • {report.reportedUser.email}</div></div>
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Status</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <span className="badge badge-pending">{report.status}</span>
              <span className="badge badge-suspended">{report.priority} Priority</span>
            </div>

            {actionTaken && <div className="success-box">Action recorded successfully.</div>}

            <button className="btn btn-danger" style={{ width: '100%', marginBottom: 10 }} onClick={() => setActionTaken(true)}>
              Suspend Reported User
            </button>
            <button className="btn btn-secondary" style={{ width: '100%', marginBottom: 10 }} onClick={() => setActionTaken(true)}>
              Remove Listing
            </button>
            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => setActionTaken(true)}>
              Dismiss Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
