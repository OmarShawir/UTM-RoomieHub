import { useState } from 'react';
import { Search } from 'lucide-react';
import './AdminPages.css';

const listings = [
  { id: 'LST-001', title: 'Cozy Studio near UTM', owner: 'Ahmad Razak', location: 'Skudai', price: 450, status: 'Active', posted: '2024-05-20' },
  { id: 'LST-002', title: 'Shared Room in Apartment', owner: 'Siti Nurhaliza', location: 'Taman University', price: 300, status: 'Active', posted: '2024-05-22' },
  { id: 'LST-003', title: 'Private Room with Bathroom', owner: 'Muhammad Ali', location: 'Austin Heights', price: 550, status: 'Flagged', posted: '2024-05-25' },
  { id: 'LST-004', title: '2-Bedroom Apartment', owner: 'Farah Liyana', location: 'Taman Molek', price: 800, status: 'Active', posted: '2024-05-27' },
  { id: 'LST-005', title: 'Budget Room for Students', owner: 'Azmi Rahman', location: 'Gelang Patah', price: 250, status: 'Inactive', posted: '2024-05-28' },
];

const statusClass = { Active: 'badge-active', Flagged: 'badge-suspended', Inactive: 'badge-pending' };

export default function AdminListingsPage() {
  const [search, setSearch] = useState('');
  const filtered = listings.filter((l) => l.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-wrapper">
      <div className="admin-page-header">
        <h1>Listing Management</h1>
        <p>Manage all property listings on the platform</p>
      </div>

      <div className="card admin-list-card">
        <div className="admin-search-row">
          <Search size={18} color="var(--color-text-secondary)" style={{ alignSelf: 'center' }} />
          <input placeholder="Search listings by title, location, or owner..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Listing</th><th>Owner</th><th>Location</th><th>Price</th><th>Status</th><th>Posted</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id}>
                  <td><div style={{ fontWeight: 600 }}>{l.title}</div><div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>ID: {l.id}</div></td>
                  <td>{l.owner}</td>
                  <td>{l.location}</td>
                  <td>RM {l.price}</td>
                  <td><span className={`badge ${statusClass[l.status]}`}>{l.status}</span></td>
                  <td>{l.posted}</td>
                  <td>
                    <span className="link-action">View</span>
                    {l.status === 'Flagged' && <span className="link-danger">Remove</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-pagination">
          <span>Showing 1-{filtered.length} of 342 listings</span>
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
