// utils/validationRules.js
export const required = (message = '필수 입력 항목입니다.') => (value) => {
  // 배열인 경우
  if (Array.isArray(value)) {
    return value.length === 0 ? message : null;
  }
  // 문자열인 경우
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

export const number = (message = '숫자만 입력 가능합니다.') => (value) => {
  if (value && !/^\d+$/.test(value)) {
    return message;
  }
  return null;
};

export const minArrayLength = (min, message) => (value) => {
  if (Array.isArray(value) && value.length < min) {
    return message || `최소 ${min}개 이상 선택해주세요.`;
  }
  return null;
};

export const positiveNumber = (message = '양수만 입력 가능합니다.') => (value) => {
  if (value && (isNaN(value) || parseInt(value) <= 0)) {
    return message;
  }
  return null;
};