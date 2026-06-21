import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart } from 'lucide-react';
import './ListingPages.css';

const initialWishlist = [
  { id: 1, title: 'Modern Studio Apartment', location: 'Taman Universiti • 2km', price: 700, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop' },
  { id: 2, title: 'Shared Room Near Campus', location: 'Jalan Skudai • 1.2km', price: 400, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=300&fit=crop' },
];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(initialWishlist);

  const remove = (id) => setWishlist(wishlist.filter((w) => w.id !== id));

  return (
    <div className="page-wrapper">
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Heart size={32} /></div>
          <h3>Your wishlist is empty</h3>
          <p>Save listings you're interested in to find them here later</p>
          <Link to="/search" className="btn btn-primary">Browse Listings</Link>
        </div>
      ) : (
        <div className="listing-grid">
          {wishlist.map((item) => (
            <div key={item.id} className="card listing-card-wrapper" style={{ padding: 0, overflow: 'hidden' }}>
              <img src={item.image} alt={item.title} className="listing-card-img" />
              <button className="listing-card-fav" onClick={() => remove(item.id)}>
                <Heart size={16} fill="var(--color-primary)" color="var(--color-primary)" />
              </button>
              <div className="listing-card-body">
                <div className="listing-card-title">{item.title}</div>
                <div className="listing-card-location"><MapPin size={13} /> {item.location}</div>
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
