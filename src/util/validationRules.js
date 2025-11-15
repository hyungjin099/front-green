// utils/validationRules.js
export const required = (message = '필수 입력 항목입니다.') => (value) => {
  if (!value || value.toString().trim() === '') {
    return message;
  }
  return null;
};

export const minLength = (min, message) => (value) => {
  if (value && value.length < min) {
    return message || `최소 ${min}글자 이상 입력해주세요.`;
  }
  return null;
};

export const email = (message = '올바른 이메일 형식이 아닙니다.') => (value) => {
  if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return message;
  }
  return null;
};