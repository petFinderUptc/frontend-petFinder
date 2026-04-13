/**
 * Utilidades de validación de formularios — PetFinder
 *
 * Todos los mensajes de error están en español y son descriptivos:
 * explican el motivo exacto del error, no solo que el campo es inválido.
 */

import { VALIDATION } from '../constants/appConfig';

/**
 * Valida formato de correo electrónico.
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'El correo electrónico es obligatorio.' };
  }

  if (!VALIDATION.EMAIL_REGEX.test(email)) {
    return {
      isValid: false,
      error: 'El correo no tiene un formato válido. Ejemplo: usuario@dominio.com',
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Valida fortaleza de contraseña.
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'La contraseña es obligatoria.' };
  }

  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      error: `La contraseña debe tener al menos ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres.`,
    };
  }

  if (!/\d/.test(password)) {
    return {
      isValid: false,
      error: 'La contraseña debe contener al menos un número (0-9).',
    };
  }

  if (!/[a-zA-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'La contraseña debe contener al menos una letra.',
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Valida nombre de usuario.
 */
export const validateUsername = (username) => {
  if (!username || username.trim() === '') {
    return { isValid: false, error: 'El nombre de usuario es obligatorio.' };
  }

  if (username.length < VALIDATION.USERNAME_MIN_LENGTH) {
    return {
      isValid: false,
      error: `El nombre de usuario debe tener al menos ${VALIDATION.USERNAME_MIN_LENGTH} caracteres.`,
    };
  }

  if (username.length > VALIDATION.USERNAME_MAX_LENGTH) {
    return {
      isValid: false,
      error: `El nombre de usuario no puede superar los ${VALIDATION.USERNAME_MAX_LENGTH} caracteres.`,
    };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      isValid: false,
      error: 'El nombre de usuario solo puede contener letras, números y guiones bajos (_). No se permiten espacios ni caracteres especiales.',
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Valida número de teléfono.
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'El número de teléfono es obligatorio.' };
  }

  if (!VALIDATION.PHONE_REGEX.test(phone)) {
    return {
      isValid: false,
      error: 'El número de teléfono no es válido. Ingresa solo dígitos, opcionalmente con código de país (+57 300 123 4567).',
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Valida campo requerido genérico.
 * @param {any} value
 * @param {string} fieldLabel - Nombre del campo para el mensaje (ej: "La descripción")
 */
export const validateRequired = (value, fieldLabel = 'Este campo') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, error: `${fieldLabel} es obligatorio.` };
  }

  return { isValid: true, error: '' };
};

/**
 * Valida tamaño de archivo.
 */
export const validateFileSize = (file, maxSize) => {
  if (!file) {
    return { isValid: false, error: 'No se ha seleccionado ningún archivo.' };
  }

  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
    return {
      isValid: false,
      error: `El archivo es demasiado grande. El tamaño máximo permitido es ${maxSizeMB} MB.`,
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Valida tipo de archivo.
 */
export const validateFileType = (file, allowedTypes) => {
  if (!file) {
    return { isValid: false, error: 'No se ha seleccionado ningún archivo.' };
  }

  if (!allowedTypes.includes(file.type)) {
    const readableTypes = allowedTypes
      .map((t) => t.replace('image/', '').toUpperCase())
      .join(', ');
    return {
      isValid: false,
      error: `Tipo de archivo no permitido. Solo se aceptan: ${readableTypes}.`,
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Valida que las contraseñas coincidan.
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Debes confirmar tu contraseña.' };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Las contraseñas no coinciden. Verifica que hayas escrito la misma contraseña en ambos campos.',
    };
  }

  return { isValid: true, error: '' };
};
