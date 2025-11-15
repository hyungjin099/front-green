// hooks/useValidation.js
import { useState } from 'react';

export const useValidation = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const setError = (name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const setTouchedField = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const clearError = (name) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const validateField = (name, value, rules) => {
    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        setError(name, error);
        return false;
      }
    }
    clearError(name);
    return true;
  };

  return {
    values,
    errors,
    touched,
    setValue,
    setError,
    setTouchedField,
    validateField,
    clearError
  };
};