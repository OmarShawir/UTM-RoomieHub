import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, MapPin, Heart } from 'lucide-react';
import '../listings/ListingPages.css';

const allListings = [
  { id: 1, title: 'Cozy Single Room', location: 'Jalan Skudai • 1.5km from UTM', price: 550, type: 'Single Room', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop' },
  { id: 2, title: 'Modern Studio', location: 'Taman Universiti • 2km from UTM', price: 750, type: 'Studio', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop' },
  { id: 3, title: 'Shared Apartment', location: 'Skudai Parade • 3.5km from UTM', price: 450, type: 'Double Room', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=300&fit=crop' },
];

export default function SearchPage() {
  const [roomType, setRoomType] = useState('all');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [amenities, setAmenities] = useState([]);

  const toggleAmenity = (a) => {
    setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  };

  const filtered = allListings.filter((l) => l.price <= maxPrice);

  return (
    <div className="page-wrapper">
      <div className="search-layout">

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
            </select>
          </div>

          <div className="filter-section">
            <h4>Price Range (RM/month)</h4>
            <input type="range" min="0" max="1000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: '100%' }} />
            <div className="range-display"><span>RM 0</span><span>RM {maxPrice}</span></div>
          </div>

          <div className="filter-section">
            <h4>Distance from UTM (km)</h4>
            <select>
              <option>Any distance</option>
              <option>Within 1km</option>
              <option>Within 3km</option>
              <option>Within 5km</option>
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

          <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }}>Apply Filters</button>
        </div>

        <div>
          <div className="search-header">
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 600 }}>Search Results</h1>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>{filtered.length} listings found</p>
            </div>
            <Link to="/map" className="btn btn-secondary">View Map</Link>
          </div>

          {filtered.length === 0 ? (
            <Link to="/search/no-results" className="btn btn-secondary">See no-results page</Link>
          ) : (
            <div className="listing-grid">
              {filtered.map((listing) => (
                <div key={listing.id} className="card listing-card-wrapper" style={{ padding: 0, overflow: 'hidden' }}>
                  <img src={listing.image} alt={listing.title} className="listing-card-img" />
                  <button className="listing-card-fav"><Heart size={16} /></button>
                  <div className="listing-card-body">
                    <span className="badge badge-info" style={{ marginBottom: 6 }}>{listing.type}</span>
                    <div className="listing-card-title">{listing.title}</div>
                    <div className="listing-card-location"><MapPin size={13} /> {listing.location}</div>
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
