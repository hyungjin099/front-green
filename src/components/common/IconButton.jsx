import React from 'react'
import styles from './IconButton.module.css'

const IconButton = ({ 
  children,
  variant = 'primary', // primary, secondary, danger
  size = 'medium', // small, medium, large
  disabled = false,
  type = 'button',
  ...props 
}) => {
  const buttonClass = `${styles.button} ${styles[variant]} ${styles[size]} ${disabled ? styles.disabled : ''}`;
  
  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default IconButton