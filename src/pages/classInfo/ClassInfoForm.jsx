import React, { useEffect, useState } from 'react'
import styles from './ClassInfoForm.module.css'
import ListTable from '../../components/common/ListTable'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Textarea from '../../components/common/Textarea'
import Checkbox from '../../components/common/Checkbox'
import Radio from '../../components/common/Radio'
import Modal from '../../components/common/Modal'
import ClassFormModalBody from '../../components/classInfo/ClassFormModalBody'
import { toast } from 'react-toastify';

const ClassInfoForm = () => {


  //과정 등록 모달 오픈 여부
  const [isOpen, setIsOpen] = useState(false);

  //과정 등록 모달 오픈 함수
  const openModal = (size = 'medium') => {
    setIsOpen(true);
  };

  //과정 등록 모달 닫기 함수
  const closeModal = () => {
    setIsOpen(false);
  };

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

        <Textarea /> <br />
        <Checkbox /> <br />
        <Radio /> <br />

        <div className={styles.buttonGroup}>
        <button 
          className={`${styles.button} ${styles.primary}`}
          onClick={() => openModal('small')}
        >
          Small Modal
        </button>
        <button 
          className={`${styles.button} ${styles.primary}`}
          onClick={() => openModal('medium')}
        >
          Medium Modal
        </button>
        <button 
          className={`${styles.button} ${styles.primary}`}
          onClick={() => openModal('large')}
        >
          Large Modal
        </button>
        <button 
          className={`${styles.button} ${styles.primary}`}
          onClick={() => openModal('xlarge')}
        >
          X-Large Modal
        </button>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="신규 과정 등록"
        size='medium'
      >
        <ClassFormModalBody onClose={closeModal}/>
      </Modal>

        
      </div>
      <div className={styles.list_div}></div>
    </div>
  )
}

export default ClassInfoForm