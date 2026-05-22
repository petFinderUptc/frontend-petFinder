import { describe, it, expect, vi } from 'vitest';

vi.mock('../constants/apiEndpoints', () => ({
  API_BASE_URL: 'https://api.petfinder.com/api',
}));

import { toAbsoluteMediaUrl, normalizeUserFromBackend, toBackendProfilePayload } from './userAdapter';

describe('toAbsoluteMediaUrl', () => {
  it('should return null for null input', () => {
    expect(toAbsoluteMediaUrl(null)).toBeNull();
  });

  it('should return null for non-string input', () => {
    expect(toAbsoluteMediaUrl(123)).toBeNull();
  });

  it('should return absolute https URLs unchanged', () => {
    const url = 'https://storage.blob.core.windows.net/img/photo.jpg';
    expect(toAbsoluteMediaUrl(url)).toBe(url);
  });

  it('should return absolute http URLs unchanged', () => {
    const url = 'http://cdn.example.com/img.jpg';
    expect(toAbsoluteMediaUrl(url)).toBe(url);
  });

  it('should return data URLs unchanged', () => {
    const url = 'data:image/jpeg;base64,/9j/4AAQ';
    expect(toAbsoluteMediaUrl(url)).toBe(url);
  });

  it('should prepend API origin for relative paths starting with /', () => {
    const result = toAbsoluteMediaUrl('/uploads/img.jpg');
    expect(result).toBe('https://api.petfinder.com/uploads/img.jpg');
  });

  it('should prepend API origin with slash for relative paths not starting with /', () => {
    const result = toAbsoluteMediaUrl('uploads/img.jpg');
    expect(result).toBe('https://api.petfinder.com/uploads/img.jpg');
  });
});

describe('normalizeUserFromBackend', () => {
  it('should return null for null input', () => {
    expect(normalizeUserFromBackend(null)).toBeNull();
  });

  it('should preserve all original fields', () => {
    const user = { id: 'u1', email: 'test@test.com', username: 'test' };
    const result = normalizeUserFromBackend(user);
    expect(result.id).toBe('u1');
    expect(result.email).toBe('test@test.com');
  });

  it('should use avatar field for avatar and profileImage', () => {
    const user = { id: 'u1', avatar: 'https://cdn.test/avatar.jpg' };
    const result = normalizeUserFromBackend(user);
    expect(result.avatar).toBe('https://cdn.test/avatar.jpg');
    expect(result.profileImage).toBe('https://cdn.test/avatar.jpg');
  });

  it('should fall back to profileImage when avatar not provided', () => {
    const user = { id: 'u1', profileImage: 'https://cdn.test/profile.jpg' };
    const result = normalizeUserFromBackend(user);
    expect(result.avatar).toBe('https://cdn.test/profile.jpg');
  });

  it('should set avatar to null when no image provided', () => {
    const user = { id: 'u1' };
    expect(normalizeUserFromBackend(user).avatar).toBeNull();
  });

  it('should use phone field', () => {
    const user = { id: 'u1', phone: '3101234567' };
    expect(normalizeUserFromBackend(user).phone).toBe('3101234567');
  });

  it('should fall back to phoneNumber when phone not provided', () => {
    const user = { id: 'u1', phoneNumber: '3209876543' };
    expect(normalizeUserFromBackend(user).phone).toBe('3209876543');
  });

  it('should build location from city and department', () => {
    const user = { id: 'u1', city: 'Tunja', department: 'Boyacá' };
    const result = normalizeUserFromBackend(user);
    expect(result.location).toContain('Tunja');
    expect(result.location).toContain('Boyacá');
  });

  it('should use location field directly when provided', () => {
    const user = { id: 'u1', location: 'Bogotá, Cundinamarca' };
    expect(normalizeUserFromBackend(user).location).toBe('Bogotá, Cundinamarca');
  });
});

describe('toBackendProfilePayload', () => {
  it('should return empty object for empty input', () => {
    expect(toBackendProfilePayload({})).toEqual({});
  });

  it('should return empty object for undefined input', () => {
    expect(toBackendProfilePayload(undefined)).toEqual({});
  });

  it('should include firstName when provided', () => {
    const result = toBackendProfilePayload({ firstName: 'Juan' });
    expect(result.firstName).toBe('Juan');
  });

  it('should include lastName when provided', () => {
    const result = toBackendProfilePayload({ lastName: 'Pérez' });
    expect(result.lastName).toBe('Pérez');
  });

  it('should include notificationsEnabled boolean', () => {
    const result = toBackendProfilePayload({ notificationsEnabled: false });
    expect(result.notificationsEnabled).toBe(false);
  });

  it('should not include notificationsEnabled when not a boolean', () => {
    const result = toBackendProfilePayload({ notificationsEnabled: 'yes' });
    expect(result.notificationsEnabled).toBeUndefined();
  });

  it('should use phoneNumber field', () => {
    const result = toBackendProfilePayload({ phoneNumber: '3101234567' });
    expect(result.phoneNumber).toBe('3101234567');
  });

  it('should fall back to phone field', () => {
    const result = toBackendProfilePayload({ phone: '3101234567' });
    expect(result.phoneNumber).toBe('3101234567');
  });

  it('should not include empty phone', () => {
    const result = toBackendProfilePayload({ phoneNumber: '  ' });
    expect(result.phoneNumber).toBeUndefined();
  });

  it('should include profileImage when provided', () => {
    const result = toBackendProfilePayload({ profileImage: 'https://cdn.test/img.jpg' });
    expect(result.profileImage).toBe('https://cdn.test/img.jpg');
  });

  it('should use avatar as fallback for profileImage', () => {
    const result = toBackendProfilePayload({ avatar: 'https://cdn.test/avatar.jpg' });
    expect(result.profileImage).toBe('https://cdn.test/avatar.jpg');
  });

  it('should parse city and department from location string', () => {
    const result = toBackendProfilePayload({ location: 'Tunja, Boyacá' });
    expect(result.city).toBe('Tunja');
    expect(result.department).toBe('Boyacá');
  });

  it('should prefer explicit city over location parsing', () => {
    const result = toBackendProfilePayload({ city: 'Bogotá', location: 'Tunja, Boyacá' });
    expect(result.city).toBe('Bogotá');
  });

  it('should include bio when provided', () => {
    const result = toBackendProfilePayload({ bio: 'Amante de los animales' });
    expect(result.bio).toBe('Amante de los animales');
  });
});
