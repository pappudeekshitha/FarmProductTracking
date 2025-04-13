// src/components/MapView.js

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = ({ position, onLocationChange }) => {
  const [markerPosition, setMarkerPosition] = useState(position);

  // Update when user drags the marker
  const handleDragEnd = (e) => {
    const newPos = e.target.getLatLng();
    setMarkerPosition([newPos.lat, newPos.lng]);
    onLocationChange([newPos.lat, newPos.lng]);
  };

  return (
    <MapContainer center={markerPosition} zoom={5} scrollWheelZoom={true} style={{ height: '300px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={markerPosition}
        draggable={true}
        eventHandlers={{ dragend: handleDragEnd }}
      >
        <Popup>Farmer's Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;