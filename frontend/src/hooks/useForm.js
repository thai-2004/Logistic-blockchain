import { useState, useCallback } from 'react';

/**
 * Custom hook for form state management with validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules for each field
 * @param {Function} onSubmit - Submit handler
 * @returns {Object} Form state and handlers
 */
export const useForm = (initialValues = {}, validationRules = {}, onSubmit = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update field value
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  // Mark field as touched
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate on blur
    validateField(name, values[name]);
  }, [values]);

  // Validate single field
  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return true;

    const fieldErrors = [];

    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      fieldErrors.push(rules.requiredMessage || `${name} is required`);
    }

    // Pattern validation
    if (value && rules.pattern && !rules.pattern.test(value)) {
      fieldErrors.push(rules.patternMessage || `${name} format is invalid`);
    }

    // Custom validation function
    if (value && rules.validate && typeof rules.validate === 'function') {
      const customError = rules.validate(value, values);
      if (customError) {
        fieldErrors.push(customError);
      }
    }

    // Min length validation
    if (value && rules.minLength && value.length < rules.minLength) {
      fieldErrors.push(rules.minLengthMessage || `${name} must be at least ${rules.minLength} characters`);
    }

    // Max length validation
    if (value && rules.maxLength && value.length > rules.maxLength) {
      fieldErrors.push(rules.maxLengthMessage || `${name} must be at most ${rules.maxLength} characters`);
    }

    // Email validation
    if (value && rules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        fieldErrors.push(rules.emailMessage || 'Invalid email format');
      }
    }

    // Update errors
    if (fieldErrors.length > 0) {
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors[0] // Show first error only
      }));
      return false;
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
      return true;
    }
  }, [validationRules, values]);

  // Validate all fields
  const validate = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(name => {
      const fieldValue = values[name];
      const rules = validationRules[name];

      const fieldErrors = [];

      // Required validation
      if (rules.required && (!fieldValue || (typeof fieldValue === 'string' && fieldValue.trim() === ''))) {
        fieldErrors.push(rules.requiredMessage || `${name} is required`);
      }

      // Pattern validation
      if (fieldValue && rules.pattern && !rules.pattern.test(fieldValue)) {
        fieldErrors.push(rules.patternMessage || `${name} format is invalid`);
      }

      // Custom validation function
      if (fieldValue && rules.validate && typeof rules.validate === 'function') {
        const customError = rules.validate(fieldValue, values);
        if (customError) {
          fieldErrors.push(customError);
        }
      }

      // Min length validation
      if (fieldValue && rules.minLength && fieldValue.length < rules.minLength) {
        fieldErrors.push(rules.minLengthMessage || `${name} must be at least ${rules.minLength} characters`);
      }

      // Max length validation
      if (fieldValue && rules.maxLength && fieldValue.length > rules.maxLength) {
        fieldErrors.push(rules.maxLengthMessage || `${name} must be at most ${rules.maxLength} characters`);
      }

      // Email validation
      if (fieldValue && rules.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fieldValue)) {
          fieldErrors.push(rules.emailMessage || 'Invalid email format');
        }
      }

      if (fieldErrors.length > 0) {
        newErrors[name] = fieldErrors[0];
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  // Handle form submit
  const handleSubmit = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(validationRules).forEach(name => {
      allTouched[name] = true;
    });
    setTouched(allTouched);

    // Validate all fields
    const isValid = validate();

    if (!isValid) {
      return;
    }

    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        // Only log non-409 errors (409 is expected for conflicts like duplicate email/shipment)
        if (error.response?.status !== 409) {
          console.error('Form submission error:', error);
        }
        // Don't throw 409 errors - they're handled gracefully by components
        // Other errors are still thrown for proper error handling
        if (error.response?.status !== 409) {
          throw error;
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validationRules, validate, onSubmit]);

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set field value programmatically
  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Set field error programmatically
  const setError = useCallback((name, errorMessage) => {
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
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
    validate,
    validateField,
    reset,
    setValue,
    setError,
    setValues
  };
};

