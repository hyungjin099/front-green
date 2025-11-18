import React from 'react'
import styles from './StuManage.module.css'
import ListTable from '../../components/common/ListTable'

const StuManage = () => {
  return (
    <div>
      <div>
        <ListTable>
          <thead>
            <tr>
              <td>No</td>
              <td>훈련생명</td>
              <td>생년월일</td>
              <td>연락처</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </thead>
          <tbody></tbody>
        </ListTable>
      </div>
    </div>
  )
}

export default StuManage