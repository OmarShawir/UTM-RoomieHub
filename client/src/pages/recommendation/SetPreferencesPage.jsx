import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../listings/ListingPages.css';
import '../chat/ChatPages.css';

const AMENITIES = ['WiFi', 'Air Conditioning', 'Parking', 'Kitchen', 'Laundry', 'Study Room'];

export default function SetPreferencesPage() {
  const navigate = useNavigate();
  const [roomType, setRoomType] = useState('');
  const [maxPrice, setMaxPrice] = useState(800);
  const [maxDistance, setMaxDistance] = useState(3);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const res = await api.get('/matching/room/preferences');
        if (res.data.success && res.data.preferences) {
          const p = res.data.preferences;
          setRoomType(p.room_type || '');
          setMaxPrice(p.max_budget ? Number(p.max_budget) : 800);
          setMaxDistance(p.max_distance_km ? Number(p.max_distance_km) : 3);
        }
        
        // Load Required Amenities from localStorage
        const storedAmenities = localStorage.getItem('room_required_amenities');
        if (storedAmenities) {
          setAmenities(JSON.parse(storedAmenities));
        }
      } catch (err) {
        console.error('Failed to load preferences:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPrefs();
  }, []);

  const toggleAmenity = (a) => {
    setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/matching/room/preferences', {
        room_type: roomType,
        max_budget: maxPrice,
        max_distance_km: maxDistance,
      });
      if (res.data.success) {
        // Store Required Amenities in localStorage
        localStorage.setItem('room_required_amenities', JSON.stringify(amenities));
        navigate('/ai-match');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save preferences.');
    }
  };

  if (loading) {
    return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading preferences...</div>;
  }

  return (
    <div className="page-wrapper" style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 6 }}>Set Room Preferences</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
        Tell us what you're looking for and we'll recommend the best matches
      </p>

      <form onSubmit={handleSubmit}>
        <div className="card listing-form-card">
          <h3>Basic Preferences</h3>

          <div className="form-group">
            <label>Room Type</label>
            <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
              <option value="">Select preferred type</option>
              <option value="single">Single Room</option>
              <option value="double">Double Room</option>
              <option value="studio">Studio</option>
              <option value="apartment">Apartment</option>
            </select>
          </div>

          <div className="preference-section">
            <h4>Price Range (RM/month)</h4>
            <input type="range" min="200" max="1500" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: '100%' }} />
            <div className="range-display"><span>RM 200</span><span>RM {maxPrice}</span></div>
          </div>

          <div className="preference-section">
            <h4>Maximum Distance from UTM (km)</h4>
            <input type="range" min="0.5" max="10" step="0.5" value={maxDistance} onChange={(e) => setMaxDistance(Number(e.target.value))} style={{ width: '100%' }} />
            <div className="range-display" style={{ justifyContent: 'center' }}><span>Within {maxDistance} km</span></div>
          </div>
        </div>

        <div className="card listing-form-card">
          <h3>Required Amenities</h3>
          <div className="amenities-grid">
            {AMENITIES.map((a) => (
              <label key={a} className="amenity-checkbox">
                <input type="checkbox" checked={amenities.includes(a)} onChange={() => toggleAmenity(a)} />
                {a}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 20 }}>Find Recommendations</button>
      </form>
    </div>
  );
}
