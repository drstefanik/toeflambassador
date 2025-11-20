"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

export interface CenterPoint {
  id: string;
  name: string;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface Props {
  centers: CenterPoint[];
  onSelect?: (id: string) => void;
}

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function AutoFit({ centers }: { centers: CenterPoint[] }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(
      centers
        .filter((center) => center.latitude && center.longitude)
        .map((center) => [center.latitude!, center.longitude!])
    );
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.2));
    }
  }, [centers, map]);
  return null;
}

export function CentersMap({ centers, onSelect }: Props) {
  const defaultPosition: [number, number] = [41.9028, 12.4964];

  return (
    <MapContainer
      center={defaultPosition}
      zoom={5}
      scrollWheelZoom={false}
      className="h-96 w-full rounded-2xl"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <AutoFit centers={centers} />
      {centers.map((center) =>
        center.latitude && center.longitude ? (
          <Marker
            key={center.id}
            position={[center.latitude, center.longitude]}
            icon={markerIcon}
            eventHandlers={{
              click: () => onSelect?.(center.id),
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{center.name}</p>
                {center.city && <p>{center.city}</p>}
              </div>
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}
