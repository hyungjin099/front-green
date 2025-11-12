import React from 'react'
import styles from './Input.module.css'

const Input = ({label = "학생명", ...props}) => {
  return (
    <div className={styles.inputGroup}>
      <input
        className={styles.input}
        placeholder=" " // 중요! label이 위로 이동할 기준
        {...props}
      />
      <label className={styles.label}>{label}</label>
    </div>
  )
}

export default Input