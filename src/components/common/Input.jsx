// components/Input.jsx
import React from 'react';
import styles from './Input.module.css';

const Input = ({
  label = "학생명",
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  isValid,
  ...props
}) => {
  const getInputClass = () => {
    let className = styles.input;
    
    if (touched) {
      if (error) {
        className += ` ${styles.inputError}`;
      } else if (isValid) {
        className += ` ${styles.inputValid}`;
      }
    }
    
    return className;
  };

  const getLabelClass = () => {
    let className = styles.label;
    
    if (touched && error) {
      className += ` ${styles.labelError}`;
    } else if (touched && isValid) {
      className += ` ${styles.labelValid}`;
    }
    
    return className;
  };

  return (
    <div className={styles.inputGroup}>
      <input
        name={name}
        value={value || ''}
        onChange={onChange}
        onBlur={onBlur}
        className={getInputClass()}
        placeholder=" " // 중요! label이 위로 이동할 기준
        {...props}
      />
      <label className={getLabelClass()}>{label}</label>
      
      {/* 성공/에러 아이콘 */}
      {touched && (
        <div className={styles.icon}>
          {error ? (
            <svg className={styles.errorIcon} viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor">
              <circle cx="6" cy="6" r="4.5"/>
              <path d="m5.25 5.25 1.5 1.5m0-1.5-1.5 1.5"/>
            </svg>
          ) : isValid ? (
            <svg className={styles.successIcon} viewBox="0 0 8 8">
              <path fill="currentColor" d="m2.3 6.73.94-.94 1.93 1.94 4.69-4.69.94.94L3.23 7.67z"/>
            </svg>
          ) : null}
        </div>
      )}
      
      {/* 에러 메시지 */}
      {touched && error && (
        <div className={styles.errorMessage}>{error}</div>
      )}
    </div>
  );
};

export default Input;