import React, { useState } from 'react'
import styles from './Select.module.css'

const Select = ({ label = 'title', children, ...props }) => {
  const [hasValue, setHasValue] = useState(false);
  console.log(hasValue)
  const handleChange = (e) => {
    setHasValue(e.target.value !== "");
  };

  return (
    <div className={styles.selectGroup}>
      <label 
        className={`${styles.label} ${hasValue && styles.selected_color}`}
      >
        {label}
      </label>
      <select 
        className={styles.select}
        onChange={(e) => {handleChange(e)}} 
        {...props}
      >
        {children}
      </select>
    </div>
  )
}

export default Select