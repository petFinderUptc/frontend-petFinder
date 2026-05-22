import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDate,
  formatRelativeTime,
  truncateText,
  capitalize,
  deepClone,
  generateId,
  isEmptyObject,
  formatFileSize,
  calculateDistance,
  getInitials,
  parseQueryString,
  buildQueryString,
} from './helpers';

describe('formatDate', () => {
  it('should return empty string for null', () => {
    expect(formatDate(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(formatDate(undefined)).toBe('');
  });

  it('should format a date string', () => {
    const result = formatDate(new Date(2025, 0, 15), 'es-CO');
    expect(result).toContain('2025');
    expect(result).toContain('15');
  });

  it('should format a Date object', () => {
    const result = formatDate(new Date('2025-06-01'), 'en-US');
    expect(result).toContain('2025');
  });
});

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-01T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return empty string for null', () => {
    expect(formatRelativeTime(null)).toBe('');
  });

  it('should return "hace un momento" for < 60 seconds ago', () => {
    const date = new Date('2025-06-01T11:59:30Z');
    expect(formatRelativeTime(date)).toBe('hace un momento');
  });

  it('should return singular minute for 1 minute ago', () => {
    const date = new Date('2025-06-01T11:59:00Z');
    expect(formatRelativeTime(date)).toBe('hace 1 minuto');
  });

  it('should return plural minutes for > 1 minute ago', () => {
    const date = new Date('2025-06-01T11:55:00Z');
    expect(formatRelativeTime(date)).toBe('hace 5 minutos');
  });

  it('should return singular hour for 1 hour ago', () => {
    const date = new Date('2025-06-01T11:00:00Z');
    expect(formatRelativeTime(date)).toBe('hace 1 hora');
  });

  it('should return "ayer" for 1 day ago', () => {
    const date = new Date('2025-05-31T12:00:00Z');
    expect(formatRelativeTime(date)).toBe('ayer');
  });

  it('should return days for < 7 days ago', () => {
    const date = new Date('2025-05-28T12:00:00Z');
    expect(formatRelativeTime(date)).toBe('hace 4 días');
  });

  it('should return weeks for < 30 days ago', () => {
    const date = new Date('2025-05-18T12:00:00Z');
    expect(formatRelativeTime(date)).toBe('hace 2 semanas');
  });

  it('should return months for < 365 days ago', () => {
    const date = new Date('2025-03-01T12:00:00Z');
    expect(formatRelativeTime(date)).toBe('hace 3 meses');
  });

  it('should return years for > 365 days ago', () => {
    const date = new Date('2023-06-01T12:00:00Z');
    expect(formatRelativeTime(date)).toBe('hace 2 años');
  });
});

describe('truncateText', () => {
  it('should return original text when shorter than maxLength', () => {
    expect(truncateText('Hola', 10)).toBe('Hola');
  });

  it('should return original text when equal to maxLength', () => {
    expect(truncateText('Hola', 4)).toBe('Hola');
  });

  it('should truncate and add suffix', () => {
    expect(truncateText('Hola mundo', 4)).toBe('Hola...');
  });

  it('should use custom suffix', () => {
    expect(truncateText('Hola mundo', 4, '…')).toBe('Hola…');
  });

  it('should return text as-is if null/undefined', () => {
    expect(truncateText(null, 5)).toBeNull();
    expect(truncateText(undefined, 5)).toBeUndefined();
  });
});

describe('capitalize', () => {
  it('should return empty string for falsy input', () => {
    expect(capitalize('')).toBe('');
    expect(capitalize(null)).toBe('');
  });

  it('should capitalize first letter and lowercase rest', () => {
    expect(capitalize('hOLA')).toBe('Hola');
  });

  it('should handle single character', () => {
    expect(capitalize('a')).toBe('A');
  });
});

describe('deepClone', () => {
  it('should return primitive values as-is', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone(null)).toBeNull();
  });

  it('should deep clone an object', () => {
    const original = { a: 1, b: { c: 2 } };
    const clone = deepClone(original);
    clone.b.c = 99;
    expect(original.b.c).toBe(2);
  });

  it('should deep clone an array', () => {
    const original = [1, 2, [3, 4]];
    const clone = deepClone(original);
    clone[2][0] = 99;
    expect(original[2][0]).toBe(3);
  });
});

describe('generateId', () => {
  it('should return a non-empty string', () => {
    expect(typeof generateId()).toBe('string');
    expect(generateId().length).toBeGreaterThan(0);
  });

  it('should generate unique IDs', () => {
    expect(generateId()).not.toBe(generateId());
  });
});

describe('isEmptyObject', () => {
  it('should return true for empty object', () => {
    expect(isEmptyObject({})).toBe(true);
  });

  it('should return false for object with keys', () => {
    expect(isEmptyObject({ a: 1 })).toBe(false);
  });

  it('should return falsy for null', () => {
    expect(isEmptyObject(null)).toBeFalsy();
  });
});

describe('formatFileSize', () => {
  it('should return "0 Bytes" for 0', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
  });

  it('should format bytes', () => {
    expect(formatFileSize(500)).toBe('500 Bytes');
  });

  it('should format kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
  });

  it('should format megabytes', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1 MB');
  });

  it('should format gigabytes', () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
  });
});

describe('calculateDistance', () => {
  it('should return 0 for same coordinates', () => {
    expect(calculateDistance(4.6097, -74.0817, 4.6097, -74.0817)).toBe(0);
  });

  it('should calculate approximate distance between Bogotá and Tunja', () => {
    const dist = calculateDistance(4.6097, -74.0817, 5.535, -73.367);
    expect(dist).toBeGreaterThan(100);
    expect(dist).toBeLessThan(160);
  });

  it('should return same result regardless of direction', () => {
    const d1 = calculateDistance(4.6097, -74.0817, 5.535, -73.367);
    const d2 = calculateDistance(5.535, -73.367, 4.6097, -74.0817);
    expect(d1).toBe(d2);
  });
});

describe('getInitials', () => {
  it('should return empty string for null', () => {
    expect(getInitials(null)).toBe('');
    expect(getInitials('')).toBe('');
  });

  it('should return first letter for single word', () => {
    expect(getInitials('Juan')).toBe('J');
  });

  it('should return first and last initials for full name', () => {
    expect(getInitials('Juan Carlos Pérez')).toBe('JP');
  });
});

describe('parseQueryString', () => {
  it('should return empty object for empty string', () => {
    expect(parseQueryString('')).toEqual({});
    expect(parseQueryString(null)).toEqual({});
  });

  it('should parse simple query string', () => {
    expect(parseQueryString('?name=Juan&age=30')).toEqual({ name: 'Juan', age: '30' });
  });

  it('should handle query string without leading ?', () => {
    expect(parseQueryString('name=Juan')).toEqual({ name: 'Juan' });
  });
});

describe('buildQueryString', () => {
  it('should return empty string for null', () => {
    expect(buildQueryString(null)).toBe('');
  });

  it('should return empty string for empty object', () => {
    expect(buildQueryString({})).toBe('');
  });

  it('should build query string from object', () => {
    const result = buildQueryString({ name: 'Juan', page: 1 });
    expect(result).toContain('name=Juan');
    expect(result).toContain('page=1');
    expect(result.startsWith('?')).toBe(true);
  });

  it('should omit null and undefined values', () => {
    const result = buildQueryString({ name: 'Juan', age: null, city: undefined });
    expect(result).not.toContain('age');
    expect(result).not.toContain('city');
  });

  it('should omit empty string values', () => {
    const result = buildQueryString({ name: 'Juan', city: '' });
    expect(result).not.toContain('city');
  });
});
