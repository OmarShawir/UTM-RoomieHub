import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Home, MapPin, Navigation, X } from 'lucide-react';
import api from '../../services/api';
import { DEFAULT_LISTING_IMAGE } from '../../utils/defaults';
import '../listings/ListingPages.css';

const utmCampus = {
  name: 'UTM Campus',
  position: [1.5582, 103.637],
};

const campusIcon = L.divIcon({
  className: '',
  html: '<div class="leaflet-campus-marker">UTM Campus</div>',
  iconSize: [110, 32],
  iconAnchor: [55, 16],
});

const createPriceIcon = (price) => L.divIcon({
  className: '',
  html: `<div class="leaflet-price-marker">RM ${Math.round(price)}</div>`,
  iconSize: [72, 32],
  iconAnchor: [36, 16],
});

function FlyToSelected({ selected }) {
  const map = useMap();
  useEffect(() => {
    if (selected?.position) {
      map.flyTo(selected.position, 15, { duration: 0.5 });
    }
  }, [map, selected]);
  return null;
}

export default function MapViewPage() {
  const [listings, setListings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/listings?limit=50');
        if (res.data.success) {
          // Only show listings that have GPS coordinates
          const withCoords = (res.data.listings || []).filter(
            (l) => l.latitude && l.longitude
          ).map((l) => ({
            id: l.id,
            title: l.title,
            location: l.location,
            price: l.price,
            type: l.room_type,
            position: [parseFloat(l.latitude), parseFloat(l.longitude)],
            image: l.cover_photo || DEFAULT_LISTING_IMAGE,
          }));
          setListings(withCoords);
          if (withCoords.length > 0) setSelected(withCoords[0]);
        }
      } catch (err) {
        console.error('Failed to load listings for map:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="search-header">
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Map View</h1>
        <Link to="/search" className="btn btn-secondary">Back to List View</Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-secondary)' }}>Loading map...</div>
      ) : (
        <div className="map-layout">
          <div className="real-map">
            <MapContainer center={utmCampus.position} zoom={14} scrollWheelZoom className="leaflet-map">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FlyToSelected selected={selected} />
              <Marker position={utmCampus.position} icon={campusIcon}>
                <Popup>{utmCampus.name}</Popup>
              </Marker>
              {listings.map((listing) => (
                <Marker
                  key={listing.id}
                  position={listing.position}
                  icon={createPriceIcon(listing.price)}
                  eventHandlers={{ click: () => setSelected(listing) }}
                >
                  <Popup>
                    <strong>{listing.title}</strong>
                    <br />
                    {listing.location}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            <div className="map-banner">
              <Home size={14} />
              {listings.length > 0
                ? `Showing ${listings.length} listing${listings.length !== 1 ? 's' : ''} near UTM`
                : 'No listings with GPS coordinates found'}
            </div>
          </div>

          {selected && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={selected.image}
                  alt={selected.title}
                  style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = DEFAULT_LISTING_IMAGE; }}
                />
                <button
                  onClick={() => setSelected(null)}
                  style={{ position: 'absolute', top: 8, right: 8, background: '#fff', border: 'none', borderRadius: '50%', width: 28, height: 28 }}
                >
                  <X size={14} />
                </button>
              </div>
              <div className="listing-card-body">
                <span className="badge badge-info" style={{ marginBottom: 6 }}>{selected.type}</span>
                <div className="listing-card-title">{selected.title}</div>
                <div className="listing-card-location"><MapPin size={13} /> {selected.location}</div>
                <div className="listing-card-price">RM {selected.price}<span>/month</span></div>
                <Link to={`/listings/${selected.id}`} className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>View Details</Link>
                <Link to={`/directions/${selected.id}`} className="btn btn-secondary" style={{ width: '100%', marginTop: 8 }}>
                  <Navigation size={14} /> Get Directions
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
