import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ListingPages.css';

export default function EditListingPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: 'Cozy Single Room Near UTM',
    roomType: 'single',
    price: '550',
    address: 'Jalan Skudai, Skudai, Johor',
    distance: '1.5',
    description: 'Comfortable single room in a quiet neighborhood, perfect for students.',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/listings/${id}`);
  };

  return (
    <div className="page-wrapper">
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>Edit Listing</h1>

      <form onSubmit={handleSubmit}>
        <div className="card listing-form-card">
          <h3>Basic Information</h3>

          <div className="form-group">
            <label>Listing Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Room Type</label>
              <select value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })}>
                <option value="single">Single Room</option>
                <option value="double">Double Room</option>
                <option value="studio">Studio</option>
                <option value="apartment">Apartment</option>
              </select>
            </div>
            <div className="form-group">
              <label>Monthly Rent (RM)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Distance from UTM (km)</label>
            <input type="number" step="0.1" value={form.distance} onChange={(e) => setForm({ ...form, distance: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>

        <div className="listing-form-actions">
          <button type="submit" className="btn btn-primary">Save Changes</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(`/listings/${id}`)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
