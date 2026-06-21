import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import './AdminPages.css';

const users = [
  { id: 1, name: 'Ahmad Razak', matric: 'A20EC0001', email: 'ahmad@graduate.utm.my', status: 'Active', joined: '2024-01-15' },
  { id: 2, name: 'Siti Nurhaliza', matric: 'A20EC0002', email: 'siti@graduate.utm.my', status: 'Active', joined: '2024-01-20' },
  { id: 3, name: 'Muhammad Ali', matric: 'A20EC0003', email: 'ali@graduate.utm.my', status: 'Suspended', joined: '2024-02-01' },
  { id: 4, name: 'Farah Liyana', matric: 'A20EC0004', email: 'farah@graduate.utm.my', status: 'Active', joined: '2024-02-10' },
  { id: 5, name: 'Azmi Rahman', matric: 'A20EC0005', email: 'azmi@graduate.utm.my', status: 'Active', joined: '2024-02-15' },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-wrapper">
      <div className="admin-page-header">
        <h1>User Management</h1>
        <p>Manage all registered users on the platform</p>
      </div>

      <div className="card admin-list-card">
        <div className="admin-search-row">
          <Search size={18} color="var(--color-text-secondary)" style={{ alignSelf: 'center' }} />
          <input placeholder="Search users by name, email, or student ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>User</th><th>Student ID</th><th>Email</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.matric}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.status === 'Active' ? 'badge-active' : 'badge-suspended'}`}>{u.status}</span></td>
                  <td>{u.joined}</td>
                  <td>
                    <Link to={`/profile/${u.id}`} className="link-action">View</Link>
                    {u.status === 'Active' ? (
                      <Link to={`/admin/suspend/${u.id}`} className="link-danger">Suspend</Link>
                    ) : (
                      <Link to={`/admin/reinstate/${u.id}`} className="link-action" style={{ marginLeft: 12 }}>Reinstate</Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-pagination">
          <span>Showing 1-{filtered.length} of 1,247 users</span>
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
