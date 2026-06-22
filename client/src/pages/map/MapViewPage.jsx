import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Home, MapPin, Navigation, X } from 'lucide-react';
import '../listings/ListingPages.css';

const utmCampus = {
  name: 'UTM Campus',
  position: [1.5582, 103.637],
};

const listings = [
  {
    id: 1,
    title: 'Cozy Single Room Near UTM',
    location: 'Jalan Skudai, Skudai',
    price: 550,
    type: 'Single Room',
    position: [1.5489, 103.6318],
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=240&fit=crop',
  },
  {
    id: 2,
    title: 'Modern Studio',
    location: 'Taman Universiti',
    price: 750,
    type: 'Studio',
    position: [1.5332, 103.6296],
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=240&fit=crop',
  },
  {
    id: 3,
    title: 'Shared Apartment',
    location: 'Skudai Parade',
    price: 450,
    type: 'Double Room',
    position: [1.5378, 103.6604],
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=240&fit=crop',
  },
  {
    id: 4,
    title: 'Premium Room with Parking',
    location: 'Taman Sri Pulai',
    price: 1200,
    type: 'Single Room',
    position: [1.5664, 103.6208],
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=240&fit=crop',
  },
];

const campusIcon = L.divIcon({
  className: '',
  html: '<div class="leaflet-campus-marker">UTM Campus</div>',
  iconSize: [110, 32],
  iconAnchor: [55, 16],
});

const createPriceIcon = (price) => L.divIcon({
  className: '',
  html: `<div class="leaflet-price-marker">RM ${price}</div>`,
  iconSize: [72, 32],
  iconAnchor: [36, 16],
});

function FlyToSelected({ selected }) {
  const map = useMap();

  useEffect(() => {
    if (selected) {
      map.flyTo(selected.position, 15, { duration: 0.5 });
    }
  }, [map, selected]);

  return null;
}

export default function MapViewPage() {
  const [selected, setSelected] = useState(listings[0]);

  return (
    <div className="page-wrapper">
      <div className="search-header">
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Map View</h1>
        <Link to="/search" className="btn btn-secondary">Back to List View</Link>
      </div>

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
          <div className="map-banner"><Home size={14} /> Showing {listings.length} listings near UTM</div>
        </div>

        {selected && (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={selected.image}
                alt={selected.title}
                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }}
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
    </div>
  );
}
