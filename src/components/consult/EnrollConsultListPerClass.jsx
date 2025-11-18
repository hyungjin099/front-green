import React from 'react'
import styles from './EnrollConsultListPerClass.module.css'
import Button from '../common/Button'

//과정별 과정 등록 상담 목록 컴포넌트
const EnrollConsultListPerClass = ({item}) => {
  return (
    <div>
      <div>
        <table border={1}>
          <tbody>
            <tr>
              <td>학생명1</td>
              <td>학생명2</td>
              <td>학생명3</td>
            </tr>
            <tr>
              <td>담당자1</td>
              <td>담당자2</td>
              <td>담당자3</td>
            </tr>
            <tr>
              <td>상담내용1</td>
              <td>상담내용2</td>
              <td>상담내용3</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EnrollConsultListPerClass