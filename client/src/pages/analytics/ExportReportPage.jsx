import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import api from '../../services/api';
import '../admin/AdminPages.css';

const reportTypes = [
  { key: 'overview', title: 'Platform Overview', desc: 'Comprehensive CSV analytics including listings and basic properties' },
  { key: 'users', title: 'User Statistics', desc: 'Detailed user list including emails, statuses, and registration dates' },
  { key: 'listings', title: 'Listing Analytics', desc: 'Full performance metrics for all accommodation listings' },
  { key: 'matching', title: 'Complaints & Reports', desc: 'Active complaints, reasons, and reporter associations' },
];

const formats = [
  { key: 'csv', title: 'CSV Report', desc: 'Comma Separated Values' },
];

export default function ExportReportPage() {
  const [reportType, setReportType] = useState('overview');
  const [format, setFormat] = useState('csv');
  const [range, setRange] = useState('30');
  const [exportsList, setExportsList] = useState([
    { name: 'Platform Overview - May 2026', meta: 'CSV • 2.4 KB • Generated on 2026-05-30' },
  ]);

  const handleExport = async () => {
    try {
      let endpoint = '';
      let filename = '';
      if (reportType === 'users') {
        endpoint = '/admin/users';
        filename = `users_report_${range}_days.csv`;
      } else if (reportType === 'listings' || reportType === 'overview') {
        endpoint = '/admin/listings';
        filename = `listings_report_${range}_days.csv`;
      } else {
        endpoint = '/admin/reports';
        filename = `reports_case_export_${range}_days.csv`;
      }

      const res = await api.get(endpoint, { params: { limit: 1000 } });
      let csvContent = "data:text/csv;charset=utf-8,";

      if (reportType === 'users' && res.data.users) {
        csvContent += "ID,Full Name,Matric No,Email,Status,Created At\n";
        res.data.users.forEach((u) => {
          csvContent += `"${u.id}","${u.full_name || ''}","${u.matric_no || ''}","${u.email}","${u.account_status || 'active'}","${u.created_at || ''}"\n`;
        });
      } else if (reportType === 'matching' && res.data.reports) {
        csvContent += "ID,Reporter Name,Reported User,Reason,Status,Created At\n";
        res.data.reports.forEach((r) => {
          csvContent += `"${r.id}","${r.reporter_name || ''}","${r.reported_name || ''}","${r.reason}","${r.status}","${r.created_at || ''}"\n`;
        });
      } else if (res.data.listings) {
        csvContent += "ID,Title,Price,Address,Status,Created At\n";
        res.data.listings.forEach((l) => {
          csvContent += `"${l.id}","${l.title.replace(/"/g, '""')}","${l.price}","${l.address.replace(/"/g, '""')}","${l.status}","${l.created_at || ''}"\n`;
        });
      }

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Add to recent exports local state
      setExportsList((prev) => [
        { name: `${filename}`, meta: `CSV • Generated on ${new Date().toLocaleDateString()}` },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
      alert('Failed to generate report.');
    }
  };

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
        <div className="export-type-grid" style={{ gridTemplateColumns: '1fr' }}>
          {formats.map((f) => (
            <div key={f.key} className={`export-option-card ${format === f.key ? 'selected' : ''}`} onClick={() => setFormat(f.key)}>
              <div className="title">{f.title}</div>
              <div className="desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary" style={{ width: '100%', marginBottom: 24 }} onClick={handleExport}>
        <Download size={16} /> Generate &amp; Download Report
      </button>

      <div className="card admin-list-card">
        <div className="admin-list-header"><h3>Recent Exports</h3></div>
        {exportsList.map((e, idx) => (
          <div key={idx} className="admin-list-row">
            <div><div className="name">{e.name}</div><div className="sub">{e.meta}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}
