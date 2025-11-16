// components/Select.jsx
import React, { useState } from 'react'
import styles from './FlotingSelect.module.css'
import { IoCheckmarkCircleOutline , IoAlertCircleOutline  } from "react-icons/io5";

const FlotingSelect = ({ 
  label = 'title', 
  children, 
  onChange, 
  name,
  value,
  onBlur,
  error,
  touched,
  isValid,
  ...props 
}) => {
  const [hasValue, setHasValue] = useState(false);
  
  const handleChange = (e) => {
    setHasValue(e.target.value !== "");
    onChange(e);
  };

  const getSelectClass = () => {
    let className = styles.select;
    
    if (touched) {
      if (error) {
        className += ` ${styles.selectError}`;
      } else if (isValid) {
        className += ` ${styles.selectValid}`;
      }
    }
    
    return className;
  };

  const getLabelClass = () => {
    let className = styles.label;
    
    if (hasValue || value) {
      className += ` ${styles.selected_color}`;
    }
    
    if (touched && error) {
      className += ` ${styles.labelError}`;
    } else if (touched && isValid) {
      className += ` ${styles.labelValid}`;
    }
    
    return className;
  };

  return (
    <div className={styles.selectGroup}>
      <label className={getLabelClass()}>
        {label}
      </label>
      <select 
        name={name}
        value={value || ''}
        className={getSelectClass()}
        onChange={handleChange}
        onBlur={onBlur}
        {...props}
      >
        {children}
      </select>
      
      {/* 성공/에러 아이콘 */}
      {touched && (
        <div className={styles.icon}>
          {error ? (
            <IoCheckmarkCircleOutline className={styles.errorIcon}/>
          ) : isValid ? (
            <IoAlertCircleOutline className={styles.successIcon}/>
          ) : null}
        </div>
      )}
      
      {/* 에러 메시지 */}
      {touched && error && (
        <div className={styles.errorMessage}>{error}</div>
      )}
    </div>
  )
}

export default FlotingSelect