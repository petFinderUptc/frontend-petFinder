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

/**
 * Valida número de teléfono colombiano.
 * Acepta:
 *   - Celular: 3XXXXXXXXX (10 dígitos, empieza en 3)
 *   - Celular con código: +573XXXXXXXXX o 573XXXXXXXXX
 *   - Fijo: [1-8]XXXXXXX (7-8 dígitos) o con código +57
 * Permite espacios, guiones y paréntesis como separadores.
 */
export const validateColombianPhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'El número de teléfono es obligatorio.' };
  }

  // Eliminar espacios, guiones y paréntesis para validar solo dígitos
  const digits = phone.replace(/[\s\-().]/g, '');

  // Con código de país +57 o 57
  const withCode = /^(\+?57)(3\d{9}|[1-8]\d{6,7})$/.test(digits);
  // Sin código: celular 10 dígitos empieza en 3, o fijo 7-8 dígitos
  const withoutCode = /^3\d{9}$/.test(digits) || /^[1-8]\d{6,7}$/.test(digits);

  if (!withCode && !withoutCode) {
    return {
      isValid: false,
      error:
        'Número inválido. Ingresa un celular colombiano (ej: 310 123 4567) o fijo con indicativo (ej: 608 123 4567).',
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Valida el campo de contacto de un reporte.
 * Acepta teléfono colombiano O correo electrónico.
 */
export const validateContact = (contact) => {
  if (!contact || contact.trim() === '') {
    return { isValid: false, error: 'El contacto es obligatorio.' };
  }

  if (contact.trim().length > 100) {
    return { isValid: false, error: 'El contacto no puede superar los 100 caracteres.' };
  }

  const value = contact.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (isEmail) return { isValid: true, error: '' };

  const digits = value.replace(/[\s\-().]/g, '');
  const isColombianPhone =
    /^(\+?57)?(3\d{9}|[1-8]\d{6,7})$/.test(digits);
  if (isColombianPhone) return { isValid: true, error: '' };

  return {
    isValid: false,
    error:
      'Ingresa un número de teléfono colombiano (ej: 310 123 4567) o un correo electrónico válido.',
  };
};

/**
 * Valida nombre propio (nombre, apellido).
 * Solo letras, acentos, espacios y guiones. Entre 2 y 50 caracteres.
 */
export const validatePersonName = (value, fieldLabel = 'El nombre') => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldLabel} es obligatorio.` };
  }

  const trimmed = value.trim();

  if (trimmed.length < 2) {
    return { isValid: false, error: `${fieldLabel} debe tener al menos 2 caracteres.` };
  }

  if (trimmed.length > 50) {
    return { isValid: false, error: `${fieldLabel} no puede superar los 50 caracteres.` };
  }

  if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s\-']+$/.test(trimmed)) {
    return {
      isValid: false,
      error: `${fieldLabel} solo puede contener letras, espacios y guiones. No se permiten números ni símbolos.`,
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Valida campo de color de mascota.
 * Solo letras, espacios, comas y guiones. Entre 2 y 50 caracteres.
 */
export const validateColor = (color) => {
  if (!color || color.trim() === '') {
    return { isValid: false, error: 'El color es obligatorio.' };
  }

  const trimmed = color.trim();

  if (trimmed.length < 2) {
    return { isValid: false, error: 'El color debe tener al menos 2 caracteres.' };
  }

  if (trimmed.length > 50) {
    return { isValid: false, error: 'El color no puede superar los 50 caracteres.' };
  }

  if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s,\-/]+$/.test(trimmed)) {
    return {
      isValid: false,
      error: 'El color solo puede contener letras. Ej: "negro", "blanco y café".',
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Valida campo de raza de mascota.
 * Letras, espacios, guiones y apóstrofes. Entre 2 y 60 caracteres.
 */
export const validateBreed = (breed) => {
  if (!breed || breed.trim() === '') {
    return { isValid: false, error: 'La raza es obligatoria.' };
  }

  const trimmed = breed.trim();

  if (trimmed.length < 2) {
    return { isValid: false, error: 'La raza debe tener al menos 2 caracteres.' };
  }

  if (trimmed.length > 60) {
    return { isValid: false, error: 'La raza no puede superar los 60 caracteres.' };
  }

  if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s\-']+$/.test(trimmed)) {
    return {
      isValid: false,
      error: "La raza solo puede contener letras y guiones. Ej: \"Golden Retriever\", \"mestizo\".",
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Valida descripción de reporte.
 * Entre 10 y 500 caracteres.
 */
export const validateDescription = (description) => {
  if (!description || description.trim() === '') {
    return { isValid: false, error: 'La descripción es obligatoria.' };
  }

  const trimmed = description.trim();

  if (trimmed.length < 10) {
    return {
      isValid: false,
      error: `La descripción debe tener al menos 10 caracteres. Actualmente: ${trimmed.length}.`,
    };
  }

  if (trimmed.length > 500) {
    return {
      isValid: false,
      error: `La descripción no puede superar los 500 caracteres. Actualmente: ${trimmed.length}.`,
    };
  }

  return { isValid: true, error: '' };
};
