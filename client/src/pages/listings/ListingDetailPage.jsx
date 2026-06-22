import { useParams, Link } from 'react-router-dom';
import { Heart, MapPin, Wifi, Wind, Car, UtensilsCrossed, WashingMachine, BookOpen, Star, MessageSquare, Navigation } from 'lucide-react';
import './ListingPages.css';

const amenityIcons = {
  WiFi: Wifi,
  'Air Conditioning': Wind,
  Parking: Car,
  Kitchen: UtensilsCrossed,
  Laundry: WashingMachine,
  'Study Room': BookOpen,
};

export default function ListingDetailPage() {
  const { id } = useParams();

  const listing = {
    title: 'Cozy Single Room Near UTM',
    location: 'Jalan Skudai, Skudai, Johor Bahru • 1.5km from UTM',
    price: 550,
    roomType: 'Single Room',
    description: 'Comfortable single room in a quiet neighborhood, perfect for students. The room comes fully furnished with a bed, study desk, wardrobe, and air conditioning. Shared kitchen and bathroom facilities are well-maintained and clean.',
    amenities: ['WiFi', 'Air Conditioning', 'Parking', 'Kitchen', 'Laundry', 'Study Room'],
    rating: 4.8,
    reviewCount: 8,
    owner: { name: 'Ahmad Zaki', rating: 4.8, reviews: 12, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop',
    ],
  };

  return (
    <div className="page-wrapper">
      <div className="listing-detail-gallery">
        <img src={listing.images[0]} className="listing-detail-main-img" alt="" />
        <img src={listing.images[1]} className="listing-detail-thumb" alt="" />
        <img src={listing.images[2]} className="listing-detail-thumb" alt="" />
      </div>

      <div className="listing-detail-layout">
        <div>
          <div className="listing-detail-title-row">
            <h1>{listing.title}</h1>
            <button className="btn btn-secondary" style={{ padding: 10 }}><Heart size={18} /></button>
          </div>
          <div className="listing-detail-location"><MapPin size={15} /> {listing.location}</div>
          <div className="listing-detail-price">
            RM {listing.price}<span>/month</span>{' '}
            <span className="badge badge-info" style={{ marginLeft: 8 }}>{listing.roomType}</span>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Description</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>{listing.description}</p>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 14 }}>Amenities</h3>
            <div className="amenity-row">
              {listing.amenities.map((a) => {
                const Icon = amenityIcons[a];
                return (
                  <div key={a} className="amenity-item">
                    <div className="amenity-icon"><Icon size={16} /></div>
                    {a}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="review-summary-row">
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Reviews</h3>
                <div className="review-summary-stars">{'★'.repeat(5)}</div>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{listing.reviewCount} reviews</p>
              </div>
              <div className="review-summary-score">{listing.rating}</div>
            </div>
            <Link to={`/listings/${id}/reviews`} className="btn btn-secondary" style={{ width: '100%', marginTop: 14 }}>View All</Link>
          </div>
        </div>

        <div>
          <div className="card listed-by-card">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Listed by</h3>
            <div className="owner-row">
              <img src={listing.owner.avatar} alt={listing.owner.name} />
              <div>
                <div className="owner-name">{listing.owner.name}</div>
                <div className="owner-rating"><Star size={12} fill="#F59E0B" color="#F59E0B" style={{ verticalAlign: 'middle' }} /> {listing.owner.rating} ({listing.owner.reviews})</div>
              </div>
            </div>
            <Link to="/chat" className="btn btn-primary"><MessageSquare size={16} /> Contact Owner</Link>
            <Link to={`/directions/${id}`} className="btn btn-secondary"><Navigation size={16} /> Get Directions</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
