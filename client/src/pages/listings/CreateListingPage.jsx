import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import './ListingPages.css';

const AMENITIES = ['WiFi', 'Air Conditioning', 'Parking', 'Kitchen', 'Laundry', 'Study Room'];

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    title: '',
    roomType: '',
    price: '',
    address: '',
    distance: '',
    description: '',
    amenities: [],
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
    if (file) setImages([...images, URL.createObjectURL(file)]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/my-listings');
  };

  return (
    <div className="page-wrapper">
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>Create New Listing</h1>

      <form onSubmit={handleSubmit}>
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

        <div className="card listing-form-card">
          <h3>Photos</h3>
          <div className={`photo-grid ${images.length === 0 ? 'photo-grid-empty' : ''}`}>
            {images.map((img, idx) => (
              <div key={idx} className="photo-slot">
                <img src={img} alt={`Upload ${idx + 1}`} />
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
          <button type="submit" className="btn btn-primary">Create Listing</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/my-listings')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
