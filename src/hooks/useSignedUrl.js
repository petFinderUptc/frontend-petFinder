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

    // Obtener URL firmada
    const fetchSignedUrl = async () => {
      setLoading(true);
      setError(null);
      try {
        const signed = await getSignedUrl(imageUrl);
        setSignedUrl(signed);
      } catch (err) {
        console.error('Error obteniendo signed URL:', err);
        setError(err);
        // En storage privado, un fallback directo a la URL cruda produce 409.
        setSignedUrl('');
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

export default useMediaUrl;
