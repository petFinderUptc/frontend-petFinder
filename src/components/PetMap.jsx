import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';

export function PetMap({ pets, center = [5.5353, -73.3678], zoom = 13, selectedPet = null }) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView(
      selectedPet ? [selectedPet.latitude, selectedPet.longitude] : center,
      zoom
    );

    mapRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Create custom marker icons
    const createCustomIcon = (pet) => {
      const iconColor = pet.isUrgent 
        ? 'background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);'
        : pet.status === 'found' 
          ? 'background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);'
          : 'background: linear-gradient(135deg, #33c3f0 0%, #1e88e5 100%);';
      
      const iconHtml = `
        <div style="position: relative; width: 30px; height: 30px;">
          <div style="
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            ${iconColor}
            position: absolute;
            transform: rotate(-45deg);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          ">
            <div style="
              content: '';
              width: 20px;
              height: 20px;
              margin: 5px 0 0 5px;
              background: #fff;
              position: absolute;
              border-radius: 50%;
            "></div>
          </div>
        </div>
      `;
      
      return L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      });
    };

    // Add markers
    pets.forEach((pet) => {
      const marker = L.marker([pet.latitude, pet.longitude], {
        icon: createCustomIcon(pet),
      }).addTo(map);

      const statusLabels = {
        lost: 'Perdido',
        found: 'Encontrado',
      };

      const statusColors = {
        lost: 'background-color: #fee2e2; color: #991b1b; border: 1px solid #fecaca;',
        found: 'background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0;',
      };

      const popupContent = `
        <div style="min-width: 200px;">
          <a href="/mascota/${pet.id}" style="display: block; text-decoration: none; color: inherit;">
            <img 
              src="${pet.photo}" 
              alt="${pet.name || 'Mascota'}" 
              style="width: 100%; height: 128px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;"
            />
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px;">
              <h3 style="font-weight: bold; font-size: 16px; margin: 0;">
                ${pet.name || `${pet.type === 'dog' ? 'Perro' : 'Gato'} sin nombre`}
              </h3>
              <span style="
                font-size: 12px;
                padding: 2px 8px;
                border-radius: 4px;
                ${statusColors[pet.status]}
              ">
                ${statusLabels[pet.status]}
              </span>
            </div>
            <p style="font-size: 14px; color: #4b5563; margin: 0 0 8px 0;">
              ${pet.breed} • ${pet.color}
            </p>
            <div style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: #6b7280; margin-bottom: 4px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${pet.location}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: #6b7280; margin-bottom: 8px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>
                ${new Date(pet.date).toLocaleDateString('es-ES', { 
                  day: 'numeric',
                  month: 'short'
                })}
              </span>
            </div>
            <div style="font-size: 12px; color: #2563eb; font-weight: 500;">
              Ver detalles →
            </div>
          </a>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 250,
        className: 'custom-popup',
      });
    });

    // Cleanup
    return () => {
      map.remove();
    };
  }, [pets, center, zoom, selectedPet]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}
