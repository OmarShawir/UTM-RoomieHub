import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import '../admin/AdminPages.css';

const reportTypes = [
  { key: 'overview', title: 'Platform Overview', desc: 'Comprehensive analytics including users, listings, and engagement metrics' },
  { key: 'users', title: 'User Statistics', desc: 'Detailed user activity, demographics, and engagement data' },
  { key: 'listings', title: 'Listing Analytics', desc: 'Performance metrics for all listings including views and conversions' },
  { key: 'matching', title: 'Matching & Chat', desc: 'Roommate matching success rates and messaging activity' },
];

const formats = [
  { key: 'pdf', title: 'PDF Report', desc: 'Formatted document' },
  { key: 'xlsx', title: 'Excel (XLSX)', desc: 'Spreadsheet data' },
  { key: 'csv', title: 'CSV', desc: 'Raw data export' },
];

const recentExports = [
  { name: 'Platform Overview - May 2026', meta: 'PDF • 2.4 MB • Generated on 2026-05-30' },
  { name: 'User Statistics - Q1 2026', meta: 'XLSX • 1.8 MB • Generated on 2026-04-15' },
];

export default function ExportReportPage() {
  const [reportType, setReportType] = useState('overview');
  const [format, setFormat] = useState('pdf');
  const [range, setRange] = useState('30');

  return (
    <div className="page-wrapper" style={{ maxWidth: 760 }}>
      <Link to="/admin/analytics" className="auth-back-link" style={{ color: 'var(--color-primary)', marginBottom: 14, display: 'inline-flex' }}>
        <ArrowLeft size={16} /> Back to Platform Analytics
      </Link>

      <div className="admin-page-header">
        <h1>Export Analytics Report</h1>
        <p>Generate and download custom analytics reports</p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Select Report Type</h3>
        <div className="export-type-grid">
          {reportTypes.map((r) => (
            <div key={r.key} className={`export-option-card ${reportType === r.key ? 'selected' : ''}`} onClick={() => setReportType(r.key)}>
              <div className="title">{r.title}</div>
              <div className="desc">{r.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Select Date Range</h3>
        <div className="form-row-2">
          <div className="form-group"><label>Start Date</label><input type="date" /></div>
          <div className="form-group"><label>End Date</label><input type="date" /></div>
        </div>
        <div className="quick-range-row">
          {['7', '30', '90', '365'].map((r) => (
            <button key={r} type="button" className={range === r ? 'active' : ''} onClick={() => setRange(r)}>
              {r === '365' ? 'This year' : `Last ${r} days`}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Export Format</h3>
        <div className="export-type-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {formats.map((f) => (
            <div key={f.key} className={`export-option-card ${format === f.key ? 'selected' : ''}`} onClick={() => setFormat(f.key)}>
              <div className="title">{f.title}</div>
              <div className="desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Additional Options</h3>
        <div className="checkbox-list">
          <label><input type="checkbox" defaultChecked /> Include charts and visualizations</label>
          <label><input type="checkbox" defaultChecked /> Include summary statistics</label>
          <label><input type="checkbox" /> Include detailed breakdowns</label>
          <label><input type="checkbox" /> Email report when ready</label>
        </div>
      </div>

      <button className="btn btn-primary" style={{ width: '100%', marginBottom: 24 }}>
        <Download size={16} /> Generate &amp; Download Report
      </button>

      <div className="card admin-list-card">
        <div className="admin-list-header"><h3>Recent Exports</h3></div>
        {recentExports.map((e) => (
          <div key={e.name} className="admin-list-row">
            <div><div className="name">{e.name}</div><div className="sub">{e.meta}</div></div>
            <button className="link-action">Download</button>
          </div>
        ))}
      </div>
    </div>
  );
}
