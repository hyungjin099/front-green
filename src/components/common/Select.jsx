import React, { useState } from 'react'
import styles from './Select.module.css'

const Select = ({ label = 'title', children, ...props }) => {
  const [hasValue, setHasValue] = useState(false);

  const handleChange = (e) => {
    setHasValue(e.target.value !== "");
  };

  return (
    <div className={styles.selectGroup}>
      <label className={styles.label}>{label}</label>
      <select className={styles.select} {...props}>
        {children}
      </select>
    </div>
  )
}

export default Select