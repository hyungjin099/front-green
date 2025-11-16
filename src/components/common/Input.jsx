import React from 'react'
import styles from './Input.module.css'
import { IoCheckmarkCircleOutline, IoAlertCircleOutline } from "react-icons/io5";

const Input = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  isValid,
  required,
  ...props
}) => {
  const getInputClass = () => {
    let className = styles.input;
    
    // validation props가 있을 때만 적용
    if (touched) {
      if (error) {
        className += ` ${styles.inputError}`;
      } else if (isValid) {
        className += ` ${styles.inputValid}`;
      }
    }
    
    return className;
  };

  return (
    <div className={styles.inputGroup}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        <input
          id={name}
          name={name}
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          className={getInputClass()}
          {...props}
        />
        
        {/* validation이 활성화되고 touched일 때만 아이콘 표시 */}
        {touched && (error || isValid) && (
          <div className={styles.icon}>
            {error ? (
              <IoAlertCircleOutline className={styles.errorIcon}/>
            ) : isValid ? (
              <IoCheckmarkCircleOutline className={styles.successIcon}/>
            ) : null}
          </div>
        )}
      </div>
      
      {/* validation이 활성화되고 touched이며 error가 있을 때만 에러 메시지 표시 */}
      {touched && error && (
        <div className={styles.errorMessage}>{error}</div>
      )}
    </div>
  );
};

export default Input;