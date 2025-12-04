import React from 'react'
import styles from './BtnRadio.module.css'

const BtnRadio = ({ 
  label='title', 
  checked, 
  color = 'default',
  readOnly = false,
  ...props
}) => {
  return (
    <label className={`${styles.radioButton} ${checked ? styles.checked : ''} ${styles[color] || ''} ${readOnly ? styles.readOnly : ''}`}>
      <span className={styles.radiomark}>
        {checked  && (
          <span className={styles.radioDot} />
        )}
      </span>
      <span className={styles.label}>{label}</span>
      <input
        type="radio"
        checked={checked}
        readOnly={readOnly}
        className={styles.hiddenRadio}
        {...props}
      />
    </label>
  )
}

export default BtnRadio