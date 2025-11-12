import React from 'react'
import styles from './Textarea.module.css' 

const Textarea = ({ label = "내용", ...props }) => {
  return (
    <div className={styles.textareaGroup}>
      <textarea
        className={styles.textarea}
        placeholder=" " // label 이동 기준
        {...props}
      />
      <label className={styles.label}>{label}</label>
    </div>
  )
}

export default Textarea