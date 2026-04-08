import { useEffect, useState } from 'react';
import { getSignedUrl } from '../services/storageService';

const BLOB_STORAGE_DOMAIN = '.blob.core.windows.net';
const KNOWN_BLOB_PREFIXES = ['pet-images/', 'reports/', 'posts/', 'avatars/'];
const IMAGE_EXT_REGEX = /\.(jpg|jpeg|png|webp)$/i;

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
    const rawImageUrl = typeof imageUrl === 'string' ? imageUrl.trim() : '';

    if (!rawImageUrl) {
      setSignedUrl('');
      return;
    }

    const shouldSign = shouldRequestSignedUrl(rawImageUrl);
    if (!shouldSign) {
      setSignedUrl(rawImageUrl);
      return;
    }

    const signedUrlInput = normalizeSignedUrlInput(rawImageUrl);

    // Obtener URL firmada
    const fetchSignedUrl = async () => {
      setLoading(true);
      setError(null);
      try {
        const signed = await getSignedUrl(signedUrlInput);
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

function shouldRequestSignedUrl(value) {
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
}

function normalizeSignedUrlInput(value) {
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
}
