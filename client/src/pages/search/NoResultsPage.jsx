import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import '../listings/ListingPages.css';

export default function NoResultsPage() {
  return (
    <div className="page-wrapper">
      <div className="card empty-state">
        <div className="empty-state-icon"><SearchX size={32} /></div>
        <h3>No Results Found</h3>
        <p>We couldn't find any listings matching your criteria. Try adjusting your filters or search terms.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/search" className="btn btn-primary">Back to Search</Link>
          <Link to="/" className="btn btn-secondary">Go to Homepage</Link>
        </div>
      </div>
    </div>
  );
}
