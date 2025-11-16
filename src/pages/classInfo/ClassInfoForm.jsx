import React, { useEffect, useState } from 'react'
import styles from './ClassInfoForm.module.css'
import ListTable from '../../components/common/ListTable'
import Modal from '../../components/common/Modal'
import ClassFormModalBody from '../../components/classInfo/ClassFormModalBody'
import { MdNoteAdd } from "react-icons/md";
import { FaCalculator } from "react-icons/fa";
import IconButton from '../../components/common/IconButton'
import { selectClassListRecruiting } from '../../apis/classInfoApis'
import ClacEndDateModalBody from '../../components/classInfo/ClacEndDateModalBody'

//신규 과정 정보 + 과정 등록
const ClassInfoForm = () => {
  //모집 중 과정 목록 조회 저장 변수
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    getClassListRecruiting();
  }, []);

  //모집 중 과정 목록 조회 함수
  const getClassListRecruiting = async () => {
    const respose = await selectClassListRecruiting();
    setClassList(respose.data);
  };

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

  //일정 계산 모달 오픈 여부
  const [isOpenCalcModal, setIsOpenCalcModal] = useState(false);

  //일정 계산 모달 오픈 함수
  const openCalcModal = (size = 'xlarge') => {
    setIsOpenCalcModal(true);
  };

  //일정 계산 모달 닫기 함수
  const closeCalcModal = () => {
    setIsOpenCalcModal(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title_div}></div>
      <div className={styles.class_reg_div}>
        <IconButton onClick={() => openModal('large')}>
          <MdNoteAdd style={{fontSize : '1.1rem'}}/>
          <span>신규 과정 등록</span>
        </IconButton>

        <IconButton onClick={() => openCalcModal('xlarge')}>
          <FaCalculator />
          <span>훈련 일정 계산</span>
        </IconButton>
      </div>
      <div className={styles.list_div}>
        <h2 className={styles.list_title}>모집 중 과정 목록</h2>
        <p className={styles.top_caption}>{classList.length}개의 과정에서 훈련생을 모집하고 있습니다.</p>
        <ListTable>
          <colgroup>
            <col width='5%' />
            <col width='*' />
            <col width='11%' />
            <col width='16%' />
            <col width='7%' />
            <col width='7%' />
            <col width='7%' />
            <col width='7%' />
            <col width='6%' />
            <col width='10%' />
            <col width='5%' />
          </colgroup>
          <thead>
            <tr>
              <td>No</td>
              <td>모집 중 과정</td>
              <td>과정 유형</td>
              <td>운영 기간</td>
              <td>수업일수</td>
              <td>모집정원</td>
              <td>모집인원</td>
              <td>모집률</td>
              <td>담당강사</td>
              <td>수업시간</td>
              <td>강의실</td>
            </tr>
          </thead>
          <tbody>
            {
              classList.length > 0
                ?
                classList.map((classInfo, i) => {
                  return (
                    <tr key={i}>
                      <td>{classList.length - i}</td>
                      <td style={{ textAlign: 'left' }}>{classInfo.classInfoVO.className}</td>
                      <td>
                        <p>{classInfo.classInfoVO.jobTypeVO.jobName}</p>
                        <p>({classInfo.classInfoVO.classTypeVO.classTypeName})</p>
                      </td>
                      <td>{classInfo.classInfoVO.startDate} ~ {classInfo.classInfoVO.endDate}</td>
                      <td>
                        <p>{classInfo.classInfoVO.totalStudyDay}일</p>
                        <p>({classInfo.classInfoVO.totalStudyHour}시간)</p>

                      </td>
                      <td>{classInfo.classInfoVO.classQuota}</td>
                      <td>{classInfo.classInfoVO.confirmStuCnt}</td>
                      <td>{classInfo.classInfoVO.recruitRate}%</td>
                      <td>{classInfo.staffVO.staffName}</td>
                      <td>
                        <p>{classInfo.startTime} ~ {classInfo.endTime}</p>
                        <p>({classInfo.studyDay})</p>
                      </td>
                      <td>{classInfo.classRoomVO.classRoomName}</td>
                      {/* <td>{classInfo.}</td>
                  <td>{classInfo.}</td> */}
                    </tr>
                  )
                })
                :
                <tr>
                  <td colSpan={13}>현재 모집 중인 과정이 없습니다.</td>
                </tr>
            }
          </tbody>
        </ListTable>







      </div>
      <div></div>

      {/* 신규 과정 등록 모달 */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="신규 과정 등록"
        size='medium'
        iconType='add'
      >
        <ClassFormModalBody onClose={closeModal} getClassListRecruiting={getClassListRecruiting} />
      </Modal>

      {/* 신규 과정 등록 모달 */}
      <Modal
        isOpen={isOpenCalcModal}
        onClose={closeCalcModal}
        title="훈련 종료일 및 단위기간 계산"
        size='xlarge'
        iconType='calc'
      >
        <ClacEndDateModalBody onClose={closeCalcModal}/>
      </Modal>

    </div>
  )
}

export default ClassInfoForm