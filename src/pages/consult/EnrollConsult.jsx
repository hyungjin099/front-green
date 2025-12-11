import React, { useEffect, useState } from 'react'
import styles from './EnrollConsult.module.css'
import Accordion from '../../components/common/Accordion'
import EnrollConsultListPerClass from '../../components/consult/EnrollConsultListPerClass';
import EnrollConsultTitle from '../../components/consult/EnrollConsultTitle';
import { selectClassAndConsultList, selectClassListRecruiting } from '../../apis/classInfoApis';
import Modal from '../../components/common/Modal';
import RegConsultModalBody from '../../components/consult/RegConsultModalBody';

//훈련 등록 상담
const EnrollConsult = () => {
  //모집 중 과정 목록 조회 저장 변수
  const [classList, setClassList] = useState([]);

  //아코디언 목록 데이터
  const [accordionData, setAccordionData] = useState([]);

  //훈련생 등록 모달 오픈 여부
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

  //선택한 클래스 번호
  const [selectedClassNum, setSelectedClassNum] = useState(null);

  //훈련생 등록 모달 오픈 함수
  const openAddModal = (size = 'medium') => {
    setIsOpenAddModal(true);
  };

  //훈련생 등록 모달 닫기 함수
  const closeAddModal = () => {
    setIsOpenAddModal(false);
  };

  useEffect(() => {
    getClassListRecruiting();
  }, []);

  useEffect(() => {
    if(classList.length === 0) return;

    //const items = [];

    const items = classList.map((classInfo, i) => {
      return {
        title : <EnrollConsultTitle classInfo={classInfo}/>,
        content : <EnrollConsultListPerClass consultList={classInfo.consultList}/>
      }
    });

    setAccordionData(items);

  }, [classList])

  //모집 중 과정 목록 조회 함수
  const getClassListRecruiting = async () => {
    const respose = await selectClassAndConsultList();
    setClassList(respose.data);
  };

//   const items = [
//   { title: "첫 번째", content: <EnrollConsultListPerClass /> },
//   { title: "두 번째", content: "내용 B" },
//   { title: "세 번째", content: "내용 C" },
//   { title: "네 번째", content: "내용 D" },
// ];

  return (
    <div>
      <Accordion items={accordionData} openAddModal={openAddModal} setSelectedClassNum={setSelectedClassNum}/>

      {/* 신규 학생 등록 모달 */}
      <Modal
        isOpen={isOpenAddModal}
        onClose={closeAddModal}
        title="훈련 등록 상담"
        size='medium'
        iconType='add-user'
      >
        <RegConsultModalBody onClose={closeAddModal} selectedClassNum={selectedClassNum}/>
      </Modal>
    </div>
  )
}

export default EnrollConsult