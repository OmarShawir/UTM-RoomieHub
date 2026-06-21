import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Footprints, Bike, Car as CarIcon, Navigation, Share2 } from 'lucide-react';
import '../listings/ListingPages.css';

const utmCampus = {
  name: 'UTM Campus',
  position: [1.5582, 103.637],
};

const listings = {
  1: {
    title: 'Cozy Single Room Near UTM',
    location: 'Jalan Skudai, Skudai, Johor Bahru',
    distance: '1.5 km from UTM',
    position: [1.5489, 103.6318],
  },
  2: {
    title: 'Modern Studio',
    location: 'Taman Universiti, Skudai',
    distance: '2 km from UTM',
    position: [1.5332, 103.6296],
  },
  3: {
    title: 'Shared Apartment',
    location: 'Skudai Parade, Skudai',
    distance: '3.5 km from UTM',
    position: [1.5378, 103.6604],
  },
  4: {
    title: 'Premium Room with Parking',
    location: 'Taman Sri Pulai, Skudai',
    distance: '2.2 km from UTM',
    position: [1.5664, 103.6208],
  },
};

const modes = [
  { key: 'walking', label: 'Walking', icon: Footprints, time: '18 min', distance: '1.5 km' },
  { key: 'cycling', label: 'Cycling', icon: Bike, time: '7 min', distance: '1.5 km' },
  { key: 'driving', label: 'Driving', icon: CarIcon, time: '4 min', distance: '1.5 km' },
];

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

export default function GetDirectionsPage() {
  const { id } = useParams();
  const [selectedMode, setSelectedMode] = useState('walking');
  const listing = listings[id] || listings[1];
  const routePositions = [utmCampus.position, listing.position];
  const mapCenter = [
    (utmCampus.position[0] + listing.position[0]) / 2,
    (utmCampus.position[1] + listing.position[1]) / 2,
  ];

  return (
    <div className="page-wrapper" style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>Get Directions</h1>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <MapPin size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 600 }}>{listing.title}</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{listing.location}</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{listing.distance}</div>
          </div>
        </div>
      </div>

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

      <div className="route-map">
        <MapContainer center={mapCenter} zoom={14} scrollWheelZoom className="leaflet-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={routePositions} pathOptions={{ color: '#7B1E1E', weight: 5 }} />
          <Marker position={utmCampus.position} icon={campusIcon}>
            <Popup>{utmCampus.name}</Popup>
          </Marker>
          <Marker position={listing.position} icon={destinationIcon}>
            <Popup>{listing.title}</Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="listing-form-actions">
        <button className="btn btn-primary"><Navigation size={16} /> Start Navigation</button>
        <button className="btn btn-secondary"><Share2 size={16} /> Share Location</button>
      </div>
    </div>
  );
}
