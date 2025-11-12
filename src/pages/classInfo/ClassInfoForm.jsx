import React from 'react'
import styles from './ClassInfoForm.module.css'
import ListTable from '../../components/common/ListTable'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'

const ClassInfoForm = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title_div}></div>
      <div className={styles.class_reg_div}></div>
      <div className={styles.search_div}>
        <ListTable>
          <thead>
            <tr>
              <td>123</td>
              <td>123</td>
              <td>123</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>123</td>
              <td>123</td>
              <td>123</td>
            </tr>
            <tr>
              <td>123</td>
              <td>123</td>
              <td>123</td>
            </tr>
            <tr>
              <td>123</td>
              <td>123</td>
              <td>123</td>
            </tr>
          </tbody>
        </ListTable>

        <div className={styles.test}>
          <Input /> <br />
          <Select 
            label="진행 상태"
          >
            <option value="">123</option>
            <option value="">2345</option>
            <option value="">56</option>
          </Select>
        </div>

        
      </div>
      <div className={styles.list_div}></div>
    </div>
  )
}

export default ClassInfoForm