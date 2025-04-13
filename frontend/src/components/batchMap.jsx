import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { locationCoordinates } from "./locationMapping";

// Custom icon for the markers
const icon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [25, 25],
});

// Component to automatically adjust map bounds based on positions
const FitBounds = ({ positions }) => {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(positions.map(p => [p.coords.lat, p.coords.lng]));
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [positions, map]);

  return null;
};

const BatchMap = ({ custodyHistory }) => {
  const [validSteps, setValidSteps] = useState([]);

  useEffect(() => {
    const filteredSteps = custodyHistory
      .filter(record => record.location && locationCoordinates[record.location])
      .map(record => ({
        coords: locationCoordinates[record.location],
        location: record.location,
        reason: record.reason,
        timestamp: record.timestamp,
      }));

    setValidSteps(filteredSteps);
  }, [custodyHistory]);

  if (validSteps.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        No location data available to display.
      </p>
    );
  }

  return (
    <MapContainer
      center={[20.5937, 78.9629]} // Default center (India)
      zoom={5}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <FitBounds positions={validSteps} />

      {validSteps.map((step, idx) => (
        <Marker key={idx} position={[step.coords.lat, step.coords.lng]} icon={icon}>
          <Popup>
            <strong>Step {idx + 1}</strong><br />
            Location: {step.location}<br />
            Reason: {step.reason}<br />
            Time: {new Date(step.timestamp * 1000).toLocaleString()}
          </Popup>
        </Marker>
      ))}

      <Polyline
        positions={validSteps.map(step => [step.coords.lat, step.coords.lng])}
        color="green"
      />
    </MapContainer>
  );
};

export default BatchMap;
