import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart } from 'lucide-react';
import api from '../../services/api';
import { DEFAULT_LISTING_IMAGE } from '../../utils/defaults';
import './ListingPages.css';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/listings/wishlist');
      if (res.data.success) {
        setWishlist(res.data.listings);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const remove = async (id) => {
    try {
      const res = await api.delete(`/listings/${id}/wishlist`);
      if (res.data.success) {
        setWishlist((prev) => prev.filter((w) => w.id !== id));
      }
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading wishlist...</div>;
  }

  return (
    <div className="page-wrapper">
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Heart size={32} /></div>
          <h3>Your wishlist is empty</h3>
          <p>Save listings you're interested in to find them here later</p>
          <Link to="/search" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Listings</Link>
        </div>
      ) : (
        <div className="listing-grid">
          {wishlist.map((item) => (
            <div key={item.id} className="card listing-card-wrapper" style={{ padding: 0, overflow: 'hidden' }}>
              <img
                src={item.cover_photo || DEFAULT_LISTING_IMAGE}
                onError={(e) => { e.target.src = DEFAULT_LISTING_IMAGE; }}
                alt={item.title}
                className="listing-card-img"
              />
              <button className="listing-card-fav" onClick={() => remove(item.id)}>
                <Heart size={16} fill="var(--color-primary)" color="var(--color-primary)" />
              </button>
              <div className="listing-card-body">
                <div className="listing-card-title">{item.title}</div>
                <div className="listing-card-location">
                  <MapPin size={13} /> {item.address || 'Skudai, Johor'} {item.distance_from_campus ? `• ${item.distance_from_campus}km from UTM` : ''}
                </div>
                <div className="listing-card-price">RM {item.price}<span>/month</span></div>
                <Link to={`/listings/${item.id}`} className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>View</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
