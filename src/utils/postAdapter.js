/**
 * Post Adapter - Normaliza datos de posts/reports del backend
 * 
 * Convierte el modelo del backend (posts y reports) a un formato
 * consistente que usan todos los componentes de UI (PetCard, PetMap, etc).
 * 
 * Mapeo de campos:
 * - title/nombre: petName
 * - imagen: images[0]
 * - fecha evento: lostOrFoundDate
 * - coordenadas: location.coordinates.latitude/longitude
 * - contacto: contactPhone / contactEmail
 * - tipo estado: type (lost/found)
 * - especie: species (dog/cat/bird/rabbit/other)
 */

/**
 * Convierte un post/report del backend a formato UI estándar
 * @param {Object} backendPost - Post o Report del backend
 * @returns {Object} Post normalizado
 */
export function adaptPost(backendPost) {
  if (!backendPost) return null;

  // Extraer coordenadas
  let latitude, longitude;
  if (backendPost.lat !== undefined) {
    latitude = backendPost.lat;
    longitude = backendPost.lon;
  } else if (backendPost.location?.coordinates) {
    latitude = backendPost.location.coordinates.latitude;
    longitude = backendPost.location.coordinates.longitude;
  }

  // Extraer imagen
  const imageUrl =
    typeof backendPost.imageUrl === 'string'
      ? backendPost.imageUrl
      : backendPost.images?.[0] || backendPost.photo;

  // Extraer fecha del reporte
  const eventDate =
    backendPost.lostOrFoundDate ||
    backendPost.date ||
    backendPost.createdAt ||
    new Date().toISOString();

  // Extraer contacto
  const contactPhone = backendPost.contact || backendPost.contactPhone;
  const contactEmail = backendPost.contactEmail;

  // Extraer ubicación
  let location = '';
  if (typeof backendPost.location === 'string') {
    location = backendPost.location;
  } else if (backendPost.location?.neighborhood || backendPost.location?.city) {
    location = `${backendPost.location.neighborhood || ''}, ${backendPost.location.city || ''}`.trim();
  }

  // Normalizar tipo y especie
  const type = backendPost.type || backendPost.status; // lost/found
  const species = backendPost.species; // dog/cat/bird/rabbit/other
  const petType = backendPost.petType || species; // Para compatibilidad

  return {
    // Identificadores
    id: backendPost.id,
    userId: backendPost.userId,

    // Información del reporte
    petName: backendPost.petName || backendPost.name || 'Sin nombre',
    title: backendPost.petName || backendPost.name, // Alias para title
    description: backendPost.description || '',
    status: backendPost.status || 'active',
    type, // lost o found
    species, // dog, cat, bird, rabbit, other
    breed: backendPost.breed || '',
    color: backendPost.color || '',
    size: backendPost.size || 'medium', // small, medium, large

    // Imagen
    imageUrl,
    image: imageUrl, // Alias
    photo: imageUrl, // Alias para compatibilidad
    images: backendPost.images || (imageUrl ? [imageUrl] : []),

    // Fechas
    eventDate, // Alias
    lostOrFoundDate: eventDate,
    date: eventDate, // Alias
    createdAt: backendPost.createdAt || eventDate,
    updatedAt: backendPost.updatedAt,

    // Ubicación
    location,
    latitude,
    longitude,
    coords: {
      latitude,
      longitude,
    },

    // Contacto
    contact: contactPhone,
    contactPhone,
    contactEmail,

    // Campos adicionales
    isUrgent: backendPost.isUrgent || false,
    views: backendPost.views || 0,

    // Compatibilidad con modelos antiguos
    name: backendPost.petName || backendPost.name,
    petType, // dog/cat/etc
  };
}

/**
 * Convierte múltiples posts a formato UI
 * @param {Array} posts - Array de posts del backend
 * @returns {Array} Array de posts normalizados
 */
export function adaptPosts(posts) {
  if (!Array.isArray(posts)) return [];
  return posts.map(adaptPost);
}

/**
 * Convierte y sumariza posts para listados
 * @param {Object} response - Respuesta de API con { data: [], pagination: {} }
 * @returns {Object} Respuesta normalizada
 */
export function adaptPostsResponse(response) {
  if (!response) return { data: [], pagination: {} };

  return {
    data: adaptPosts(response.data || response),
    pagination: response.pagination || {},
  };
}

export default {
  adaptPost,
  adaptPosts,
  adaptPostsResponse,
};
