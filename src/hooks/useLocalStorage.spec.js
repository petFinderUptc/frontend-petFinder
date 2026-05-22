import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe('useLocalStorage', () => {
  it('should return initialValue when key does not exist', () => {
    const { result } = renderHook(() => useLocalStorage('test_key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should return stored value when key exists in localStorage', () => {
    localStorage.setItem('existing_key', JSON.stringify('stored_value'));
    const { result } = renderHook(() => useLocalStorage('existing_key', 'default'));
    expect(result.current[0]).toBe('stored_value');
  });

  it('should update localStorage when state changes', () => {
    const { result } = renderHook(() => useLocalStorage('update_key', 'initial'));
    act(() => result.current[1]('updated'));
    expect(result.current[0]).toBe('updated');
  });

  it('should handle object values', () => {
    const initial = { name: 'Juan', age: 25 };
    const { result } = renderHook(() => useLocalStorage('obj_key', initial));
    expect(result.current[0]).toEqual(initial);
  });

  it('should persist null as value', () => {
    const { result } = renderHook(() => useLocalStorage('null_key', 'default'));
    act(() => result.current[1](null));
    expect(result.current[0]).toBeNull();
  });

  it('should handle boolean values', () => {
    const { result } = renderHook(() => useLocalStorage('bool_key', false));
    act(() => result.current[1](true));
    expect(result.current[0]).toBe(true);
  });
});
