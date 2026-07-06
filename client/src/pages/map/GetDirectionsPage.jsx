import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Footprints, Bike, Car as CarIcon, Navigation, Share2, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
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

const destinationIcon = L.divIcon({
  className: '',
  html: '<div class="leaflet-destination-marker">Room</div>',
  iconSize: [62, 32],
  iconAnchor: [31, 16],
});

// Haversine formula to calculate distance between two GPS points in km
function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function estimateTravel(distanceKm) {
  const walkSpeed = 5;   // km/h
  const bikeSpeed = 15;  // km/h
  const carSpeed = 40;   // km/h
  const fmt = (mins) => mins < 60 ? `${Math.round(mins)} min` : `${Math.floor(mins / 60)}h ${Math.round(mins % 60)}m`;
  return [
    { key: 'walking', label: 'Walking', icon: Footprints, time: fmt((distanceKm / walkSpeed) * 60), distance: `${distanceKm.toFixed(1)} km` },
    { key: 'cycling', label: 'Cycling', icon: Bike, time: fmt((distanceKm / bikeSpeed) * 60), distance: `${distanceKm.toFixed(1)} km` },
    { key: 'driving', label: 'Driving', icon: CarIcon, time: fmt((distanceKm / carSpeed) * 60), distance: `${distanceKm.toFixed(1)} km` },
  ];
}

export default function GetDirectionsPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMode, setSelectedMode] = useState('walking');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/listings/${id}`);
        if (res.data.success !== false) {
          setListing(res.data.listing);
        } else {
          setError('Listing not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load listing.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="page-wrapper" style={{ textAlign: 'center', padding: '40px 0' }}>Loading directions...</div>;
  if (error) return <div className="page-wrapper" style={{ color: '#991b1b', background: '#fef2f2', padding: 16, borderRadius: 8 }}>{error}</div>;
  if (!listing) return <div className="page-wrapper">Listing not found.</div>;

  const hasCoords = listing.latitude && listing.longitude;
  const listingPos = hasCoords
    ? [parseFloat(listing.latitude), parseFloat(listing.longitude)]
    : null;

  const distanceKm = hasCoords
    ? haversineKm(utmCampus.position[0], utmCampus.position[1], listingPos[0], listingPos[1])
    : listing.distance_from_campus || 0;

  const modes = estimateTravel(distanceKm);

  const mapCenter = listingPos
    ? [(utmCampus.position[0] + listingPos[0]) / 2, (utmCampus.position[1] + listingPos[1]) / 2]
    : utmCampus.position;

  const routePositions = listingPos ? [utmCampus.position, listingPos] : null;

  const handleStartNavigation = () => {
    if (listingPos) {
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${utmCampus.position[0]},${utmCampus.position[1]}&destination=${listingPos[0]},${listingPos[1]}&travelmode=${selectedMode === 'cycling' ? 'bicycling' : selectedMode}`, '_blank');
    }
  };

  const handleShareLocation = () => {
    if (listingPos) {
      const url = `https://www.google.com/maps?q=${listingPos[0]},${listingPos[1]}`;
      if (navigator.share) {
        navigator.share({ title: listing.title, text: `Directions to ${listing.title}`, url });
      } else {
        navigator.clipboard.writeText(url);
        alert('Location link copied to clipboard!');
      }
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>Get Directions</h1>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <MapPin size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 600 }}>{listing.title}</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{listing.address}</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              {distanceKm > 0 ? `${distanceKm.toFixed(1)} km from UTM` : 'Distance unavailable'}
            </div>
          </div>
        </div>
      </div>

      {!hasCoords && (
        <div style={{ background: '#fffbeb', color: '#92400e', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 13 }}>
          ⚠ This listing doesn't have GPS coordinates pinned. The map route cannot be shown. Ask the owner to update the listing with a map pin.
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Choose Transportation Mode</h3>
        {modes.map((mode) => {
          const Icon = mode.icon;
          const active = selectedMode === mode.key;
          return (
            <div
              key={mode.key}
              className="directions-mode-card"
              style={active ? { borderColor: 'var(--color-primary)', background: 'rgba(123,30,30,0.04)' } : {}}
              onClick={() => setSelectedMode(mode.key)}
            >
              <div className="directions-mode-row">
                <div className="directions-mode-icon"><Icon size={18} /></div>
                <div>
                  <div className="directions-mode-title">{mode.label}</div>
                  <div className="directions-mode-sub">{mode.time} • {mode.distance}</div>
                </div>
              </div>
              <Navigation size={16} color="var(--color-text-secondary)" />
            </div>
          );
        })}
      </div>

      {hasCoords && (
        <div className="route-map">
          <MapContainer center={mapCenter} zoom={14} scrollWheelZoom className="leaflet-map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {routePositions && <Polyline positions={routePositions} pathOptions={{ color: '#7B1E1E', weight: 5 }} />}
            <Marker position={utmCampus.position} icon={campusIcon}>
              <Popup>{utmCampus.name}</Popup>
            </Marker>
            <Marker position={listingPos} icon={destinationIcon}>
              <Popup>{listing.title}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      <div className="listing-form-actions">
        {hasCoords && (
          <>
            <button className="btn btn-primary" onClick={handleStartNavigation}>
              <Navigation size={16} /> Open in Google Maps
            </button>
            <button className="btn btn-secondary" onClick={handleShareLocation}>
              <Share2 size={16} /> Share Location
            </button>
          </>
        )}
        <Link to={`/listings/${id}`} className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Listing
        </Link>
      </div>
    </div>
  );
}
