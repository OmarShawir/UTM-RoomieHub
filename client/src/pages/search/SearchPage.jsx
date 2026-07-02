import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Filter, MapPin, Heart, Search } from 'lucide-react';
import api from '../../services/api';
import { DEFAULT_LISTING_IMAGE } from '../../utils/defaults';
import '../listings/ListingPages.css';

export default function SearchPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters State
  const [roomType, setRoomType] = useState('all');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [maxDistance, setMaxDistance] = useState('any');
  const [amenities, setAmenities] = useState([]);

  const toggleAmenity = (a) => {
    setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  };

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {};
      if (roomType !== 'all') params.room_type = roomType;
      if (maxPrice) params.max_price = maxPrice;
      if (maxDistance !== 'any') params.max_distance = Number(maxDistance);
      if (amenities.length > 0) params.amenities = amenities.join(',');

      const res = await api.get('/listings', { params });
      setListings(res.data.listings || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load listings.');
    } finally {
      setLoading(false);
    }
  }, [roomType, maxPrice, maxDistance, amenities]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Wishlist toggle helper
  const toggleWishlist = async (listingId, isFav) => {
    try {
      if (isFav) {
        await api.delete(`/listings/${listingId}/wishlist`);
      } else {
        await api.post(`/listings/${listingId}/wishlist`);
      }
      setListings(prev => prev.map(l => l.id === listingId ? { ...l, in_wishlist: !isFav } : l));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="search-layout">

        {/* Filters Card */}
        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 600 }}>
            <Filter size={16} /> Filters
          </h3>

          <div className="filter-section">
            <h4>Room Type</h4>
            <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
              <option value="all">All types</option>
              <option value="single">Single Room</option>
              <option value="double">Double Room</option>
              <option value="studio">Studio</option>
              <option value="apartment">Apartment</option>
            </select>
          </div>

          <div className="filter-section">
            <h4>Price Range (RM/month)</h4>
            <input type="range" min="0" max="2000" step="50" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: '100%' }} />
            <div className="range-display"><span>RM 0</span><span>RM {maxPrice}</span></div>
          </div>

          <div className="filter-section">
            <h4>Distance from UTM (km)</h4>
            <select value={maxDistance} onChange={(e) => setMaxDistance(e.target.value)}>
              <option value="any">Any distance</option>
              <option value="1">Within 1km</option>
              <option value="3">Within 3km</option>
              <option value="5">Within 5km</option>
              <option value="10">Within 10km</option>
            </select>
          </div>

          <div className="filter-section">
            <h4>Amenities</h4>
            {['WiFi', 'Air Conditioning', 'Parking', 'Kitchen'].map((a) => (
              <label key={a} className="amenity-checkbox" style={{ marginBottom: 8 }}>
                <input type="checkbox" checked={amenities.includes(a)} onChange={() => toggleAmenity(a)} />
                {a}
              </label>
            ))}
          </div>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={fetchListings}>
            Apply Filters
          </button>
        </div>

        {/* Search Results Area */}
        <div>
          <div className="search-header">
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 600 }}>Search Results</h1>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>{listings.length} listings found</p>
            </div>
            <Link to="/map" className="btn btn-secondary">View Map</Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading listings...</div>
          ) : error ? (
            <div style={{ background: '#fef2f2', color: '#991b1b', padding: '12px 16px', borderRadius: 8, fontSize: 14 }}>
              {error}
            </div>
          ) : listings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Search size={32} /></div>
              <h3>No Results Found</h3>
              <p>Try adjusting your search filters to find roomies!</p>
            </div>
          ) : (
            <div className="listing-grid">
              {listings.map((listing) => (
                <div key={listing.id} className="card listing-card-wrapper" style={{ padding: 0, overflow: 'hidden' }}>
                  <img
                    src={listing.cover_photo || DEFAULT_LISTING_IMAGE}
                    onError={(e) => { e.target.src = DEFAULT_LISTING_IMAGE; }}
                    alt={listing.title}
                    className="listing-card-img"
                  />
                  <button
                    className="listing-card-fav"
                    onClick={() => toggleWishlist(listing.id, listing.in_wishlist)}
                    style={{ color: listing.in_wishlist ? 'var(--color-primary)' : 'inherit' }}
                  >
                    <Heart size={16} fill={listing.in_wishlist ? 'var(--color-primary)' : 'none'} />
                  </button>
                  <div className="listing-card-body">
                    <span className="badge badge-info" style={{ marginBottom: 6, textTransform: 'capitalize' }}>
                      {listing.room_type} Room
                    </span>
                    <div className="listing-card-title">{listing.title}</div>
                    <div className="listing-card-location">
                      <MapPin size={13} /> {listing.address} {listing.distance_from_campus ? `• ${listing.distance_from_campus}km from UTM` : ''}
                    </div>
                    <div className="listing-card-price">RM {listing.price}<span>/month</span></div>
                    <Link to={`/listings/${listing.id}`} className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>View Details</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
