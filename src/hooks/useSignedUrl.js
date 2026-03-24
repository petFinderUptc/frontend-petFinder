import { useEffect, useState } from 'react';
import { getSignedUrl } from '../services/storageService';

const BLOB_STORAGE_DOMAIN = '.blob.core.windows.net';

/**
 * Hook React para convertir automáticamente URLs de Blob Storage público a URLs firmadas
 * @param {string} imageUrl - URL de la imagen (puede ser URL pública de Blob Storage)
 * @returns {string} URL firmada lista para usar, o función para manejar error, o URL original si no es blob
 */
export const useSignedUrl = (imageUrl) => {
  const [signedUrl, setSignedUrl] = useState(imageUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!imageUrl) {
      setSignedUrl('');
      return;
    }

    // Si no es una URL de Blob Storage, retornar como está
    if (!imageUrl.includes(BLOB_STORAGE_DOMAIN)) {
      setSignedUrl(imageUrl);
      return;
    }

    // Extraer blobName de la URL
    const blobName = extractBlobName(imageUrl);
    if (!blobName) {
      setSignedUrl(imageUrl);
      return;
    }

    // Obtener URL firmada
    const fetchSignedUrl = async () => {
      setLoading(true);
      setError(null);
      try {
        const signed = await getSignedUrl(blobName);
        setSignedUrl(signed);
      } catch (err) {
        console.error('Error obteniendo signed URL:', err);
        setError(err);
        // Fallback a URL original en caso de error
        setSignedUrl(imageUrl);
      } finally {
        setLoading(false);
      }
    };

    fetchSignedUrl();
  }, [imageUrl]);

  return signedUrl;
};

/**
 * Hook React que retorna { signedUrl, loading, error } para mayor control
 */
export const useMediaUrl = (imageUrl) => {
  const signedUrl = useSignedUrl(imageUrl);
  return signedUrl;
};

/**
 * Extrae el nombre del blob de una URL completa de Azure Blob Storage
 * Ej: https://petfinderimg.blob.core.windows.net/pet-images/reports/abc123.jpg → pet-images/reports/abc123.jpg
 */
function extractBlobName(url) {
  try {
    if (!url) return null;
    
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Remove leading slash and extract everything after container name
    const parts = pathname.split('/').filter(Boolean);
    
    if (parts.length < 1) return null;
    
    // Skip the container name and return the rest as blob name
    // Format: /container-name/blob/name/path → container-name/blob/name/path
    return parts.join('/');
  } catch (error) {
    console.error('Error extracting blob name:', error);
    return null;
  }
}

export default useMediaUrl;
