import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm } from './useForm';

const initialValues = { email: '', password: '' };

const validationRules = {
  email: (value) =>
    value && value.includes('@')
      ? { isValid: true, error: '' }
      : { isValid: false, error: 'Email inválido' },
  password: (value) =>
    value && value.length >= 6
      ? { isValid: true, error: '' }
      : { isValid: false, error: 'Mínimo 6 caracteres' },
};

describe('useForm', () => {
  it('should initialize with provided values', () => {
    const { result } = renderHook(() => useForm(initialValues));
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should update field value on handleChange', () => {
    const { result } = renderHook(() => useForm(initialValues));
    act(() => {
      result.current.handleChange({ target: { name: 'email', value: 'test@test.com', type: 'text' } });
    });
    expect(result.current.values.email).toBe('test@test.com');
  });

  it('should handle checkbox inputs', () => {
    const { result } = renderHook(() => useForm({ remember: false }));
    act(() => {
      result.current.handleChange({ target: { name: 'remember', type: 'checkbox', checked: true } });
    });
    expect(result.current.values.remember).toBe(true);
  });

  it('should clear error for field when user types', () => {
    const { result } = renderHook(() => useForm(initialValues, undefined, validationRules));
    act(() => {
      result.current.setFieldError('email', 'Error previo');
    });
    act(() => {
      result.current.handleChange({ target: { name: 'email', value: 'a', type: 'text' } });
    });
    expect(result.current.errors.email).toBe('');
  });

  it('should mark field as touched on handleBlur', () => {
    const { result } = renderHook(() => useForm(initialValues));
    act(() => {
      result.current.handleBlur({ target: { name: 'email' } });
    });
    expect(result.current.touched.email).toBe(true);
  });

  it('should validate field on blur using validationRules', async () => {
    const { result } = renderHook(() => useForm(initialValues, undefined, validationRules));
    await act(async () => {
      result.current.handleBlur({ target: { name: 'email' } });
    });
    expect(result.current.errors.email).toBe('Email inválido');
  });

  it('should not set error on blur if field has no validation rule', async () => {
    const { result } = renderHook(() => useForm({ name: '' }, undefined, {}));
    await act(async () => {
      result.current.handleBlur({ target: { name: 'name' } });
    });
    expect(result.current.errors.name).toBeUndefined();
  });

  it('should set errors via handleSubmit when form is invalid', async () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() => useForm(initialValues, onSubmit, validationRules));
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() });
    });
    expect(result.current.errors.email).toBe('Email inválido');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should not set errors when form is valid on submit', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const values = { email: 'test@test.com', password: 'secure1' };
    const { result } = renderHook(() => useForm(values, onSubmit, validationRules));
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() });
    });
    expect(result.current.errors.email).toBeUndefined();
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should call onSubmit when form is valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const values = { email: 'test@test.com', password: 'secure1' };
    const { result } = renderHook(() => useForm(values, onSubmit, validationRules));
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() });
    });
    expect(onSubmit).toHaveBeenCalledWith(values);
  });

  it('should not call onSubmit when form is invalid', async () => {
    const onSubmit = vi.fn();
    const { result } = renderHook(() => useForm(initialValues, onSubmit, validationRules));
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() });
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should handle submit without event object', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const values = { email: 'a@b.com', password: 'pass123' };
    const { result } = renderHook(() => useForm(values, onSubmit, validationRules));
    await act(async () => {
      await result.current.handleSubmit(null);
    });
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should reset form to initial values', () => {
    const { result } = renderHook(() => useForm(initialValues, undefined, validationRules));
    act(() => {
      result.current.handleChange({ target: { name: 'email', value: 'changed@test.com', type: 'text' } });
      result.current.setFieldError('email', 'error');
    });
    act(() => { result.current.reset(); });
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  it('should set field value programmatically', () => {
    const { result } = renderHook(() => useForm(initialValues));
    act(() => { result.current.setFieldValue('email', 'programmatic@test.com'); });
    expect(result.current.values.email).toBe('programmatic@test.com');
  });

  it('should set field error programmatically', () => {
    const { result } = renderHook(() => useForm(initialValues));
    act(() => { result.current.setFieldError('password', 'Error manual'); });
    expect(result.current.errors.password).toBe('Error manual');
  });
});
