import React from 'react';
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/themes/material_orange.css"
import { Korean } from "flatpickr/dist/l10n/ko.js";
import styles from './DatePicker.module.css'
import { FaCalendar } from "react-icons/fa6";
// options={{ 
//   disable: [
//     (date) => date.getDay() === 0 || date.getDay() === 6
//   ],
//   enableTime: true,
//   dateFormat: 'Y-m-d H:i',
//   time_24hr: true,
//   mode: 'range',
// }}

const DatePicker = ({ 
  value, 
  onChange, 
  label = '날짜',
  options = {} 
}) => {

  const defaultOptions = {
    dateFormat: 'Y-m-d',
    locale: Korean,
    ...options
  };

  return (
    <div className={styles.inputGroup}>
      <Flatpickr
        value={value}
        onChange={onChange}
        options={defaultOptions}
        placeholder=" "
        className={styles.input}
      />
      <label className={styles.label}>{label}</label>
      <FaCalendar className={styles.calendarIcon}/>
    </div>
  )
}

export default DatePicker