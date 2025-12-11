// components/ClassFormModalBody.jsx
import React, { useEffect, useState } from 'react'
import styles from './RegConsultModalBody.module.css'
import Button from '../common/Button'
import FlotingInput from '../common/FlotingInput'
import FlotingDatePicker from '../common/FlotingDatePicker'
import FlotingSelect from '../common/FlotingSelect'
import { insertClassInfo, selectClassListRecruiting } from '../../apis/classInfoApis'
import { toast } from 'react-toastify';
import { useValidation } from '../../util/useValidation';
import { required, minLength, phoneNumber } from '../../util/validationRules';
import BtnRadio from '../common/BtnRadio'
import { selectEnrollListForCheckDuplicate } from '../../apis/enrollApis'
import { getIsPossibleAdd, insertNewConsult, selectConsulttHistory } from '../../apis/consultApis'
import { selectStaffList } from '../../apis/staffApis'
import Modal from '../common/Modal'
import ListTable from '../common/ListTable'
import Tooltip from '../common/Tooltip'
import { CgDanger } from "react-icons/cg";
import { selectStuListForCheckDuplicate } from '../../apis/stuApis'

const RegConsultModalBody = ({ onClose, selectedClassNum }) => {
  //모집 중인 과정 목록
  const [classList, setClassList] = useState([]);

  //영업팀 목록
  const [staffList, setStaffList] = useState([]);

  //정보 중복 학생 목록
  const [stuList, setStuList] = useState([]);

  //수강 이력
  const [enrollHistoryList, setEnrollHistoryList] = useState([]);

  //상담 이력
  const [consultHistoryList, setConsultHistoryList] = useState([]);

  //등록 버튼 활성화 여부
  const [btnDisable, setBtnDisable] = useState(true);

  //이력 조회 모달 오픈 여부
  const [isOpenHistoryModal, setIsOpenHistoryModal] = useState(false);

  //이력 조회 모달 오픈 함수
  const openModal = (size = 'xlarge') => {
    setIsOpenHistoryModal(true);
  };

  //이력 조회 모달 닫기 함수
  const closeModal = () => {
    setIsOpenHistoryModal(false);
  };

  const {
    values: inputData,
    errors,
    touched,
    setValue,
    setTouchedField,
    validateField,
    validateAllFields
  } = useValidation({
    stuNum: 0,
    stuName: '',
    stuBirthday: '',
    stuPhone: '',
    classNum: selectedClassNum.toString(),
    managerNum : '',
    isDuplicate : 'N'
  });

  useEffect(() => {
    getInitDataList();
  }, []);

  //모집 중 과정 목록 조회 함수
  const getClassListRecruiting = async () => {
    const respose = await selectClassListRecruiting();
    setClassList(respose.data);
  };

  const getInitDataList = async () => {
    const [response1, response2] = await Promise.all([
      selectClassListRecruiting(),
      selectStaffList('영업')
    ]);

    setClassList(response1.data);
    setStaffList(response2.data);
  }

  const handleInputData = (e) => {
    const { name, value } = e.target;
    setValue(name, value);

    // 날짜 필드는 값이 변경되면 자동으로 touched 처리
    if (name === 'stuBirthday') {
      setTouchedField(name);
    }

    // 실시간 validation (터치된 필드만)
    const rules = getValidationRules(name);
    if (rules && touched[name]) {
      validateField(name, value, rules);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedField(name);

    const rules = getValidationRules(name);
    if (rules) {
      validateField(name, value, rules);
    }
  };



  const getValidationRules = (fieldName) => {
    const rules = {
      stuName: [
        required('훈련생명 필수'),
        minLength(2, '2글자 이상 입력해주세요.')
      ],
      stuBirthday: [required('생년월일 필수')],
      classNum: [required('상담 신청 과정 필수')],
      managerNum: [required('담당자 필수')],
      stuPhone: [
        required('휴대폰 번호 필수'),
        phoneNumber('올바른 형식이 아닙니다')
      ]
    };
    return rules[fieldName];
  };

  const isFieldValid = (fieldName) => {
    const fieldValue = inputData[fieldName];
    const hasError = !errors[fieldName];
    const isTouched = touched[fieldName];

    if (!isTouched || errors[fieldName]) {
      return false;
    }

    // 배열인 경우
    if (Array.isArray(fieldValue)) {
      return fieldValue.length > 0;
    }

    // 문자열인 경우
    return fieldValue?.trim() !== '';
  };

  //이력 확인 버튼 클릭 시 기등록 학생 확인 함수
  const checkDuplicate = async() => {
    if(inputData.stuName.trim() === '' || inputData.stuBirthday.trim() === ''){
      toast.error('학생명, 생년월일 필수!!', { containerId: 'topRight' });
      return ;
    }

    const param = {stuName : inputData.stuName, stuBirthday : inputData.stuBirthday}

    //학생 중복 체크
    const reuslt = await selectStuListForCheckDuplicate(param);
    setStuList(reuslt.data);

    //상담, 수강 이력이 없다면...
    if(reuslt.data.length === 0){
      toast.info('미등록 훈련생입니다. 👌', { containerId: 'topRight' });
      setBtnDisable(false);
      return ;
    }

    setIsOpenHistoryModal(true);
  };

  //상담 및 수강 이력 조회
  const getHistory = async (stuNum) => {
    const [response1, response2] = await Promise.all([
      //수강 이력 조회
      selectEnrollListForCheckDuplicate(stuNum),
      //상담 이력 조회
      selectConsulttHistory(stuNum)
    ]);

    setEnrollHistoryList(response1.data);
    setConsultHistoryList(response2.data);
  }

  //등록버튼 클릭 시 신규 상담 등록
  const regConsult = async () => {
    // 모든 필드 validation
    const isValid = validateAllFields(getValidationRules);

    if (!isValid) {
      toast.error('입력 정보를 확인해주세요.', { containerId: 'topRight' });
      return;
    }

    //기존 등록 학생이라면 중복 확인
    if(inputData.isDuplicate === 'Y'){
      //동일 학생이 한 과정에 중복 상담 체크인지 확인
      const isDuplicateStu = await getIsPossibleAdd(inputData);

      if (!isDuplicateStu.data) {
        toast.error('상담 내역에 존재하는 학생입니다.', { containerId: 'topRight' });
        return;
      }
    }

    await toast.promise(
      insertNewConsult(inputData),
      {
        pending: '훈련생 정보 등록 중... ⏳',
        success: '훈련생이 등록되었습니다! 👌',
        error: '헐..등록 실패... '
      },
      { containerId: 'topRight' }
    );

    onClose();
  }

  //동일 학생이 한 과정에 중복 상담 체크인지 확인
  const isPossibleAdd = async () => {
    const result = await getIsPossibleAdd();
  }

  return (
    <div className={styles.modal_container}>
      <div className={styles.flex_row}>
        <div style={{display:'flex', width:'50%', gap:'0.5rem'}}>
          <BtnRadio 
            name='isDuplicate' 
            value='N' 
            color='yellow' 
            label='신규 훈련생' 
            readOnly={true} 
            checked={inputData.isDuplicate === 'N'}
            onChange={handleInputData}
          />
          <BtnRadio 
            name='isDuplicate' 
            value='Y'
            color='yellow' 
            label='기존 훈련생' 
            readOnly={true} 
            checked={inputData.isDuplicate === 'Y'}
            onChange={handleInputData}
          />
        </div>
        <Button 
          variant='success' 
          onClick={checkDuplicate}
          style={{maxHeight : '48px'}}
        >이력 확인</Button>
      </div>
      <div className={styles.flex_row}>
        <FlotingInput
          label='학생명'
          name='stuName'
          value={inputData.stuName}
          onChange={e => {
            handleInputData(e);
            setBtnDisable(true);
          }}
          onBlur={handleBlur}
          error={errors.stuName}
          touched={touched.stuName}
          isValid={isFieldValid('stuName')}
        />
        <FlotingDatePicker
          label="생년월일"
          name='stuBirthday'
          value={inputData.stuBirthday}
           onChange={e => {
            handleInputData(e);
            setBtnDisable(true);
          }}
          error={errors.stuBirthday}
          touched={touched.stuBirthday}
          isValid={isFieldValid('stuBirthday')}
        />
       
      </div>
      <div className={styles.flex_row}>
        <FlotingInput
          label='연락처'
          name='stuPhone'
          value={inputData.stuPhone}
          onChange={handleInputData}
          onBlur={handleBlur}
          error={errors.stuPhone}
          touched={touched.stuPhone}
          isValid={isFieldValid('stuPhone')}
        />
        <FlotingSelect
          label='상담 담당자'
          name='managerNum'
          value={inputData.managerNum}
          onChange={handleInputData}
          onBlur={handleBlur}
          error={errors.managerNum}
          touched={touched.managerNum}
          isValid={isFieldValid('managerNum')}
        >
          <option value="">Choose...</option>
          {staffList.map(staff => (
            <option key={staff.staffNum} value={staff.staffNum}>{staff.nickName} | {staff.staffName}</option>
          ))}
        </FlotingSelect>
      </div>
      <div>
        <FlotingSelect
          label='상담 과정명'
          name='classNum'
          value={inputData.classNum}
          onChange={handleInputData}
          onBlur={handleBlur}
          error={errors.classNum}
          touched={touched.classNum}
          isValid={isFieldValid('classNum')}
        >
          {classList.map(classInfo => (
            <option key={classInfo.classNum} value={classInfo.classNum}>
              {classInfo.classInfoVO.className} | {classInfo.classInfoVO.startDate}
            </option>
          ))}
        </FlotingSelect>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'end',
        gap: '0.7rem'
      }}>
        <Button variant='cancel' onClick={onClose}>취소</Button>
        <Button onClick={regConsult} disabled={btnDisable}>등록</Button>
      </div>





      {/* 수강, 상담 이력 조회 모달 */}
      <Modal
        isOpen={isOpenHistoryModal}
        onClose={closeModal}
        title="수강 및 상담 이력"
        size='xlarge'
        iconType='add-user'
      >
        <div className={styles.modal_div}>
          <div 
            style={{
              backgroundColor : '#f3f3f3ff',
              padding : '1rem',
              borderRadius : '8px',
              display : 'flex',
              gap : '0.5rem'
            }}
          >
            <div style={{paddingTop : '2px'}}>
              <span style={{color : 'red'}}><CgDanger /></span>
            </div>
            <div>
              <p>현재 훈련생은 이미 교육원에 등록된 훈련생일 가능성이 있습니다.</p>
              <p>동일 훈련생을 판별하는 기준은 이름과 생년월일입니다.</p>
              <p>우연히 이름과 생년월일이 같은 다른 인물일 수 있습니다.</p>
            </div>
          </div>
          <div>
            <p className={styles.history_title}>기존 이력이 있는 훈련생 정보</p>
            <ListTable>
              <colgroup>
                <col width={'22%'}/>
                <col width={'22%'}/>
                <col width={'26%'}/>
                <col width={'15%'}/>
                <col width={'15%'}/>
              </colgroup>
              <thead>
                <tr>
                  <td>학생명</td>
                  <td>생년월일</td>
                  <td>연락처</td>
                  <td>이력조회</td>
                  <td>선 택</td>
                </tr>
              </thead>
              <tbody>
              {
                stuList.length > 0 
                ?
                stuList.map((stu, i) => {
                  return (
                    <tr key={i}>
                      <td>{stu.stuName}</td>
                      <td>{stu.stuBirthday}</td>
                      <td>{stu.stuPhone}</td>
                      <td>
                        <Button 
                          variant='info'
                          onClick={() => getHistory(stu.stuNum)}
                          style={{
                            width : '100%'
                          }}
                        >이력조회</Button>
                      </td>
                      <td>
                        <Button 
                          variant='success'
                          style={{
                            width : '100%'
                          }}
                          onClick={() => {
                            setValue('isDuplicate', 'Y');
                            setValue('stuNum', stu.stuNum);
                            setIsOpenHistoryModal(false);
                            setBtnDisable(false);
                          }}
                        >선 택</Button>
                      </td>
                    </tr>
                  )
                })
                :
                <tr>
                  <td colSpan={5}>데이터가 없습니다.</td>
                </tr>
              }
              </tbody>
            </ListTable>
          </div>
          <div>
            <div style={{
              display : 'flex',
              justifyContent : 'end',
              margin : '0.5rem 0rem'
            }}>
              <Button 
                variant='primary' 
                style={{
                  width : '230px'
                }}
                onClick={() => {
                  setValue('isDuplicate', 'N');
                  setValue('stuNum', 0);
                  setIsOpenHistoryModal(false);
                  setBtnDisable(false);
                }}
              >신규 훈련생으로 상담 등록</Button>
            </div>
          </div>

          {
            consultHistoryList.length > 0 &&
            <div>
              <p className={styles.history_title}>상담이력</p>
              <ListTable>
                <colgroup>
                  <col width={'5%'}/>
                  <col width={'*'}/>
                  <col width={'25%'}/>
                  <col width={'10%'}/>
                  <col width={'10%'}/>
                </colgroup>
                <thead>
                  <tr>
                    <td>No</td>
                    <td>상담 과정</td>
                    <td>과정 운영 기간</td>
                    <td>담당자</td>
                    <td>상담내역</td>
                  </tr>
                </thead>
                <tbody>
                {
                  consultHistoryList.map((consult, i) => {
                    return (
                      <tr key={consult.consultNum}>
                        <td>{consultHistoryList.length - i}</td>
                        <td>{consult.classInfoVO.className}</td>
                        <td>{consult.classInfoVO.endDate} ~ {consult.classInfoVO.startDate}</td>
                        <td>{consult.staffVO.staffName}</td>
                        <td>
                          <Tooltip 
                            content={consult.consultContent || "상담 내용이 없습니다."} 
                            position="top"
                          >
                            <span style={{ color: '#673de6', textDecoration: 'underline', cursor: 'pointer' }}>
                              내역 확인
                            </span>
                          </Tooltip>
                        </td>
                      </tr>
                    )
                  })
                }  
                </tbody>
              </ListTable>
            </div>
          }    

          {
            enrollHistoryList.length > 0 &&
            <div>
              <p className={styles.history_title}>수강이력</p>
              <ListTable>
                <colgroup>
                  <col width={'5%'}/>
                  <col width={'*'}/>
                  <col width={'25%'}/>
                  <col width={'10%'}/>
                  <col width={'10%'}/>
                </colgroup>
                <thead>
                  <tr>
                    <td>No</td>
                    <td>수강 과정</td>
                    <td>과정 운영 기간</td>
                    <td>강 사</td>
                    <td>수료 여부</td>
                  </tr>
                </thead>
                <tbody>
                {
                  enrollHistoryList.map((enroll, i) => {
                    return (
                      <tr key={enroll.enrollNum}>
                        <td>{enrollHistoryList.length - i}</td>
                        <td>{enroll.classInfoVO.className}</td>
                        <td>{enroll.classInfoVO.endDate} ~ {enroll.classInfoVO.startDate}</td>
                        <td>{enroll.staffVO.staffName}</td>
                        <td>{enroll.stuStatus}</td>
                      </tr>
                    )
                  })
                }  
                </tbody>
              </ListTable>
            </div>
          }
        </div>
      </Modal>
    </div>
  )
}

export default RegConsultModalBody