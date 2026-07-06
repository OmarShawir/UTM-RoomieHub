import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Wifi, Wind, Car, UtensilsCrossed, WashingMachine, BookOpen, Star, MessageSquare, Navigation } from 'lucide-react';
import api from '../../services/api';
import { DEFAULT_AVATAR, DEFAULT_LISTING_IMAGE } from '../../utils/defaults';
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
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/listings/${id}`);
        setListing(res.data.listing);
      } catch (err) {
        console.error(err);
        setError('Failed to load listing details.');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const toggleWishlist = async () => {
    if (!listing) return;
    try {
      if (listing.in_wishlist) {
        await api.delete(`/listings/${id}/wishlist`);
      } else {
        await api.post(`/listings/${id}/wishlist`);
      }
      setListing(prev => ({ ...prev, in_wishlist: !prev.in_wishlist }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleContactOwner = async () => {
    if (!listing) return;
    try {
      const res = await api.post('/chat/conversations', {
        other_user_id: listing.user_id,
        listing_id: listing.id,
      });
      if (res.data.success && res.data.conversation) {
        navigate(`/chat/${res.data.conversation.id}`);
      }
    } catch (err) {
      console.error('Failed to start conversation:', err);
    }
  };

  if (loading) return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading listing details...</div>;
  if (error) return <div className="page-wrapper" style={{ color: '#991b1b', background: '#fef2f2', padding: '16px', borderRadius: 8 }}>{error}</div>;
  if (!listing) return <div className="page-wrapper">Listing not found.</div>;

  const allPhotos = listing.photos && listing.photos.length > 0
    ? listing.photos.map(p => p.photo_url)
    : [DEFAULT_LISTING_IMAGE];

  // Calculate layout classes based on number of photos
  const galleryClass = `listing-detail-gallery ${
    allPhotos.length === 1 
      ? 'gallery-single' 
      : allPhotos.length === 2 
      ? 'gallery-double' 
      : ''
  }`;

  // Default amenities to show if none are returned (or parse from DB if serialized)
  const amenitiesList = Array.isArray(listing.amenities)
    ? listing.amenities
    : ['WiFi', 'Air Conditioning', 'Parking', 'Kitchen'];

  return (
    <div className="page-wrapper">
      <div className={galleryClass}>
        {allPhotos.map((url, index) => (
          <img 
            key={index} 
            src={url} 
            className={index === 0 ? 'listing-detail-main-img' : 'listing-detail-thumb'} 
            alt={listing.title} 
          />
        ))}
      </div>

      <div className="listing-detail-layout">
        <div>
          <div className="listing-detail-title-row">
            <h1>{listing.title}</h1>
            <button
              className="btn btn-secondary"
              onClick={toggleWishlist}
              style={{ padding: 10, color: listing.in_wishlist ? 'var(--color-primary)' : 'inherit' }}
            >
              <Heart size={18} fill={listing.in_wishlist ? 'var(--color-primary)' : 'none'} />
            </button>
          </div>
          <div className="listing-detail-location">
            <MapPin size={15} /> {listing.address} {listing.distance_from_campus ? `• ${listing.distance_from_campus}km from UTM` : ''}
          </div>
          <div className="listing-detail-price">
            RM {listing.price}<span>/month</span>{' '}
            <span className="badge badge-info" style={{ marginLeft: 8, textTransform: 'capitalize' }}>
              {listing.room_type} Room
            </span>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Description</h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{listing.description}</p>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 14 }}>Amenities</h3>
            <div className="amenity-row">
              {amenitiesList.map((a) => {
                const Icon = amenityIcons[a] || Wifi;
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
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{listing.review_count || 0} reviews</p>
              </div>
              <div className="review-summary-score">{listing.avg_rating ? Number(listing.avg_rating).toFixed(1) : '5.0'}</div>
            </div>
            <Link to={`/listings/${id}/reviews`} className="btn btn-secondary" style={{ width: '100%', marginTop: 14 }}>View All Reviews</Link>
            <Link to={`/listings/${id}/reviews`} className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
              <Star size={14} fill="#fff" /> Write a Review
            </Link>
          </div>
        </div>

        <div>
          <div className="card listed-by-card">
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Listed by</h3>
            <div className="owner-row">
              <img
                src={listing.owner_avatar || DEFAULT_AVATAR}
                onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                alt={listing.owner_name || 'Owner'}
              />
              <div>
                <div className="owner-name">{listing.owner_name || 'RoomieHub Host'}</div>
                <div className="owner-rating">
                  <Star size={12} fill="#F59E0B" color="#F59E0B" style={{ verticalAlign: 'middle' }} />{' '}
                  {listing.avg_rating ? Number(listing.avg_rating).toFixed(1) : '5.0'} ({listing.review_count || 0})
                </div>
              </div>
            </div>
            <button onClick={handleContactOwner} className="btn btn-primary">
              <MessageSquare size={16} /> Contact Owner
            </button>
            <Link to={`/directions/${id}`} className="btn btn-secondary"><Navigation size={16} /> Get Directions</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
