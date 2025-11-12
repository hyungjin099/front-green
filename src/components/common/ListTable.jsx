import React from 'react'
import styles from './ListTable.module.css'

const ListTable = ({children}) => {
  return (
    <table className={styles.list_table}>
      {children}
    </table>
  )
}

export default ListTable