import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import './ProfilePages.css';

export default function UnauthorizedPage() {
  return (
    <div className="unauthorized-page">
      <div>
        <div className="unauthorized-icon">
          <ShieldAlert size={36} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Access Denied</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
          You don't have permission to view this page.
        </p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </div>
  );
}
