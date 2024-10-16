"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  center: [number, number];
}

const MapComponent: React.FC<MapComponentProps> = ({ center }) => {
  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "200px", width: "100%", zIndex: 1 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={center} icon={DefaultIcon}>
        <Popup>Disponible solo en Ibagué, Tolima.</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
