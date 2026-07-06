import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../../services/api';
import './AdminPages.css';

const statusClass = {
  active: 'badge-active',
  removed: 'badge-suspended',
  inactive: 'badge-pending',
};

export default function AdminListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 1 });
  const [error, setError] = useState('');

  const fetchListings = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/admin/listings', {
        params: {
          keyword: search,
          page: pageNumber,
          limit: 20,
        },
      });
      if (res.data.success) {
        setListings(res.data.listings || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch listings list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchListings(1);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.pages) {
      fetchListings(page);
    }
  };

  const handleRemove = async (listingId) => {
    const reason = prompt('Please enter a reason for removing this listing:');
    if (reason === null) return; // Cancelled
    if (!reason.trim()) {
      alert('A reason is required to remove the listing.');
      return;
    }

    try {
      const res = await api.delete(`/admin/listings/${listingId}`, {
        data: { reason: reason.trim() },
      });
      if (res.data.success) {
        alert('Listing removed successfully.');
        fetchListings(pagination.page);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to remove listing.');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="admin-page-header">
        <h1>Listing Management</h1>
        <p>Manage all property listings on the platform</p>
      </div>

      <div className="card admin-list-card">
        <div className="admin-search-row">
          <Search size={18} color="var(--color-text-secondary)" style={{ alignSelf: 'center' }} />
          <input
            placeholder="Search listings by title, location, or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && <div style={{ background: '#fef2f2', color: '#991b1b', padding: '12px 16px', borderRadius: 8, fontSize: 14, margin: '0 16px 16px 16px' }}>{error}</div>}

        <div className="admin-table-wrap">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading listings...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Listing</th>
                  <th>Owner</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '20px' }}>
                      No listings found.
                    </td>
                  </tr>
                ) : (
                  listings.map((l) => (
                    <tr key={l.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{l.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>ID: LST-{String(l.id).padStart(3, '0')}</div>
                      </td>
                      <td>{l.owner_name}</td>
                      <td>{l.address}</td>
                      <td style={{ fontWeight: 500 }}>RM {l.price}</td>
                      <td>
                        <span className={`badge ${statusClass[l.status] || 'badge-pending'}`}>
                          {l.status}
                        </span>
                      </td>
                      <td>{l.created_at ? new Date(l.created_at).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <Link to={`/listings/${l.id}`} className="link-action" style={{ marginRight: 12 }}>View</Link>
                        {l.status !== 'removed' && (
                          <button
                            className="link-danger"
                            onClick={() => handleRemove(l.id)}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {!loading && pagination.pages > 1 && (
          <div className="admin-pagination">
            <span>
              Showing {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} listings
            </span>
            <div className="pages">
              <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1}>Previous</button>
              {Array.from({ length: pagination.pages }, (_, idx) => (
                <button
                  key={idx + 1}
                  className={pagination.page === idx + 1 ? 'active' : ''}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.pages}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
