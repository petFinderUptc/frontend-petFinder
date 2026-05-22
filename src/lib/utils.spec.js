import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('should return a single class', () => {
    expect(cn('text-red-500')).toBe('text-red-500');
  });

  it('should merge multiple classes', () => {
    expect(cn('text-red-500', 'font-bold')).toBe('text-red-500 font-bold');
  });

  it('should handle conditional classes with object syntax', () => {
    expect(cn({ 'text-red-500': true, 'text-blue-500': false })).toBe('text-red-500');
  });

  it('should resolve Tailwind conflicts (last wins)', () => {
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
  });

  it('should handle undefined and null inputs', () => {
    expect(cn(undefined, null, 'font-bold')).toBe('font-bold');
  });

  it('should handle empty input', () => {
    expect(cn()).toBe('');
  });
});
