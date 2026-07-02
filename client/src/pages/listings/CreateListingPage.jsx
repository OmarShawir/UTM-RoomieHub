import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../services/api';
import './ListingPages.css';

const AMENITIES = ['WiFi', 'Air Conditioning', 'Parking', 'Kitchen', 'Laundry', 'Study Room'];

// UTM Campus default center
const UTM_CENTER = [1.5582, 103.637];

const pinIcon = L.divIcon({
  className: '',
  html: `<div style="background:#7B1E1E;width:20px;height:20px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 20],
});

// Inner component that handles map click events
function LocationPicker({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    roomType: '',
    price: '',
    address: '',
    distance: '',
    description: '',
    amenities: [],
    latitude: null,
    longitude: null,
  });

  const toggleAmenity = (amenity) => {
    setForm((f) =>
      f.amenities.includes(amenity)
        ? { ...f, amenities: f.amenities.filter((a) => a !== amenity) }
        : { ...f, amenities: [...f.amenities, amenity] }
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImages([...images, { file, preview: URL.createObjectURL(file) }]);
    }
  };

  const handlePinDrop = useCallback((lat, lng) => {
    setForm((f) => ({ ...f, latitude: lat, longitude: lng }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      let photoUrls = [];

      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((imgObj) => {
          formData.append('photos', imgObj.file);
        });
        const uploadRes = await api.post('/listings/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        photoUrls = uploadRes.data.urls || [];
      }

      await api.post('/listings', {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        room_type: form.roomType,
        address: form.address,
        distance_from_campus: form.distance ? Number(form.distance) : null,
        latitude: form.latitude,
        longitude: form.longitude,
        photos: photoUrls,
        amenities: form.amenities,
      });

      navigate('/my-listings');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create listing. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>Create New Listing</h1>

      {error && (
        <div style={{ background: '#fef2f2', color: '#991b1b', padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ── Basic Info ───────────────────────────── */}
        <div className="card listing-form-card">
          <h3>Basic Information</h3>

          <div className="form-group">
            <label>Listing Title *</label>
            <input
              placeholder="e.g., Cozy Single Room Near UTM"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Room Type *</label>
              <select value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })} required>
                <option value="">Select type</option>
                <option value="single">Single Room</option>
                <option value="double">Double Room</option>
                <option value="studio">Studio</option>
                <option value="apartment">Apartment</option>
              </select>
            </div>
            <div className="form-group">
              <label>Monthly Rent (RM) *</label>
              <input type="number" placeholder="500" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
          </div>

          <div className="form-group">
            <label>Address *</label>
            <input placeholder="Street address, Skudai, Johor" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Distance from UTM (km) *</label>
            <input type="number" step="0.1" placeholder="2.5" value={form.distance} onChange={(e) => setForm({ ...form, distance: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea rows={5} placeholder="Describe your listing..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
        </div>

        {/* ── Map Location Picker ───────────────────── */}
        <div className="card listing-form-card">
          <h3>Pin Location on Map</h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
            <MapPin size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Click anywhere on the map to drop a pin. This allows your listing to appear on the Map View page.
          </p>

          <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--color-border)', height: 300 }}>
            <MapContainer center={UTM_CENTER} zoom={14} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker onPick={handlePinDrop} />
              {form.latitude && form.longitude && (
                <Marker position={[form.latitude, form.longitude]} icon={pinIcon} />
              )}
            </MapContainer>
          </div>

          {form.latitude && form.longitude ? (
            <div style={{ marginTop: 10, fontSize: 13, color: 'var(--color-success, #059669)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={14} />
              Location set: {form.latitude.toFixed(5)}, {form.longitude.toFixed(5)}
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, latitude: null, longitude: null }))}
                style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: 12 }}
              >
                Clear
              </button>
            </div>
          ) : (
            <div style={{ marginTop: 10, fontSize: 13, color: 'var(--color-text-secondary)' }}>
              No pin set — listing will not appear on map view.
            </div>
          )}
        </div>

        {/* ── Amenities ────────────────────────────── */}
        <div className="card listing-form-card">
          <h3>Amenities</h3>
          <div className="amenities-grid">
            {AMENITIES.map((amenity) => (
              <label key={amenity} className="amenity-checkbox">
                <input type="checkbox" checked={form.amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} />
                {amenity}
              </label>
            ))}
          </div>
        </div>

        {/* ── Photos ───────────────────────────────── */}
        <div className="card listing-form-card">
          <h3>Photos</h3>
          <div className={`photo-grid ${images.length === 0 ? 'photo-grid-empty' : ''}`}>
            {images.map((imgObj, idx) => (
              <div key={idx} className="photo-slot">
                <img src={imgObj.preview} alt={`Upload ${idx + 1}`} />
                <button type="button" className="photo-remove-btn" onClick={() => setImages(images.filter((_, i) => i !== idx))}>
                  <X size={14} />
                </button>
              </div>
            ))}
            {images.length < 6 && (
              <label className="photo-upload-slot">
                <Upload size={22} />
                Upload Photo
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </label>
            )}
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            Upload up to 6 photos. First photo will be the cover image.
          </p>
        </div>

        <div className="listing-form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Listing'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/my-listings')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
