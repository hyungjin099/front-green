import React from 'react'
import styles from './EnrollConsultListPerClass.module.css'
import Button from '../common/Button'
import ConsultSheet from './ConsultSheet'

//과정별 과정 등록 상담 목록 컴포넌트
const EnrollConsultListPerClass = ({consultList}) => {
  return (
    <div>
      <ConsultSheet consultList={consultList}/>
    </div>
  )
}

export default EnrollConsultListPerClass