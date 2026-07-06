import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Eye, Home } from 'lucide-react';
import api from '../../services/api';
import { DEFAULT_LISTING_IMAGE } from '../../utils/defaults';
import './ListingPages.css';

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/listings/my');
      setListings(res.data.listings || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch your listings.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.delete(`/listings/${id}`);
      setListings(listings.filter((l) => l.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete listing.');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="search-header">
        <h1 style={{ fontSize: 28, fontWeight: 600 }}>My Listings</h1>
        <Link to="/listings/create" className="btn btn-primary"><Plus size={16} /> New Listing</Link>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading your listings...</div>}
      
      {error && (
        <div style={{ background: '#fef2f2', color: '#991b1b', padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          {error}
        </div>
      )}

      {!loading && !error && listings.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon"><Home size={32} /></div>
          <h3>No Listings Yet</h3>
          <p>You haven't created any listings yet. Post one to find roomies!</p>
          <Link to="/listings/create" className="btn btn-primary">Create Listing</Link>
        </div>
      )}

      {!loading && !error && listings.length > 0 && (
        <div className="listing-grid">
          {listings.map((listing) => (
            <div key={listing.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <img
                src={listing.cover_photo || DEFAULT_LISTING_IMAGE}
                onError={(e) => { e.target.src = DEFAULT_LISTING_IMAGE; }}
                alt={listing.title}
                className="listing-card-img"
              />
              <div className="listing-card-body">
                <div className="listing-card-top">
                  <div className="listing-card-title">{listing.title}</div>
                  <span className={`badge ${listing.status === 'active' ? 'badge-active' : 'badge-pending'}`}>
                    {listing.status}
                  </span>
                </div>
                <div className="listing-card-location">
                  <MapPin size={13} /> {listing.address} {listing.distance_from_campus ? `• ${listing.distance_from_campus}km from UTM` : ''}
                </div>
                <div className="listing-card-price">
                  RM {listing.price}<span>/month</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 8 }}>
                  <Eye size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />{listing.views || 0} views
                </p>
                <div className="listing-card-actions">
                  <Link to={`/listings/${listing.id}`} className="btn btn-secondary">View</Link>
                  <Link to={`/listings/${listing.id}/edit`} className="btn btn-secondary">Edit</Link>
                  <button className="btn btn-danger" onClick={() => handleDelete(listing.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
