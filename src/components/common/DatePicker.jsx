import React from 'react';
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/themes/material_orange.css"
import { Korean } from "flatpickr/dist/l10n/ko.js";
import styles from './DatePicker.module.css'
import { FaCalendar } from "react-icons/fa6";
import { formatDateToString } from "../../util/dateUtil";
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
  label = '날짜',
  options = {},
  name, 
  value,
  onChange,
  ...props 
}) => {

  const defaultOptions = {
    dateFormat: 'Y-m-d',
    locale: Korean,
    ...options
  };

    const handleChange = (selectedDates) => {
    // selectedDates[0]이 선택한 날짜
    if (onChange) {
      onChange({
        target: {
          name,
          value: formatDateToString(selectedDates[0]) // Date 객체
        }
      });
    }
  };

  return (
    <div className={styles.inputGroup}>
      <Flatpickr
        options={defaultOptions}
        value={value}
        onChange={handleChange}
        placeholder=" "
        className={styles.input}
        {...props}
      />
      <label className={styles.label}>{label}</label>
      <FaCalendar className={styles.calendarIcon}/>
    </div>
  )
}

export default DatePicker