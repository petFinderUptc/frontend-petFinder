/**
 * useForm Hook
 * 
 * Custom hook for form state management and validation.
 * Simplifies form handling with built-in validation support.
 * 
 * Features:
 * - Form state management
 * - Field validation
 * - Error handling
 * - Submit handling
 * - Reset functionality
 * 
 * @param {Object} initialValues - Initial form values
 * @param {Function} onSubmit - Submit handler function
 * @param {Object} validationRules - Validation rules for each field
 * @returns {Object} Form state and handlers
 */

import { useState, useCallback } from 'react';

export const useForm = (initialValues = {}, onSubmit, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  /**
   * Handle input change
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  /**
   * Handle field blur (for touched state)
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    
    // Validate field on blur
    if (validationRules[name]) {
      const validation = validationRules[name](values[name], values);
      if (!validation.isValid) {
        setErrors((prev) => ({
          ...prev,
          [name]: validation.error,
        }));
      }
    }
  }, [validationRules, values]);

  /**
   * Validate all fields
   */
  const validate = useCallback(() => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach((fieldName) => {
      const validation = validationRules[fieldName](values[fieldName], values);
      if (!validation.isValid) {
        newErrors[fieldName] = validation.error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validationRules, values]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => ({
      ...acc,
      [key]: true,
    }), {});
    setTouched(allTouched);
    
    // Validate form
    const isValid = validate();
    
    if (isValid) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validate, onSubmit]);

  /**
   * Reset form to initial values
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Set form values programmatically
   */
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /**
   * Set form error programmatically
   */
  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
    setValues,
  };
};
