// components/Textarea.jsx
import React from 'react'
import styles from './FlotingTextarea.module.css' 
import { IoCheckmarkCircleOutline , IoAlertCircleOutline  } from "react-icons/io5";

const FlotingTextarea = ({ 
  label = "내용",
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  isValid,
  ...props 
}) => {
  const getTextareaClass = () => {
    let className = styles.textarea;
    
    if (touched) {
      if (error) {
        className += ` ${styles.textareaError}`;
      } else if (isValid) {
        className += ` ${styles.textareaValid}`;
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
    <div className={styles.textareaGroup}>
      <textarea
        name={name}
        value={value || ''}
        onChange={onChange}
        onBlur={onBlur}
        className={getTextareaClass()}
        placeholder=" "
        {...props}
      />
      <label className={getLabelClass()}>{label}</label>
      
      {/* 성공/에러 아이콘 */}
      {touched && (
        <div className={styles.icon}>
          {error ? (
            <IoAlertCircleOutline className={styles.errorIcon}/>
          ) : isValid ? (
            <IoCheckmarkCircleOutline className={styles.successIcon}/>
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

export default FlotingTextarea