import React from 'react'
import styles from './Radio.module.css'

const Radio = ({ label='title', ...props }) => {
  return (
    <label className={styles.radio}>
      <input type="radio" {...props} />
      <span className={styles.radiomark}></span>
      {label}
    </label>
  )
}

export default Radio