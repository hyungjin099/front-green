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

  const validateAllFields = (getValidationRules) => {
    let isValid = true;
    Object.keys(values).forEach(fieldName => {
      setTouchedField(fieldName);
      const rules = getValidationRules(fieldName); // 함수 호출로 변경
      if (rules && !validateField(fieldName, values[fieldName], rules)) {
        isValid = false;
      }
    });
    return isValid;
  };

  return {
    values,
    errors,
    touched,
    setValue,
    setError,
    setTouchedField,
    validateField,
    validateAllFields,
    clearError
  };
};