import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToggle } from './useToggle';

describe('useToggle', () => {
  it('should initialize with false by default', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it('should initialize with provided value', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it('should toggle value from false to true', () => {
    const { result } = renderHook(() => useToggle());
    act(() => result.current[1]());
    expect(result.current[0]).toBe(true);
  });

  it('should toggle value from true to false', () => {
    const { result } = renderHook(() => useToggle(true));
    act(() => result.current[1]());
    expect(result.current[0]).toBe(false);
  });

  it('should set value to true with setTrue', () => {
    const { result } = renderHook(() => useToggle(false));
    act(() => result.current[2]());
    expect(result.current[0]).toBe(true);
  });

  it('should set value to false with setFalse', () => {
    const { result } = renderHook(() => useToggle(true));
    act(() => result.current[3]());
    expect(result.current[0]).toBe(false);
  });

  it('should toggle multiple times correctly', () => {
    const { result } = renderHook(() => useToggle());
    act(() => result.current[1]());
    act(() => result.current[1]());
    act(() => result.current[1]());
    expect(result.current[0]).toBe(true);
  });
});
