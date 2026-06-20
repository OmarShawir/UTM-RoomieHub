import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Bed, Bath, Users, Star, Heart, MessageSquare } from 'lucide-react';
import '../listings/ListingPages.css';

export default function RecommendedListingPage() {
  const { id } = useParams();

  const listing = {
    title: 'Cozy Studio near UTM',
    price: 450,
    location: 'Skudai, Johor',
    distance: '1.2 km from UTM',
    bedrooms: 1,
    bathrooms: 1,
    capacity: 2,
    matchScore: 92,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=400&fit=crop',
    ],
    amenities: ['WiFi', 'Air Conditioning', 'Washing Machine', 'Kitchen', 'Parking'],
    description: 'Comfortable studio apartment perfect for UTM students. Close to campus with all essential amenities.',
    owner: { name: 'Ahmad Razak', rating: 4.8, verified: true },
    matchReasons: [
      'Close to your preferred location (Skudai)',
      'Within your budget (RM 400–500)',
      'Has all your required amenities',
      'Quiet environment matches your preference',
    ],
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Link to="/ai-match" className="auth-back-link" style={{ color: 'var(--color-primary)' }}>
          <ArrowLeft size={16} /> Back to Recommendations
        </Link>
        <span className="badge badge-active">{listing.matchScore}% Match</span>
      </div>

      <div className="card" style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.25)', marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Why This Listing Matches You</h3>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {listing.matchReasons.map((reason, idx) => (
            <li key={idx} style={{ display: 'flex', gap: 8, fontSize: 14 }}>
              <Star size={15} color="var(--color-success)" style={{ flexShrink: 0, marginTop: 2 }} />
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <div className="listing-detail-gallery" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {listing.images.map((img, idx) => (
          <img key={idx} src={img} alt="" style={{ aspectRatio: '16/9' }} />
        ))}
      </div>

      <div className="listing-detail-title-row" style={{ marginTop: 20 }}>
        <div>
          <h1>{listing.title}</h1>
          <div className="listing-detail-location" style={{ marginBottom: 0 }}>
            <MapPin size={15} /> {listing.location} • {listing.distance}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="listing-detail-price" style={{ marginBottom: 0 }}>RM {listing.price}</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>per month</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, padding: '16px 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', margin: '16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}><Bed size={18} /> {listing.bedrooms} Bedroom</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}><Bath size={18} /> {listing.bathrooms} Bathroom</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}><Users size={18} /> Up to {listing.capacity} people</div>
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Description</h3>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20 }}>{listing.description}</p>

      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Amenities</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {listing.amenities.map((a) => (
          <span key={a} className="badge badge-info">{a}</span>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 600 }}>
              {listing.owner.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>{listing.owner.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                <Star size={14} fill="#F59E0B" color="#F59E0B" /> {listing.owner.rating}
                {listing.owner.verified && <span className="badge badge-info">Verified</span>}
              </div>
            </div>
          </div>
          <Link to="/chat" className="btn btn-primary"><MessageSquare size={16} /> Contact Owner</Link>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14 }}>
        <button className="btn btn-secondary" style={{ flex: 1 }}><Heart size={16} /> Save to Wishlist</button>
        <button className="btn btn-primary" style={{ flex: 1 }}>Accept Recommendation</button>
      </div>
    </div>
  );
}
