import { describe, it, expect, beforeEach } from 'vitest';
import { setItem, getItem, removeItem, clear, isAvailable } from './storage';

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe('setItem', () => {
  it('should store value in localStorage', () => {
    const result = setItem('test_key', { name: 'Juan' });
    expect(result).toBe(true);
    expect(JSON.parse(localStorage.getItem('test_key'))).toEqual({ name: 'Juan' });
  });

  it('should store string value', () => {
    setItem('str_key', 'hello');
    expect(JSON.parse(localStorage.getItem('str_key'))).toBe('hello');
  });

  it('should store number value', () => {
    setItem('num_key', 42);
    expect(JSON.parse(localStorage.getItem('num_key'))).toBe(42);
  });

  it('should update sessionStorage when key only exists there', () => {
    sessionStorage.setItem('sess_key', JSON.stringify('old'));
    setItem('sess_key', 'new');
    expect(JSON.parse(sessionStorage.getItem('sess_key'))).toBe('new');
    expect(localStorage.getItem('sess_key')).toBeNull();
  });
});

describe('getItem', () => {
  it('should return parsed value from localStorage', () => {
    localStorage.setItem('key1', JSON.stringify({ id: 1 }));
    expect(getItem('key1')).toEqual({ id: 1 });
  });

  it('should fall back to sessionStorage when not in localStorage', () => {
    sessionStorage.setItem('sess_key', JSON.stringify('session_val'));
    expect(getItem('sess_key')).toBe('session_val');
  });

  it('should return defaultValue when key does not exist', () => {
    expect(getItem('nonexistent', 'default')).toBe('default');
  });

  it('should return null when key does not exist and no default', () => {
    expect(getItem('nonexistent')).toBeNull();
  });

  it('should prefer localStorage over sessionStorage', () => {
    localStorage.setItem('shared', JSON.stringify('local'));
    sessionStorage.setItem('shared', JSON.stringify('session'));
    expect(getItem('shared')).toBe('local');
  });
});

describe('removeItem', () => {
  it('should remove item from localStorage', () => {
    localStorage.setItem('key1', 'val');
    removeItem('key1');
    expect(localStorage.getItem('key1')).toBeNull();
  });

  it('should remove item from sessionStorage', () => {
    sessionStorage.setItem('key1', 'val');
    removeItem('key1');
    expect(sessionStorage.getItem('key1')).toBeNull();
  });

  it('should return true on success', () => {
    expect(removeItem('any_key')).toBe(true);
  });
});

describe('clear', () => {
  it('should clear all items from localStorage', () => {
    localStorage.setItem('a', '1');
    localStorage.setItem('b', '2');
    clear();
    expect(localStorage.length).toBe(0);
  });

  it('should clear all items from sessionStorage', () => {
    sessionStorage.setItem('c', '3');
    clear();
    expect(sessionStorage.length).toBe(0);
  });

  it('should return true on success', () => {
    expect(clear()).toBe(true);
  });
});

describe('isAvailable', () => {
  it('should return true when localStorage is available', () => {
    expect(isAvailable()).toBe(true);
  });
});
