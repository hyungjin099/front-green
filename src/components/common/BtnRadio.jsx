import React from 'react'
import styles from './BtnRadio.module.css'

const BtnCheckbox = ({ 
  label='title', 
  checked, 

  color = 'default',
  ...props
}) => {
  return (
    <label className={`${styles.checkboxButton} ${checked ? styles.checked : ''}  ${styles[color] || ''}`}>
      <span className={styles.checkmark}>
        {checked && (
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M13.3332 4L5.99984 11.3333L2.6665 8" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className={styles.label}>{label}</span>
      <input
        type="radio"

        checked={checked}

        className={styles.hiddenCheckbox}
        {...props}
      />
    </label>
  )
}

export default BtnCheckbox