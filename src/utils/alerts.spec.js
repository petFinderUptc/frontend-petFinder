import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pushAppAlert } from './alerts';

describe('pushAppAlert', () => {
  let dispatchSpy;

  beforeEach(() => {
    dispatchSpy = vi.spyOn(window, 'dispatchEvent').mockImplementation(() => true);
  });

  afterEach(() => {
    dispatchSpy.mockRestore();
  });

  it('should dispatch petfinder:alert event with message', () => {
    pushAppAlert({ type: 'success', message: 'Operación exitosa' });
    expect(dispatchSpy).toHaveBeenCalledOnce();
    const event = dispatchSpy.mock.calls[0][0];
    expect(event.type).toBe('petfinder:alert');
  });

  it('should not dispatch event when message is empty', () => {
    pushAppAlert({ type: 'error', message: '' });
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should not dispatch event when message is undefined', () => {
    pushAppAlert({ type: 'info' });
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should use default type "info" when not provided', () => {
    pushAppAlert({ message: 'Test' });
    const event = dispatchSpy.mock.calls[0][0];
    expect(event.detail.type).toBe('info');
  });

  it('should pass correct detail to event', () => {
    pushAppAlert({ type: 'warning', message: 'Atención' });
    const event = dispatchSpy.mock.calls[0][0];
    expect(event.detail).toEqual({ type: 'warning', message: 'Atención' });
  });
});
