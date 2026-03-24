import apiClient from './api/apiClient';

// In-memory cache para Signed URLs
const signedUrlCache = new Map();
const CACHE_TTL_MS = 50 * 60 * 1000; // 50 minutos

/**
 * Obtiene una URL firmada (SAS) para un blob específico de Azure Blob Storage
 * Cachea resultados para evitar requests repetidos
 * @param {string} blobName - Nombre del blob incluyendo ruta (ej: pet-images/reports/abc123.jpg)
 * @returns {Promise<string>} URL firmada lista para descargar/ver sin autenticación
 */
export const getSignedUrl = async (blobName) => {
  if (!blobName) {
    throw new Error('blobName es requerido');
  }

  // Verificar cache
  const cached = signedUrlCache.get(blobName);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.signedUrl;
  }

  try {
    const response = await apiClient.get('/storage/signed-url', {
      params: { blobName },
    });

    const signedUrl = response.data.signedUrl;
    
    // Guardar en cache con expiración
    signedUrlCache.set(blobName, {
      signedUrl,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return signedUrl;
  } catch (error) {
    console.error(`Error obteniendo signed URL para ${blobName}:`, error);
    throw error;
  }
};

/**
 * Limpia cache de URLs firmadas (útil en logout o reset)
 */
export const clearSignedUrlCache = () => {
  signedUrlCache.clear();
};

export default {
  getSignedUrl,
  clearSignedUrlCache,
};
