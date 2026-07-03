import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../../services/api';
import './AdminPages.css';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 1 });
  const [error, setError] = useState('');

  const fetchUsers = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/admin/users', {
        params: {
          keyword: search,
          page: pageNumber,
          limit: 20,
        },
      });
      if (res.data.success) {
        setUsers(res.data.users);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users list.');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when search changes (after brief delay/debounce) or on mount
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers(1);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.pages) {
      fetchUsers(page);
    }
  };

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to delete the user "${name}"? This will delete all of their listings/wishlists and anonymize their profile.`)) {
      return;
    }
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        alert('User deleted successfully.');
        fetchUsers(pagination.page);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete user.');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="admin-page-header">
        <h1>User Management</h1>
        <p>Manage all registered users on the platform</p>
      </div>

      <div className="card admin-list-card">
        <div className="admin-search-row">
          <Search size={18} color="var(--color-text-secondary)" style={{ alignSelf: 'center' }} />
          <input
            placeholder="Search users by name, email, or student ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && <div style={{ background: '#fef2f2', color: '#991b1b', padding: '12px 16px', borderRadius: 8, fontSize: 14, margin: '0 16px 16px 16px' }}>{error}</div>}

        <div className="admin-table-wrap">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading users...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Student ID</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '20px' }}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 500 }}>{u.full_name || 'N/A'}</td>
                      <td>{u.matric_no || 'N/A'}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.account_status === 'active' ? 'badge-active' : 'badge-suspended'}`}>
                          {u.account_status || 'active'}
                        </span>
                      </td>
                      <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <div style={{ display: 'grid', gridTemplateColumns: '40px 90px 60px', gap: '16px', alignItems: 'center' }}>
                          <div>
                            <Link to={`/profile/${u.id}`} className="link-action">View</Link>
                          </div>
                          <div>
                            {u.account_status === 'active' ? (
                              <Link to={`/admin/suspend/${u.id}`} className="link-danger">Suspend</Link>
                            ) : (
                              <Link to={`/admin/reinstate/${u.id}`} className="link-success">Reinstate</Link>
                            )}
                          </div>
                          <div>
                            <button
                              className="link-danger"
                              onClick={() => handleDelete(u.id, u.full_name)}
                              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
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
              Showing {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
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
