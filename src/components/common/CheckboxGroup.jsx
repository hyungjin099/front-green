// components/CheckboxGroup.jsx
import React from 'react';
import BtnCheckbox from './BtnCheckbox';
import styles from './CheckboxGroup.module.css';
import { IoCheckmarkCircleOutline , IoAlertCircleOutline  } from "react-icons/io5";

const CheckboxGroup = ({
  label = "수업 요일",
  name,
  value = [],
  onChange,
  onBlur,
  options = [],
  error,
  touched,
  isValid,
  ...props
}) => {
  const handleCheckboxChange = (optionValue, checked) => {
    let newValue;
    if (checked) {
      newValue = [...value, optionValue];
    } else {
      newValue = value.filter(v => v !== optionValue);
    }
    
    onChange({
      target: {
        name,
        value: newValue
      }
    });
  };

  const getGroupClass = () => {
    let className = styles.checkboxGroup;
    
    if (touched) {
      if (error) {
        className += ` ${styles.groupError}`;
      } else if (isValid) {
        className += ` ${styles.groupValid}`;
      }
    }
    
    return className;
  };

  return (
    <div className={getGroupClass()}>
      <p className={styles.label}>{label}</p>
      
      <div className={styles.checkboxContainer}>
        {options.map((option, index) => (
          <BtnCheckbox
            key={index}
            label={option.label}
            name={name}
            color={option.color}
            checked={value.includes(option.value)}
            onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
            onBlur={onBlur}
            value={option.value}
          />
        ))}
      </div>
      
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
  );
};

export default CheckboxGroup;