import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PUBLIC_ROUTES } from '../constants/routes';
import { toAbsoluteMediaUrl } from '../utils/userAdapter';
import { getSignedUrl } from '../services/storageService';

const BLOB_STORAGE_DOMAIN = '.blob.core.windows.net';
const KNOWN_BLOB_PREFIXES = ['pet-images/', 'reports/', 'posts/', 'avatars/'];
const IMAGE_EXT_REGEX = /\.(jpg|jpeg|png|webp)$/i;

const DEFAULT_CENTER = [5.5353, -73.3678];

const SPECIES_LABEL = {
  dog: 'Perro',
  cat: 'Gato',
  bird: 'Ave',
  rabbit: 'Conejo',
  other: 'Otro',
};

const REPORT_TYPE_LABEL = {
  lost: 'Perdido',
  found: 'Encontrado',
};

const MARKER_COLOR_BY_TYPE = {
  lost: '#dc2626',
  found: '#16a34a',
};

const formatDate = (value) => {
  if (!value) {
    return 'Sin fecha';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Sin fecha';
  }

  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const escapeHtml = (value) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const shouldRequestSignedUrl = (value) => {
  if (!value) {
    return false;
  }

  if (value.includes(BLOB_STORAGE_DOMAIN)) {
    return true;
  }

  if (KNOWN_BLOB_PREFIXES.some((prefix) => value.startsWith(prefix))) {
    return true;
  }

  return IMAGE_EXT_REGEX.test(value) && !value.startsWith('/') && !value.startsWith('data:');
};

const normalizeSignedUrlInput = (value) => {
  if (!value) {
    return value;
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  if (value.includes(BLOB_STORAGE_DOMAIN)) {
    return `https://${value.replace(/^\/+/, '')}`;
  }

  return value;
};

export function PetMap({ reports = [], center = DEFAULT_CENTER, zoom = 12 }) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersLayerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const initialCenter =
      Array.isArray(center) && center.length === 2 ? center : DEFAULT_CENTER;

    const map = L.map(mapContainerRef.current).setView(initialCenter, zoom);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, [center, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    const markersLayer = markersLayerRef.current;

    if (!map || !markersLayer) {
      return;
    }

    markersLayer.clearLayers();

    const validReports = reports.filter(
      (report) =>
        Number.isFinite(Number(report?.lat)) && Number.isFinite(Number(report?.lon)),
    );

    let cancelled = false;

    const renderMarkers = async () => {
      const imageMap = new Map();

      await Promise.all(
        validReports.map(async (report) => {
          const rawImageUrl = typeof report.imageUrl === 'string' ? report.imageUrl.trim() : '';
          if (!rawImageUrl) {
            imageMap.set(report.id, '');
            return;
          }

          const shouldSign = shouldRequestSignedUrl(rawImageUrl);
          if (!shouldSign) {
            imageMap.set(report.id, toAbsoluteMediaUrl(rawImageUrl));
            return;
          }

          const signedUrlInput = normalizeSignedUrlInput(rawImageUrl);

          try {
            const signedUrl = await getSignedUrl(signedUrlInput);
            imageMap.set(report.id, signedUrl || '');
          } catch {
            imageMap.set(report.id, '');
          }
        }),
      );

      if (cancelled) {
        return;
      }

      markersLayer.clearLayers();

      validReports.forEach((report) => {
      const lat = Number(report.lat);
      const lon = Number(report.lon);
      const markerColor = MARKER_COLOR_BY_TYPE[report.type] || '#0284c7';

      const marker = L.circleMarker([lat, lon], {
        radius: 8,
        color: '#ffffff',
        weight: 2,
        fillColor: markerColor,
        fillOpacity: 0.95,
      }).addTo(markersLayer);

      const reportUrl = PUBLIC_ROUTES.PET_DETAIL.replace(':id', report.id);
      const speciesLabel = SPECIES_LABEL[report.species] || report.species || 'Mascota';
      const reportTypeLabel = REPORT_TYPE_LABEL[report.type] || report.type || 'Reporte';
      const description = report.description || 'Sin descripción';
      const dateLabel = formatDate(report.createdAt || report.updatedAt);
      const locationLabel = `Lat ${lat.toFixed(4)}, Lon ${lon.toFixed(4)}`;

      const safeDescription = escapeHtml(description);
      const safeSpecies = escapeHtml(speciesLabel);
      const safeType = escapeHtml(reportTypeLabel);
      const safeDate = escapeHtml(dateLabel);
      const safeLocation = escapeHtml(locationLabel);
      const safeReportUrl = escapeHtml(reportUrl);

      const imageUrl = imageMap.get(report.id) || '';
      const imageSection = imageUrl
        ? `<img src="${escapeHtml(imageUrl)}" alt="Reporte ${escapeHtml(report.id)}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:8px;" />`
        : '';

      const popupContent = `
        <div style="min-width:220px;max-width:240px;">
          ${imageSection}
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;">
            <strong style="font-size:14px;">${safeSpecies}</strong>
            <span style="font-size:12px;padding:2px 8px;border-radius:999px;background:#eef2ff;color:#1e3a8a;">${safeType}</span>
          </div>
          <p style="font-size:12px;color:#334155;margin:0 0 8px;line-height:1.4;">${safeDescription}</p>
          <p style="font-size:12px;color:#64748b;margin:0 0 4px;">Ubicación: ${safeLocation}</p>
          <p style="font-size:12px;color:#64748b;margin:0 0 8px;">Fecha: ${safeDate}</p>
          <a href="${safeReportUrl}" style="font-size:12px;font-weight:600;color:#2563eb;text-decoration:none;">Ver detalle</a>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 260,
        className: 'custom-popup',
      });
      });

      if (validReports.length > 0) {
        const bounds = L.latLngBounds(validReports.map((report) => [Number(report.lat), Number(report.lon)]));
        map.fitBounds(bounds, { padding: [24, 24], maxZoom: 14 });
      }
    };

    void renderMarkers();

    return () => {
      cancelled = true;
    };
  }, [reports]);

  return <div ref={mapContainerRef} className="w-full h-[420px] rounded-lg border" />;
}
