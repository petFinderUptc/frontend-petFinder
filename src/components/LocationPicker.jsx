import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = L.divIcon({
  className: 'petfinder-location-marker',
  html: `
    <div style="
      width: 18px;
      height: 18px;
      border-radius: 999px;
      background: #0284c7;
      border: 2px solid #ffffff;
      box-shadow: 0 2px 10px rgba(2, 132, 199, 0.45);
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
  defaultCenter = [5.5353, -73.3678],
  zoom = 13,
}) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const containerRef = useRef(null);
  const onLocationChangeRef = useRef(onLocationChange);

  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const initialCenter =
      typeof latitude === 'number' && typeof longitude === 'number'
        ? [latitude, longitude]
        : defaultCenter;

    const map = L.map(containerRef.current, {
      zoomControl: true,
    }).setView(initialCenter, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    map.on('click', (event) => {
      const nextLat = Number(event.latlng.lat.toFixed(6));
      const nextLon = Number(event.latlng.lng.toFixed(6));
      placeMarker(nextLat, nextLon, map, markerRef, onLocationChangeRef);
      onLocationChangeRef.current?.({ lat: nextLat, lon: nextLon, source: 'map-click' });
    });

    mapRef.current = map;

    if (typeof latitude === 'number' && typeof longitude === 'number') {
      placeMarker(latitude, longitude, map, markerRef, onLocationChangeRef);
    }

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [defaultCenter, latitude, longitude, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    if (typeof latitude === 'number' && typeof longitude === 'number') {
      placeMarker(latitude, longitude, map, markerRef, onLocationChangeRef);
      map.panTo([latitude, longitude], {
        animate: true,
        duration: 0.25,
      });
    }
  }, [latitude, longitude]);

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="h-56 w-full overflow-hidden rounded-lg border" />
      <p className="text-xs text-muted-foreground">
        Haz clic en el mapa o arrastra el pin para ajustar la ubicación exacta.
      </p>
    </div>
  );
}

function placeMarker(lat, lon, map, markerRef, onLocationChangeRef) {
  if (!markerRef.current) {
    const marker = L.marker([lat, lon], {
      draggable: true,
      icon: markerIcon,
    }).addTo(map);

    marker.on('dragend', () => {
      const coords = marker.getLatLng();
      onLocationChangeRef.current?.({
        lat: Number(coords.lat.toFixed(6)),
        lon: Number(coords.lng.toFixed(6)),
        source: 'map-drag',
      });
    });

    markerRef.current = marker;
    return;
  }

  markerRef.current.setLatLng([lat, lon]);
}
