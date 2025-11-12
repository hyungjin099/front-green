import React from 'react'
import styles from './Checkbox.module.css'

const Checkbox = ({ label = 'title', ...props }) => {
  return (
    <label className={styles.checkbox}>
      <input type="checkbox" {...props} />
      <span className={styles.checkmark}></span>
      {label}
    </label>
  )
}

export default Checkbox