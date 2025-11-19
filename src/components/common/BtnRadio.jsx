import React from 'react'
import styles from './BtnRadio.module.css'

const BtnCheckbox = ({ 
  label='title', 
  checked, 

  color = 'default',
  ...props
}) => {
  return (
    <label className={`${styles.radioButton} ${checked ? styles.checked : ''} ${styles[color] || ''}`}>
      <span className={styles.radiomark}>
        {checked && (
          <span className={styles.radioDot} />
        )}
      </span>
      <span className={styles.label}>{label}</span>
      <input
        type="radio"
        checked={checked}
        className={styles.hiddenRadio}
        {...props}
      />
    </label>
  )
}

export default BtnCheckbox