import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('should not update value before delay', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 300), {
      initialProps: { val: 'first' },
    });
    rerender({ val: 'second' });
    expect(result.current).toBe('first');
  });

  it('should update value after delay', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 300), {
      initialProps: { val: 'first' },
    });
    rerender({ val: 'second' });
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe('second');
  });

  it('should reset timer on rapid changes', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 300), {
      initialProps: { val: 'a' },
    });
    rerender({ val: 'b' });
    act(() => vi.advanceTimersByTime(100));
    rerender({ val: 'c' });
    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe('a');
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe('c');
  });

  it('should use default delay of 500ms', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val), {
      initialProps: { val: 'first' },
    });
    rerender({ val: 'second' });
    act(() => vi.advanceTimersByTime(499));
    expect(result.current).toBe('first');
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('second');
  });
});
