// components/DatePicker.jsx
import React from 'react';
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/themes/material_orange.css"
import { Korean } from "flatpickr/dist/l10n/ko.js";
import styles from './FlotingDatePicker.module.css'
import { FaCalendar } from "react-icons/fa6";
import { formatDateToString } from "../../util/dateUtil";
import { IoCheckmarkCircleOutline , IoAlertCircleOutline  } from "react-icons/io5";

const FlotingDatePicker = ({ 
  label = '날짜',
  options = {},
  name, 
  value,
  onChange,
  //onBlur,
  error,
  touched,
  isValid,
  ...props 
}) => {

  const defaultOptions = {
    dateFormat: 'Y-m-d',
    locale: Korean,
    ...options
  };

  const handleChange = (selectedDates) => {
    if (onChange) {
      const formattedValue = formatDateToString(selectedDates[0]);
      
      onChange({
        target: {
          name,
          value: formattedValue
        }
      });
    }
  };

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
      <Flatpickr
        options={defaultOptions}
        value={value}
        onChange={handleChange}
        //onBlur={onBlur}
        placeholder=" "
        className={getInputClass()}
        {...props}
      />
      <label className={getLabelClass()}>{label}</label>
      <FaCalendar className={styles.calendarIcon}/>
      
      {/* 성공/에러 아이콘 */}
      {touched && (
        <div className={styles.validationIcon}>
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

export default FlotingDatePicker