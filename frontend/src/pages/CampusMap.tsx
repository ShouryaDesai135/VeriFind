import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { where } from "firebase/firestore";

// Safe zones on campus
const safeZones = [
  { name: "Library Help Desk", lat: 18.4644, lng: 73.8694 },
  { name: "Admin Office", lat: 18.4630, lng: 73.8682 },
];

// SVG pin
const markerSvg = (color: string) => `
<svg width="30" height="30" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
</svg>
`;

// Marker factory
const getIcon = (color: string) =>
  L.divIcon({
    html: markerSvg(color),
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

export default function CampusMap() {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "items"), where("status", "!=", "resolved"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <MapContainer
      center={[18.4639, 73.8683]} // VIT Pune
      zoom={17}
      className="h-screen w-full"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />

      {/* ITEM PINS */}
      {items.filter(i => i.lat && i.lng).map((item) => {
        const color =
          item.status === "available"
            ? "#22c55e"
            : item.status === "claimed"
            ? "#f97316"
            : "#9ca3af";

        return (
          <Marker
            key={item.id}
            position={[item.lat, item.lng]}
            icon={getIcon(color)}
          >
            <Popup closeButton={false}>
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/items?item=${item.id}`)}
              >
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm">{item.location}</p>
                <p className="text-xs mt-1" style={{ color }}>
                  {item.status.toUpperCase()}
                </p>
                <p className="text-xs mt-2 text-primary">
                  Click to view →
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* SAFE ZONES */}
      {safeZones.map((zone) => (
        <Marker
          key={zone.name}
          position={[zone.lat, zone.lng]}
          icon={getIcon("#3b82f6")}
        >
          <Popup closeButton={false}>
            <p className="font-semibold">🛡 Safe Exchange Zone</p>
            <p className="text-sm">{zone.name}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
