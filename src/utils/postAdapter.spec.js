import { describe, it, expect } from 'vitest';
import { adaptPost, adaptPosts, adaptPostsResponse } from './postAdapter';

describe('adaptPost', () => {
  it('should return null for null input', () => {
    expect(adaptPost(null)).toBeNull();
  });

  it('should extract flat lat/lon coordinates', () => {
    const post = { id: '1', lat: 5.535, lon: -73.367, type: 'lost', species: 'dog' };
    const result = adaptPost(post);
    expect(result.latitude).toBe(5.535);
    expect(result.longitude).toBe(-73.367);
  });

  it('should extract nested location.coordinates', () => {
    const post = {
      id: '1',
      location: { coordinates: { latitude: 4.6, longitude: -74.1 } },
      type: 'found',
      species: 'cat',
    };
    const result = adaptPost(post);
    expect(result.latitude).toBe(4.6);
    expect(result.longitude).toBe(-74.1);
  });

  it('should use direct imageUrl string', () => {
    const post = { id: '1', imageUrl: 'https://cdn.test/img.jpg', type: 'lost', species: 'dog' };
    expect(adaptPost(post).imageUrl).toBe('https://cdn.test/img.jpg');
  });

  it('should fall back to images[0] when imageUrl is not a string', () => {
    const post = { id: '1', images: ['https://cdn.test/first.jpg'], type: 'lost', species: 'dog' };
    expect(adaptPost(post).imageUrl).toBe('https://cdn.test/first.jpg');
  });

  it('should generate petName from species when not provided', () => {
    const post = { id: '1', species: 'dog', type: 'lost' };
    const result = adaptPost(post);
    expect(result.petName).toContain('Perro');
    expect(result.petName).toContain('perdida');
  });

  it('should generate petName for found pet', () => {
    const post = { id: '1', species: 'cat', type: 'found' };
    const result = adaptPost(post);
    expect(result.petName).toContain('Gato');
    expect(result.petName).toContain('encontrada');
  });

  it('should use petName when provided', () => {
    const post = { id: '1', petName: 'Firulais', type: 'lost', species: 'dog' };
    expect(adaptPost(post).petName).toBe('Firulais');
  });

  it('should default type to "lost" when not provided', () => {
    const post = { id: '1', species: 'dog' };
    expect(adaptPost(post).type).toBe('lost');
  });

  it('should default status to "active" when not provided', () => {
    const post = { id: '1', species: 'dog', type: 'lost' };
    expect(adaptPost(post).status).toBe('active');
  });

  it('should extract contactPhone from contact field', () => {
    const post = { id: '1', contact: '3101234567', type: 'lost', species: 'dog' };
    expect(adaptPost(post).contactPhone).toBe('3101234567');
  });

  it('should set isUrgent default to false', () => {
    const post = { id: '1', type: 'lost', species: 'dog' };
    expect(adaptPost(post).isUrgent).toBe(false);
  });

  it('should extract string location directly', () => {
    const post = { id: '1', location: 'Tunja, Boyacá', type: 'lost', species: 'dog' };
    expect(adaptPost(post).location).toBe('Tunja, Boyacá');
  });

  it('should extract location from neighborhood and city', () => {
    const post = {
      id: '1',
      location: { neighborhood: 'Centro', city: 'Tunja' },
      type: 'lost',
      species: 'dog',
    };
    expect(adaptPost(post).location).toContain('Centro');
    expect(adaptPost(post).location).toContain('Tunja');
  });

  it('should include coords object', () => {
    const post = { id: '1', lat: 5.0, lon: -73.0, type: 'lost', species: 'dog' };
    const result = adaptPost(post);
    expect(result.coords).toEqual({ latitude: 5.0, longitude: -73.0 });
  });
});

describe('adaptPosts', () => {
  it('should return empty array for non-array input', () => {
    expect(adaptPosts(null)).toEqual([]);
    expect(adaptPosts(undefined)).toEqual([]);
    expect(adaptPosts('string')).toEqual([]);
  });

  it('should map each post through adaptPost', () => {
    const posts = [
      { id: '1', species: 'dog', type: 'lost' },
      { id: '2', species: 'cat', type: 'found' },
    ];
    const result = adaptPosts(posts);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('2');
  });
});

describe('adaptPostsResponse', () => {
  it('should return empty structure for null input', () => {
    const result = adaptPostsResponse(null);
    expect(result.data).toEqual([]);
    expect(result.pagination).toEqual({});
  });

  it('should adapt data array and preserve pagination', () => {
    const response = {
      data: [{ id: '1', species: 'dog', type: 'lost' }],
      pagination: { page: 1, total: 1 },
    };
    const result = adaptPostsResponse(response);
    expect(result.data).toHaveLength(1);
    expect(result.pagination).toEqual({ page: 1, total: 1 });
  });
});
