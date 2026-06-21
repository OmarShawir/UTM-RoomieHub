import { Link } from 'react-router-dom';
import { Plus, MapPin, Eye } from 'lucide-react';
import './ListingPages.css';

const myListings = [
  {
    id: 1,
    title: 'Cozy Single Room Near UTM',
    location: 'Jalan Skudai, Skudai • 1.5km from UTM',
    price: 550,
    status: 'active',
    views: 124,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop',
  },
  {
    id: 2,
    title: 'Spacious Studio Apartment',
    location: 'Taman Universiti • 2km from UTM',
    price: 800,
    status: 'pending',
    views: 56,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop',
  },
];

export default function MyListingsPage() {
  return (
    <div className="page-wrapper">
      <div className="search-header">
        <h1 style={{ fontSize: 28, fontWeight: 600 }}>My Listings</h1>
        <Link to="/listings/create" className="btn btn-primary"><Plus size={16} /> New Listing</Link>
      </div>

      <div className="listing-grid">
        {myListings.map((listing) => (
          <div key={listing.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <img src={listing.image} alt={listing.title} className="listing-card-img" />
            <div className="listing-card-body">
              <div className="listing-card-top">
                <div className="listing-card-title">{listing.title}</div>
                <span className={`badge ${listing.status === 'active' ? 'badge-active' : 'badge-pending'}`}>
                  {listing.status}
                </span>
              </div>
              <div className="listing-card-location"><MapPin size={13} /> {listing.location}</div>
              <div className="listing-card-price">
                RM {listing.price}<span>/month</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 8 }}>
                <Eye size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />{listing.views} views
              </p>
              <div className="listing-card-actions">
                <Link to={`/listings/${listing.id}`} className="btn btn-secondary">View</Link>
                <Link to={`/listings/${listing.id}/edit`} className="btn btn-secondary">Edit</Link>
                <button className="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
